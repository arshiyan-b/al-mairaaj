import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Wallet as WalletIcon,
  Plus,
  Gift,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  CheckCircle2,
  X,
  Clock,
  XCircle,
  History,
  Ticket,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SHOW_INCREMENT = 5;
const REQUESTS_SHOW_INCREMENT = 5;

// Formats a transaction's date whether the API sends a pre-formatted
// string (e.g. "Oct 24, 2026") or a raw timestamp (e.g. "2026-10-24T00:00:00Z").
function formatTxDate(tx) {
  const raw = tx.date || tx.created_at;
  if (!raw) return "";
  const parsed = new Date(raw);
  if (isNaN(parsed.getTime())) return raw; // already formatted, just show it
  return parsed.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" });
}

// Wallet transactions come with an explicit `type`: "topup" or "redeem".
// Anything unrecognized falls back to "redeem" (safer to show as a debit).

function getTxTitle(tx) {
  return tx.description || tx.title || tx.label || "Transaction";
}

// Maps a payment_method value to a human-readable label.
function formatPaymentMethod(method) {
  const map = { easypaisa: "EasyPaisa", jazzcash: "JazzCash", bank: "Bank Transfer" };
  return map[method] || method || "—";
}

const STATUS_STYLES = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${style.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {style.label}
    </span>
  );
}

// Pulls the first message for a given field out of Laravel's validation
// error bag shape: { code: ["Invalid voucher code."], ... }
function firstError(errors, field) {
  if (!errors) return null;
  const val = errors[field];
  if (!val) return null;
  return Array.isArray(val) ? val[0] : val;
}

const Wallet = () => {
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [topupRequests, setTopupRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(SHOW_INCREMENT);
  const [visibleRequestCount, setVisibleRequestCount] = useState(REQUESTS_SHOW_INCREMENT);

  const [successMessage, setSuccessMessage] = useState(
    typeof window !== "undefined" && window.__flash?.success ? window.__flash.success : null
  );
  const [errorMessage, setErrorMessage] = useState(
    typeof window !== "undefined" && window.__flash?.error ? window.__flash.error : null
  );

  // Redeem voucher modal state
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.__flash) return;

    // StudentRedeemVoucherRequest fails validation by redirecting back with
    // a session-flashed `errors` bag (e.g. { code: ["Invalid voucher code."] })
    // and the old `code` input. Surface that in the same modal the user was
    // just using, instead of losing the message on the redirect.
    const codeError = firstError(window.__flash.errors, "code");
    if (codeError) {
      setVoucherCode(window.__flash.old?.code || "");
      setRedeemError(codeError);
      setShowRedeemModal(true);
    }

    window.__flash.success = null;
    window.__flash.error = null;
    window.__flash.errors = null;
    window.__flash.old = null;
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/student/wallet-data", { headers: { Accept: "application/json" } })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load wallet (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setWallet(data.wallet || { balance: 0, currency: "PKR", status: "active" });
          // Transactions come back as a top-level key, not nested under wallet.transactions.
          setTransactions(data.walletTransactions || []);
          setTopupRequests(data.topupRequests || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setWallet({ balance: 0, currency: "PKR", status: "active" });
          setTransactions([]);
          setTopupRequests([]);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const openRedeemModal = () => {
    setVoucherCode("");
    setRedeemError(null);
    setShowRedeemModal(true);
  };

  const closeRedeemModal = () => {
    if (redeeming) return; // don't allow closing mid-request
    setShowRedeemModal(false);
    setVoucherCode("");
    setRedeemError(null);
  };

  const handleRedeem = async () => {
    const code = voucherCode.trim();
    if (!code) {
      setRedeemError("Please enter a voucher code.");
      return;
    }

    // The controller redirects back to student.wallet with a flash 'success'
    // message on success, or redirects back with a flashed 'errors' bag on
    // validation failure (StudentRedeemVoucherRequest — invalid code, already
    // redeemed, etc). Either way it's session-based, not JSON — so this
    // submits a real form and lets the browser navigate, same as handleEnroll
    // does for live classes. The wallet page reads window.__flash on mount
    // to show the success banner or, on failure, reopen this modal with the
    // validation message attached.
    setRedeeming(true);
    setRedeemError(null);

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || "";

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/student/redeem-voucher";

    const token = document.createElement("input");
    token.type = "hidden";
    token.name = "_token";
    token.value = csrfToken;

    const codeInput = document.createElement("input");
    codeInput.type = "hidden";
    codeInput.name = "code";
    codeInput.value = code;

    form.appendChild(token);
    form.appendChild(codeInput);
    document.body.appendChild(form);
    form.submit();
  };

  if (loading) return <WalletSkeleton />;

  const currency = wallet.currency;
  const balance = Number(wallet.balance ?? 0);
  const visibleTransactions = transactions.slice(0, visibleCount);
  const hasMore = visibleCount < transactions.length;

  const sortedRequests = [...topupRequests].sort((a, b) => {
    const dateA = new Date(a.requested_at || a.created_at || 0).getTime();
    const dateB = new Date(b.requested_at || b.created_at || 0).getTime();
    return dateB - dateA;
  });
  const visibleRequests = sortedRequests.slice(0, visibleRequestCount);
  const hasMoreRequests = visibleRequestCount < sortedRequests.length;
  const hasTopupRequests = sortedRequests.length > 0;

  return (
    <div className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen relative z-0">
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mb-6 overflow-hidden"
          >
            <div className="flex items-start justify-between gap-3 rounded-xl border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-300">{successMessage}</p>
                </div>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                aria-label="Dismiss"
                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mb-6 overflow-hidden"
          >
            <div className="flex items-start justify-between gap-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-4">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-800 dark:text-red-300">{errorMessage}</p>
                </div>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                aria-label="Dismiss"
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="flex items-start justify-between gap-4 mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-left">
          <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-teal-700 to-indigo-700 text-transparent bg-clip-text">
            My Wallet
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Manage your balance and view transactions.
          </p>
        </div>

        <button
          onClick={openRedeemModal}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-shadow flex-shrink-0"
        >
          <Ticket className="h-4 w-4" />
          Redeem Voucher
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Balance & Action Cards */}
        <div className="lg:col-span-1 flex flex-col gap-6 h-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex-1 flex flex-col relative"
          >
            <Card className="flex-1 min-h-[260px] p-6 rounded-xl shadow-md hover:shadow-xl border-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex flex-col relative">
              <div className="flex items-center gap-2 absolute top-4 left-6">
                <WalletIcon className="h-5 w-5" />
                <span className="font-medium text-white/80">Total Balance</span>
              </div>

              <CardContent className="flex-1 flex flex-col items-center justify-center p-0 gap-1">
                <div className="text-4xl md:text-5xl font-bold tracking-tight text-center">
                  {currency} {balance.toFixed(2)}
                </div>
                {wallet.status && wallet.status !== "active" && (
                  <span className="text-xs uppercase tracking-wide text-white/70">{wallet.status}</span>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card
                onClick={() => navigate("/top-up")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && navigate("/top-up")}
                className="hover:bg-indigo-50 dark:hover:bg-gray-800 cursor-pointer transition-colors shadow-md hover:shadow-xl border-0 group h-full flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <CardContent className="p-4 flex flex-col items-center justify-center gap-3 flex-1">
                  <div className="bg-indigo-100 dark:bg-indigo-900/40 p-3 rounded-full group-hover:scale-110 transition-transform">
                    <Plus className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Top-up</span>
                </CardContent>
              </Card>
            </motion.div>

            {/* <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card
                onClick={() => navigate("/withdraw")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && navigate("/withdraw")}
                className="hover:bg-purple-50 dark:hover:bg-gray-800 cursor-pointer transition-colors shadow-md hover:shadow-xl border-0 group h-full flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <CardContent className="p-4 flex flex-col items-center justify-center gap-3 flex-1">
                  <div className="bg-purple-100 dark:bg-purple-900/40 p-3 rounded-full group-hover:scale-110 transition-transform">
                    <Gift className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Withdraw</span>
                </CardContent>
              </Card>
            </motion.div> */}
          </div>
        </div>

        {/* Transactions Card */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="h-full p-6 rounded-xl shadow-md hover:shadow-xl border-0 bg-white dark:bg-gray-800 flex flex-col">
            <CardHeader className="p-0 mb-4 flex-shrink-0">
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              {transactions.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                  <Receipt className="h-8 w-8 text-gray-300" />
                  <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                    No transactions yet
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Your top-ups, purchases, and refunds will show up here.
                  </p>
                </div>
              ) : (
                <div className="overflow-y-auto max-h-[350px] pr-2 flex flex-col gap-4">
                  {visibleTransactions.map((tx) => {
                    const isCredit = tx.transaction_type === "credit";
                    const amount = Math.abs(Number(tx.amount) || 0);

                    return (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2 rounded-full ${
                              isCredit
                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {isCredit ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">{getTxTitle(tx)}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatTxDate(tx)}
                              {tx.payment_method && <> {formatPaymentMethod(tx.payment_method)}</>}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${isCredit ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`}>
                            {isCredit ? "+" : "-"}{currency} {amount.toFixed(2)}
                          </div>
                          {tx.balance_after != null && (
                            <div className="text-xs text-gray-400 dark:text-gray-500">
                              Bal: {currency} {Number(tx.balance_after).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {hasMore && (
                    <div className="text-center pt-3 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => setVisibleCount((prev) => prev + SHOW_INCREMENT)}
                        className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors text-sm hover:underline"
                      >
                        Show more transactions
                      </button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Top-up Request History — only rendered when there's data */}
        {hasTopupRequests && (
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card className="p-6 rounded-xl shadow-md hover:shadow-xl border-0 bg-white dark:bg-gray-800">
              <CardHeader className="p-0 mb-4 flex-shrink-0">
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <History className="h-5 w-5 text-gray-400" />
                  Pending Top-up Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col gap-3">
                  {visibleRequests.map((req) => (
                    <div
                      key={req.id}
                      className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {currency} {Number(req.amount).toFixed(2)}
                          </h4>
                          <StatusBadge status={req.status} />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatPaymentMethod(req.payment_method)} &middot; {formatTxDate({ date: req.requested_at || req.created_at })}
                        </p>
                      </div>
                      {req.status === "rejected" && req.admin_note && (
                        <p className="text-xs text-red-500 dark:text-red-400 max-w-xs">
                          {req.admin_note}
                        </p>
                      )}
                    </div>
                  ))}

                  {hasMoreRequests && (
                    <div className="text-center pt-3 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => setVisibleRequestCount((prev) => prev + REQUESTS_SHOW_INCREMENT)}
                        className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors text-sm hover:underline"
                      >
                        Show more requests
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Redeem Voucher modal */}
      <AnimatePresence>
        {showRedeemModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeRedeemModal}
          >
            <motion.div
              className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-full">
                    <Ticket className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Redeem Voucher</h3>
                </div>
                <button
                  onClick={closeRedeemModal}
                  disabled={redeeming}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Enter your voucher code below to add its value to your wallet balance.
              </p>

              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !redeeming && handleRedeem()}
                placeholder="e.g. WELCOME500"
                autoFocus
                disabled={redeeming}
                className="mt-4 w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
              />

              {redeemError && (
                <p className="mt-2 text-xs text-red-500 dark:text-red-400">{redeemError}</p>
              )}

              <div className="mt-5 flex gap-3">
                <button
                  onClick={closeRedeemModal}
                  disabled={redeeming}
                  className="flex-1 rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRedeem}
                  disabled={redeeming}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-60"
                >
                  {redeeming ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Redeeming...
                    </>
                  ) : (
                    "Redeem"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function WalletSkeleton() {
  return (
    <div className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-4 w-72 rounded" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Skeleton className="h-48 rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default Wallet;
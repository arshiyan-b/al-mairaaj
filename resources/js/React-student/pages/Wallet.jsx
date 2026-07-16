import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet as WalletIcon, Plus, Gift, ArrowUpRight, ArrowDownLeft, Receipt } from "lucide-react";
import { motion } from "framer-motion";

const SHOW_INCREMENT = 5;

// Formats a transaction's date whether the API sends a pre-formatted
// string (e.g. "Oct 24, 2026") or a raw timestamp (e.g. "2026-10-24T00:00:00Z").
function formatTxDate(tx) {
  const raw = tx.date || tx.created_at;
  if (!raw) return "";
  const parsed = new Date(raw);
  if (isNaN(parsed.getTime())) return raw; // already formatted, just show it
  return parsed.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" });
}

// Infers credit/debit if the API doesn't send an explicit `type` field,
// falling back to the sign of the amount.
function getTxType(tx) {
  if (tx.type) return tx.type;
  const amt = Number(tx.amount);
  return amt < 0 ? "debit" : "credit";
}

function getTxTitle(tx) {
  return tx.title || tx.description || tx.label || "Transaction";
}

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(SHOW_INCREMENT);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/student/wallet-data", { headers: { Accept: "application/json" } })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load wallet (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setWallet(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!wallet) return <WalletSkeleton />;

  const currency = wallet.currency || "PKR";
  const balance = Number(wallet.balance ?? 0);
  const transactions = wallet.transactions || [];
  const visibleTransactions = transactions.slice(0, visibleCount);
  const hasMore = visibleCount < transactions.length;

  return (
    <div className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen relative z-0">
      <motion.div
        className="text-left mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-teal-700 to-indigo-700 text-transparent bg-clip-text">
          My Wallet
        </h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          Manage your balance and view transactions.
        </p>
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

              {/* Amount */}
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
              <Card className="hover:bg-indigo-50 dark:hover:bg-gray-800 cursor-pointer transition-colors shadow-md hover:shadow-xl border-0 group h-full flex flex-col">
                <CardContent className="p-4 flex flex-col items-center justify-center gap-3 flex-1">
                  <div className="bg-indigo-100 dark:bg-indigo-900/40 p-3 rounded-full group-hover:scale-110 transition-transform">
                    <Plus className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Top-up</span>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="hover:bg-purple-50 dark:hover:bg-gray-800 cursor-pointer transition-colors shadow-md hover:shadow-xl border-0 group h-full flex flex-col">
                <CardContent className="p-4 flex flex-col items-center justify-center gap-3 flex-1">
                  <div className="bg-purple-100 dark:bg-purple-900/40 p-3 rounded-full group-hover:scale-110 transition-transform">
                    <Gift className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Redeem</span>
                </CardContent>
              </Card>
            </motion.div>
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
                    const type = getTxType(tx);
                    const isCredit = type === "credit";
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
                            <p className="text-sm text-gray-500 dark:text-gray-400">{formatTxDate(tx)}</p>
                          </div>
                        </div>
                        <div className={`font-semibold ${isCredit ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`}>
                          {isCredit ? "+" : "-"}{currency} {amount.toFixed(2)}
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
      </div>
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
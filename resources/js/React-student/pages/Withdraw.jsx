import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Wallet as WalletIcon,
  Banknote,
  Smartphone,
  Building2,
  CheckCircle2,
  Loader2,
  Clock,
  ChevronDown,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

// Inlined here temporarily to rule out a broken import path. Once you confirm
// where csrf.js actually lives in your project, this can go back to:
//   import { withCsrfHeaders } from "../lib/csrf";
//
// Laravel auto-sets an encrypted XSRF-TOKEN cookie on every response for
// requests going through the `web` middleware group. We read it and send
// it back as X-XSRF-TOKEN, which VerifyCsrfToken also accepts.
function getCookie(name) {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  if (!match) return null;
  return decodeURIComponent(match.split("=").slice(1).join("="));
}

function withCsrfHeaders(extraHeaders = {}) {
  const token = getCookie("XSRF-TOKEN");

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { "X-XSRF-TOKEN": token } : {}),
    ...extraHeaders,
  };
}

const WITHDRAWAL_METHODS = [
  { id: "bank", label: "Bank Transfer", icon: Building2 },
  { id: "easypaisa", label: "EasyPaisa", icon: Smartphone },
  { id: "jazzcash", label: "JazzCash", icon: Smartphone },
];

const BANK_OPTIONS = [
  "Allied Bank",
  "Askari Bank",
  "Bank Al Habib",
  "Bank Alfalah",
  "Faysal Bank",
  "Habib Bank Limited (HBL)",
  "JS Bank",
  "MCB Bank",
  "Meezan Bank",
  "National Bank of Pakistan",
  "Soneri Bank",
  "Standard Chartered Bank",
  "United Bank Limited (UBL)",
];

const Withdraw = () => {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState(null);

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(WITHDRAWAL_METHODS[0].id);
  const [accountTitle, setAccountTitle] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [bankMenuOpen, setBankMenuOpen] = useState(false);
  const bankMenuRef = useRef(null);

  useEffect(() => {
    if (!bankMenuOpen) return;

    const handleClickOutside = (e) => {
      if (bankMenuRef.current && !bankMenuRef.current.contains(e.target)) {
        setBankMenuOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setBankMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [bankMenuOpen]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/student/wallet-data", {
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load wallet (${res.status})`);
        }

        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setWallet(data.wallet || null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const currency = wallet?.currency || "PKR";
  const balance = Number(wallet?.balance ?? 0);

  const requestedAmount = Number(amount);

  const isValidAmount =
    Number.isFinite(requestedAmount) &&
    requestedAmount > 0 &&
    requestedAmount <= balance;

  const isBank = method === "bank";

  const isValidAccount =
    accountTitle.trim().length > 0 &&
    accountNumber.trim().length >= 5 &&
    (!isBank || bankName.trim().length > 0);

  const canSubmit = isValidAmount && isValidAccount;

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(value);
  };

  const handleAccountNumberChange = (e) => {
    const value = e.target.value.replace(/[^0-9A-Za-z-]/g, "");
    setAccountNumber(value);
  };

  const handleMethodChange = (newMethod) => {
    setMethod(newMethod);

    // Clear bank name when switching away from Bank Transfer
    if (newMethod !== "bank") {
      setBankName("");
      setBankMenuOpen(false);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setSubmitError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/student/withdraw-request", {
        method: "POST",
        credentials: "same-origin",
        headers: withCsrfHeaders(),
        body: JSON.stringify({
          amount: requestedAmount,
          method,
          account_title: accountTitle.trim(),
          account_number: accountNumber.trim(),
          bank_name: isBank ? bankName.trim() : undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.message ||
            `Withdrawal request failed (${res.status})`
        );
      }

      setSuccess({
        amount: requestedAmount,
        reference: data?.reference || data?.id || null,
        status: data?.status || "pending",
      });

      setAmount("");
      setAccountTitle("");
      setAccountNumber("");
      setBankName("");

      if (typeof data?.balance !== "undefined") {
        setWallet((prev) =>
          prev
            ? {
                ...prev,
                balance: data.balance,
              }
            : prev
        );
      }
    } catch (err) {
      setSubmitError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!wallet) {
    return <WithdrawSkeleton />;
  }

  return (
    <div className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen relative z-0">
      {/* Page Header */}
      <motion.div
        className="text-left mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-teal-700 to-indigo-700 text-transparent bg-clip-text">
          Withdraw Balance
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
          Withdraw funds from your wallet to your bank or mobile account.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Current Balance */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="h-full min-h-[220px] p-6 rounded-xl shadow-md hover:shadow-xl border-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex flex-col relative">
            <div className="flex items-center gap-2 absolute top-4 left-6">
              <WalletIcon className="h-5 w-5" />

              <span className="font-medium text-white/80">
                Available Balance
              </span>
            </div>

            <CardContent className="flex-1 flex flex-col items-center justify-center p-0 gap-1">
              <div className="text-4xl md:text-5xl font-bold tracking-tight text-center">
                {currency} {balance.toFixed(2)}
              </div>

              <span className="text-xs text-white/70">
                Max you can withdraw right now
              </span>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right: Withdrawal Form */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="h-full p-6 rounded-xl shadow-md hover:shadow-xl border-0 bg-white dark:bg-gray-800 flex flex-col">
            <CardHeader className="p-0 mb-4 flex-shrink-0">
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Request Withdrawal
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 flex-1 flex flex-col gap-6">
              {/* Amount */}
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">
                  Amount to withdraw
                </label>

                <div className="mt-1 flex items-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 transition-colors focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500">
                  <Banknote className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />

                  <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                    {currency}
                  </span>

                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 outline-none"
                  />
                </div>

                {amount && !isValidAmount && (
                  <p className="mt-1 text-xs text-red-500">
                    Enter an amount between {currency} 0.01 and{" "}
                    {currency} {balance.toFixed(2)}
                  </p>
                )}
              </div>

              {/* Withdrawal Method */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Send to
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {WITHDRAWAL_METHODS.map(
                    ({ id, label, icon: Icon }) => {
                      const isActive = method === id;

                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handleMethodChange(id)}
                          className={`w-full h-20 flex flex-col items-center justify-center gap-2 rounded-lg border text-xs font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm"
                              : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-indigo-400"
                          }`}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />

                          <span className="whitespace-nowrap">
                            {label}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Account Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Account Title */}
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Account title
                  </label>

                  <input
                    type="text"
                    placeholder="Full name on account"
                    value={accountTitle}
                    onChange={(e) =>
                      setAccountTitle(e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Account Number */}
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    {isBank
                      ? "IBAN / Account number"
                      : "Mobile number"}
                  </label>

                  <input
                    type="text"
                    placeholder={
                      isBank
                        ? "PKxx xxxx xxxx xxxx"
                        : "03xxxxxxxxx"
                    }
                    value={accountNumber}
                    onChange={handleAccountNumberChange}
                    className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Bank Name dropdown - always occupies its slot so the card
                    never resizes when switching methods; only its visibility
                    and interactivity toggle. */}
                <div
                  className={`sm:col-span-2 transition-opacity duration-150 ${
                    isBank ? "opacity-100" : "opacity-0 pointer-events-none select-none"
                  }`}
                  aria-hidden={!isBank}
                >
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Bank name
                  </label>

                  <div className="relative mt-1" ref={bankMenuRef}>
                    <button
                      type="button"
                      tabIndex={isBank ? 0 : -1}
                      onClick={() => setBankMenuOpen((prev) => !prev)}
                      className="w-full flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 text-sm text-left outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                    >
                      <span className={bankName ? "text-gray-900 dark:text-gray-100" : "text-gray-400"}>
                        {bankName || "Select a bank"}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform ${
                          bankMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {bankMenuOpen && (
                      <div className="absolute z-20 top-full left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                        {BANK_OPTIONS.map((bank) => {
                          const isSelected = bankName === bank;
                          return (
                            <button
                              key={bank}
                              type="button"
                              onClick={() => {
                                setBankName(bank);
                                setBankMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors ${
                                isSelected
                                  ? "text-indigo-700 dark:text-indigo-300 font-medium"
                                  : "text-gray-700 dark:text-gray-200"
                              }`}
                            >
                              {bank}
                              {isSelected && <Check className="h-4 w-4 flex-shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Error */}
              {submitError && (
                <p className="text-sm text-red-500">
                  {submitError}
                </p>
              )}

              {/* Success */}
              {success && (
                <div className="flex items-start gap-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 text-sm text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />

                  <span>
                    Withdrawal of {currency}{" "}
                    {Number(success.amount).toFixed(2)} requested
                    {success.reference
                      ? ` · Ref: ${success.reference}`
                      : ""}
                    . Status: {success.status}.
                  </span>
                </div>
              )}

              {/* Processing Notice */}
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-700 dark:text-amber-400">
                <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />

                <span>
                  Withdrawal requests are reviewed manually and
                  typically settle within 1–3 business days.
                </span>
              </div>

              {/* Submit */}
              <div className="mt-auto pt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit || submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 text-sm shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting request...
                    </>
                  ) : (
                    "Request Withdrawal"
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

function WithdrawSkeleton() {
  return (
    <div className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-4 w-72 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Skeleton className="h-56 rounded-xl" />
        </div>

        <div className="lg:col-span-2">
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default Withdraw;
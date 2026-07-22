import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Wallet as WalletIcon,
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { withCsrfHeaders } from "../lib/csrf";

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

const PAYMENT_METHODS = [
  { id: "easypaisa", label: "EasyPaisa", icon: Smartphone },
  { id: "jazzcash", label: "JazzCash", icon: Smartphone },
  { id: "card", label: "Debit / Credit Card", icon: CreditCard },
  { id: "bank", label: "Bank Transfer", icon: Building2 },
];

const Topup = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [amount, setAmount] = useState(PRESET_AMOUNTS[1]);
  const [customAmount, setCustomAmount] = useState("");
  const [method, setMethod] = useState(PAYMENT_METHODS[0].id);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/student/wallet-data", { headers: { Accept: "application/json" } })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load wallet (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setWallet(data.wallet || { balance: 0, currency: "PKR" });
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setWallet({ balance: 0, currency: "PKR" });
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const currency = wallet?.currency || "PKR";
  const balance = Number(wallet?.balance ?? 0);

  const effectiveAmount = customAmount ? Number(customAmount) : amount;
  const isValidAmount = Number.isFinite(effectiveAmount) && effectiveAmount > 0;

  const handlePreset = (value) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setCustomAmount(value);
  };

  const handleSubmit = async () => {
    if (!isValidAmount || submitting) return;

    setSubmitting(true);
    setSubmitError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/student/wallet-topup", {
        method: "POST",
        headers: withCsrfHeaders(),
        body: JSON.stringify({ amount: effectiveAmount, method }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || `Top-up failed (${res.status})`);
      }

      setSuccess({
        amount: effectiveAmount,
        reference: data?.reference || data?.id || null,
      });

      if (typeof data?.balance !== "undefined") {
        setWallet((prev) => (prev ? { ...prev, balance: data.balance } : prev));
      }
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <TopupSkeleton />;

  return (
    <div className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen relative z-0">
      <motion.div
        className="text-left mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-teal-700 to-indigo-700 text-transparent bg-clip-text">
          Top-up Wallet
        </h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          Add funds to your wallet to unlock courses and live classes.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Current balance */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="h-full min-h-[220px] p-6 rounded-xl shadow-md hover:shadow-xl border-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex flex-col relative">
            <div className="flex items-center gap-2 absolute top-4 left-6">
              <WalletIcon className="h-5 w-5" />
              <span className="font-medium text-white/80">Current Balance</span>
            </div>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-0 gap-1">
              <div className="text-4xl md:text-5xl font-bold tracking-tight text-center">
                {currency} {balance.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right: Top-up form */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="h-full p-6 rounded-xl shadow-md hover:shadow-xl border-0 bg-white dark:bg-gray-800 flex flex-col">
            <CardHeader className="p-0 mb-4 flex-shrink-0">
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Add Funds
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 flex-1 flex flex-col gap-6">
              {/* Amount selection */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Choose an amount
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PRESET_AMOUNTS.map((value) => {
                    const isActive = !customAmount && amount === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handlePreset(value)}
                        className={`py-3 rounded-lg border text-sm font-semibold transition-colors ${
                          isActive
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-indigo-400"
                        }`}
                      >
                        {currency} {value}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3">
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Or enter a custom amount
                  </label>
                  <div className="mt-1 flex items-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 px-3 py-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                      {currency}
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={customAmount}
                      onChange={handleCustomChange}
                      className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Payment method
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => {
                    const isActive = method === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setMethod(id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300"
                            : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-indigo-400"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback */}
              {submitError && (
                <p className="text-sm text-red-500">{submitError}</p>
              )}

              {success && (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 text-sm text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span>
                    {currency} {Number(success.amount).toFixed(2)} added successfully
                    {success.reference ? ` · Ref: ${success.reference}` : ""}
                  </span>
                </div>
              )}

              {/* Submit */}
              <div className="mt-auto pt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isValidAmount || submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 text-sm shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Top-up {currency} {isValidAmount ? effectiveAmount : 0}</>
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

function TopupSkeleton() {
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

export default Topup;
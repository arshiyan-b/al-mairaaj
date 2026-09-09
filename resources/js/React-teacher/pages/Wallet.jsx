import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet as WalletIcon, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/teacher/wallet-data", {
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load wallet (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setWallet(data.wallet);
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
      <div className="flex justify-center py-16">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (wallet === null) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3 rounded" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (wallet === false || !wallet) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-gray-500">
          Your wallet hasn't been set up yet. Please contact the academy.
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-gray-800">Wallet</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Your earnings balance from the academy.
        </p>
      </motion.div>

      <Card className="mb-6 bg-gradient-to-r from-teal-700 to-teal-800 border-none">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-teal-100 text-sm mb-1">Current Balance</div>
              <div className="text-3xl font-bold">
                {Number(wallet.balance).toFixed(2)}{" "}
                <span className="text-lg font-medium text-teal-100">{wallet.currency}</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
              <WalletIcon className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-4">
            <Badge className="bg-white/15 text-white hover:bg-white/15 capitalize">
              {wallet.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Recent Transactions
          </h2>

          {(!wallet.transactions || wallet.transactions.length === 0) && (
            <p className="text-sm text-gray-500 text-center py-8">
              No transactions yet.
            </p>
          )}

          {wallet.transactions && wallet.transactions.length > 0 && (
            <div className="space-y-2">
              {wallet.transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between border-b border-gray-100 last:border-0 py-3"
                >
                  <div className="flex items-center gap-3">
                    {tx.transaction_type === "credit" ? (
                      <ArrowUpCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <ArrowDownCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {tx.description || (tx.type ? tx.type.replace(/_/g, " ") : "Transaction")}
                      </div>
                      <div className="text-xs text-gray-400">
                        {tx.created_at ? new Date(tx.created_at).toLocaleString() : ""}
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      "text-sm font-semibold " +
                      (tx.transaction_type === "credit" ? "text-green-600" : "text-red-500")
                    }
                  >
                    {tx.transaction_type === "credit" ? "+" : "-"}
                    {Number(tx.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
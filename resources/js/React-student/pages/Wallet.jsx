import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet as WalletIcon, Plus, Gift, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { motion } from "framer-motion";

const transactions = [
  { id: 1, title: 'Top-up from Bank', date: 'Oct 24, 2026', amount: 500.00, type: 'credit' },
  { id: 2, title: 'Purchased Course: React Mastery', date: 'Oct 22, 2026', amount: 150.00, type: 'debit' },
  { id: 3, title: 'Redeemed Gift Card', date: 'Oct 20, 2026', amount: 50.00, type: 'credit' },
  { id: 4, title: 'Library Fine', date: 'Oct 15, 2026', amount: 15.00, type: 'debit' },
  { id: 5, title: 'Purchased Book: UI/UX Principles', date: 'Oct 10, 2026', amount: 45.00, type: 'debit' },
  { id: 6, title: 'Top-up from Card', date: 'Oct 05, 2026', amount: 100.00, type: 'credit' },
  { id: 7, title: 'Course Refund', date: 'Oct 01, 2026', amount: 30.00, type: 'credit' },
];

const Wallet = ({ user }) => {
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
            <Card className="flex-1 p-6 rounded-xl shadow-md hover:shadow-xl border-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex flex-col relative">
              <div className="flex items-center gap-2 absolute top-4 left-6">
                <WalletIcon className="h-5 w-5" />
                <span className="font-medium text-white/80">Total Balance</span>
              </div>

              {/* Amount */}
              <CardContent className="flex-1 flex items-center justify-center p-0">
                <div className="text-4xl md:text-5xl font-bold tracking-tight text-center">
                  $1,250.00
                </div>
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
              <div className="overflow-y-auto max-h-[350px] pr-2 flex flex-col gap-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${tx.type === 'credit' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {tx.type === 'credit' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{tx.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{tx.date}</p>
                      </div>
                    </div>
                    <div className={`font-semibold ${tx.type === 'credit' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                      {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </div>
                  </div>
                ))}

                <div className="text-center pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors text-sm hover:underline">
                    Show more transactions
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
};

export default Wallet;

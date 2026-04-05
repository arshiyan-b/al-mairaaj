import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Wallet = ({ user }) => {
  return (
    <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen relative z-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 rounded-xl shadow-sm border-0">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl font-semibold">My Wallet</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-gray-600 dark:text-gray-400">
                Wallet feature is coming soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Wallet;

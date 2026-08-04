<?php

namespace App\Services;

use App\Models\Wallet;

class WalletService
{
    public function getAuthenticatedStudentWallet()
    {
        return Wallet::with('transactions')
            ->where('student_id', auth()->user()->student->id)
            ->first();
    }
    public function credit(Wallet $wallet, float $amount): Wallet
    {
        $wallet->increment('balance', $amount);
        return $wallet->fresh();
    }
    public function debit(Wallet $wallet, float $amount): Wallet
    {
        $wallet->decrement('balance', $amount);
        return $wallet->fresh();
    }
}
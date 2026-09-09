<?php

namespace App\Services;

use App\Models\StudentWallet;

class WalletService
{
    public function getAuthenticatedStudentWallet()
    {
        return StudentWallet::with('transactions')
            ->where('student_id', auth()->user()->student->id)
            ->first();
    }
    public function credit(StudentWallet $wallet, float $amount): StudentWallet
    {
        $wallet->increment('balance', $amount);
        return $wallet->fresh();
    }
    public function debit(StudentWallet $wallet, float $amount): StudentWallet
    {
        $wallet->decrement('balance', $amount);
        return $wallet->fresh();
    }
}
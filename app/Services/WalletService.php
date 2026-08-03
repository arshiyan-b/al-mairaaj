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
}
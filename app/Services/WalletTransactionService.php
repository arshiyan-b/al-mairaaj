<?php

namespace App\Services;

use App\Models\StudentWallet;
use App\Models\StudentWalletTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class WalletTransactionService
{
    public function getAuthenticatedStudentWalletTransactions()
    {
        return StudentWalletTransaction::where('wallet_id', auth()->user()->student->wallet->id)->get();
    }
    public function credit(
        StudentWallet $wallet,
        float $amount,
        ?string $type,
        ?string $paymentMethod = null,
        ?int $enrollmentId = null,
        ?string $description = null
    ): StudentWalletTransaction {

        return DB::transaction(function () use (
            $wallet,
            $amount,
            $enrollmentId,
            $type,
            $paymentMethod,
            $description
        ) {
            $wallet->balance += $amount;
            $wallet->save();

            return StudentWalletTransaction::create([
                'wallet_id'         => $wallet->id,
                'enrollment_id'     => $enrollmentId,
                'type'              => $type,
                'transaction_type'  => 'credit',
                'amount'            => $amount,
                'balance_after'     => $wallet->balance,
                'payment_method'    => $paymentMethod,
                'description'       => $description,
                'status'            => 'completed',
                'created_by'        => Auth::id(),
            ]);
        });
    }
    public function debitForAuthenticatedStudentLiveClassEnrollment(
        StudentWallet $wallet,
        int $enrollmentId,
        float $amount,
        string $type,
        string $paymentMethod,
        string $status = 'completed',
        ?string $description = null
    ): StudentWalletTransaction {

        return DB::transaction(function () use (
            $wallet,
            $enrollmentId,
            $amount,
            $type,
            $paymentMethod,
            $status,
            $description
        ) {

            $wallet->balance -= $amount;
            $wallet->save();

            return StudentWalletTransaction::create([
                'wallet_id'         => $wallet->id,
                'enrollment_id'     => $enrollmentId,
                'type'              => $type,
                'transaction_type'  => 'debit',
                'amount'            => $amount,
                'balance_after'     => $wallet->balance,
                'payment_method'    => $paymentMethod,
                'description'       => $description,
                'status'            => $status,
                'created_by'        => Auth::id(),
            ]);
        });
    }
}
<?php

namespace App\Services;

use App\Services\WalletTransactionService;

use App\Models\TopupRequest;
use App\Models\Wallet;
use Illuminate\Http\UploadedFile;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TopupRequestService
{
    protected WalletTransactionService $walletTransactionService;

    public function __construct(WalletTransactionService $walletTransactionService)
    {
        $this->walletTransactionService = $walletTransactionService;
    }
    public function getTopupRequests()
    {
        return TopupRequest::all();
    }
    public function getTopupRequest($id)
    {
        return TopupRequest::findOrFail($id);
    }
    public function getAuthenticatedStudentTopupRequests()
    {
        return TopupRequest::where('wallet_id', auth()->user()->student->wallet->id)->get();
    }
    public function getAuthenticatedStudentPendingTopupRequests()
    {
        return TopupRequest::where('wallet_id', auth()->user()->student->wallet->id)->where('status', 'pending')->get();
    }
    public function create(Wallet $wallet, array $data, ?UploadedFile $screenshot): TopupRequest
    {
        return DB::transaction(function () use ($wallet, $data, $screenshot) {

            $proofImage = null;

            if ($screenshot) {
                $proofImage = $screenshot->store('topup_request_screenshots', 'private');
            }

            return TopupRequest::create([
                'wallet_id' => $wallet->id,
                'amount' => $data['amount'],
                'payment_method' => $data['payment_method'],

                'mobile_number' => $data['mobile_number'] ?? null,
                'account_name' => $data['account_name'] ?? null,

                'bank_name' => $data['bank_name'] ?? null,
                'bank_account_name' => $data['bank_account_name'] ?? null,
                'bank_account_number' => $data['bank_account_number'] ?? null,

                'screenshot' => $proofImage,

                'status' => 'pending',
                'requested_at' => now(),
            ]);
        });
    }
    public function updateStatus(TopupRequest $topupRequest, string $status)
    {
        $topupRequest->update([
            'status' => $status,
            'processed_at' => now(),
            'processed_by' => Auth::id(),
        ]);

        if ($status === 'approved') {

            $this->walletTransactionService->credit(
                wallet: $topupRequest->wallet,
                amount: $topupRequest->amount,
                type: 'topup',
                paymentMethod: $topupRequest->payment_method,
                description: 'Wallet top-up approved'
            );
        }

        return $topupRequest->fresh();
    }
}
<?php

namespace App\Services;

use App\Models\TopupRequest;
use App\Models\Wallet;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class TopupRequestService
{
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
        ]);

        if ($status === 'approved') {
            $wallet = $topupRequest->wallet;
            $wallet->increment('balance', $topupRequest->amount);
        }

        return $topupRequest->fresh();
    }
}
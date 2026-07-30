<?php

namespace App\Services;

use App\Models\TopupRequest;
use App\Models\Student;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class TopupRequestService
{
    public function create(Student $student, array $data, ?UploadedFile $screenshot): TopupRequest
    {
        return DB::transaction(function () use ($student, $data, $screenshot) {

            $proofImage = null;

            if ($screenshot) {
                $proofImage = $screenshot->store('topup_request_screenshots', 'private');
            }

            return TopupRequest::create([
                'student_id' => $student->id,
                'amount' => $data['amount'],
                'payment_method' => $data['payment_method'],

                'mobile_number' => $data['mobile_number'] ?? null,
                'account_name' => $data['account_name'] ?? null,

                'bank_name' => $data['bank_name'] ?? null,
                'bank_account_name' => $data['bank_account_name'] ?? null,
                'bank_account_number' => $data['bank_account_number'] ?? null,

                'proof_image' => $proofImage,

                'status' => 'pending',
                'requested_at' => now(),
            ]);
        });
    }
}
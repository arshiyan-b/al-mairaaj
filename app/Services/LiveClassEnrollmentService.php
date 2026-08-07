<?php

namespace App\Services;

use App\Models\LiveClassEnrollment;
use App\Models\WalletTransaction;

class LiveClassEnrollmentService
{
    public function create($liveClassId, $studentId)
    {
        return LiveClassEnrollment::create([
            'live_class_id' => $liveClassId,
            'student_id'    => $studentId,
            'status'        => 'enrolled',
            'remarks'       => null,
        ]);
    }
}
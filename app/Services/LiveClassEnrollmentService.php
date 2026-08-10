<?php

namespace App\Services;

use App\Models\LiveClassEnrollment;

class LiveClassEnrollmentService
{
    public function getAuthenticatedStudentEnrollments()
    {
        return LiveClassEnrollment::where('student_id', auth()->user()->student->id)
            ->where('status', 'enrolled')
            ->with('liveClass.batch')
            ->latest()
            ->get();
    }
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
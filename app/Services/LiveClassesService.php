<?php

namespace App\Services;

use App\Models\LiveClass;

class LiveClassesService
{
    public function getLiveClassTitle($id)
    {
        return LiveClass::findOrFail($id)->title;
    }
    public function getAuthenticatedStudentLiveClassesByBatchId($batchId)
    {
        return LiveClass::where('batch_id', $batchId)
            ->withExists([
                'enrollments as is_enrolled' => function ($query) {
                    $query->where('student_id', auth()->user()->student->id)
                        ->where('status', 'enrolled');
                }
            ])
            ->orderBy('class_date')
            ->orderBy('start_time')
            ->get();
    }
    public function getLiveClassesByBatchId($batchId)
    {
        return LiveClass::where('batch_id', $batchId)
            ->orderBy('class_date')
            ->orderBy('start_time')
            ->get();
    }
    public function getUpcomingLiveClassesByBatchIds($batchIds)
    {
        return LiveClass::with('batch')
            ->whereIn('batch_id', $batchIds)
            ->whereDate('class_date', '>=', now()->toDateString())
            ->orderBy('class_date')
            ->orderBy('start_time')
            ->get();
    }
    public function checkAuthenticatedStudentWalletBalanceForLiveClass($id)
    {
        $liveClass = LiveClass::findOrFail($id);
        return auth()->user()->student->wallet->balance >= $liveClass->price;
    }
}
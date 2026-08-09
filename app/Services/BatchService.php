<?php

namespace App\Services;

use App\Models\Batch;

class BatchService
{
    public function getBatch($id)
    {
        return Batch::with([
            'teacher',
            'curriculumSubject.grade.board',
        ])->findOrFail($id);
    }
    public function getBatchTitle($id)
    {
        return Batch::findOrFail($id)->title;
    }
    public function getBatchPrice($id)
    {
        return Batch::findOrFail($id)->price;
    }
    public function checkAuthenticatedStudentWalletBalanceForBatch($id): bool
    {
        $batch = Batch::findOrFail($id);
        return auth()->user()->student->wallet->balance >= $batch->price;
    }
}
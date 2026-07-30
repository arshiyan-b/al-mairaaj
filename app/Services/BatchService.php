<?php

namespace App\Services;

use App\Models\Batch;
use App\Models\Enrollment;
use App\Models\LiveClass;

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
}
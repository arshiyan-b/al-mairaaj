<?php

namespace App\Services;

use App\Models\LiveClass;

class LiveClassesService
{
    public function getLiveClassesByBatchId($batchId)
    {
        return LiveClass::where('batch_id', $batchId)
            ->orderBy('class_date')
            ->orderBy('start_time')
            ->get();
    }
}
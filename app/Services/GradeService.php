<?php

namespace App\Services;

use App\Models\Grade;

class GradeService
{
    public function getGrades()
    {
        return Grade::with('board')
            ->where('is_active', 1)
            ->whereHas('board', function ($query) {
                $query->where('is_active', 1);
            })
            ->get();
    }
    public function getGrade($id)
    {
        return Grade::with('board')->findOrFail($id);
    }
}
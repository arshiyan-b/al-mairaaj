<?php

namespace App\Services;

use App\Models\Grade;

class GradeService
{
    public function getGrades()
    {
        return Grade::with('board')->get();
    }
    public function getGrade($id)
    {
        return Grade::with('board')->findOrFail($id);
    }
}
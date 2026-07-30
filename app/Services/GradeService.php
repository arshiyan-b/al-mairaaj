<?php

namespace App\Services;

use App\Models\Grades;

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
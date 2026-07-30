<?php

namespace App\Services;

use App\Models\CurriculumSubject;

class CurriculumSubjectService
{
    public function getCurriculumSubject($id)
    {
        return CurriculumSubject::with('grade.board')->findOrFail($id);;
    }
    public function getCurriculumSubjects()
    {
        return CurriculumSubject::with('grade.board')->orderBy('name')->get();
    }
}
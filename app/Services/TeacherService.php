<?php

namespace App\Services;

use App\Models\Teacher;

class TeacherService
{
    public function getTeachers()
    {
        return Teacher::with([
            'allowed_classes.grade.board',
            'application.teacherDocs',
        ])->get();
    }

    public function getTeacher($id)
    {
        return Teacher::with([
            'allowed_classes.grade.board',
            'application.teacherDocs',
        ])->findOrFail($id);
    }
}
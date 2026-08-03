<?php

namespace App\Services;

use App\Models\Student;

class StudentService
{
    public function getStudent($id)
    {
        return Student::findOrFail($id);
    }
    public function getAuthenticatedStudent()
    {
        return Student::find(auth()->user()->student->id);
    }
}
<?php

namespace App\Services;

use App\Models\Student;

class StudentService
{
    public function getStudent($id)
    {
        return Student::findOrFail($id);
    }
}
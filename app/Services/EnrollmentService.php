<?php

namespace App\Services;

use App\Models\Enrollment;

class EnrollmentService
{
    public function getEnrollmentsByStudentId($studentId)
    {
        return Enrollment::with([
                'batch:id,title,status,start_date,end_date,total_classes,teacher_id,curriculum_subject_id',
                'batch.teacher:id,name',
                'batch.curriculumSubject:id,name,grade_id',
                'batch.curriculumSubject.grade:id,name,board_id',
                'batch.curriculumSubject.grade.board:id,name',
            ])
            ->where('student_id', $studentId)
            ->get();
    }
    public function isStudentEnrolled($studentId, $batchId)
    {
        return Enrollment::where('student_id', $studentId)
            ->where('batch_id', $batchId)
            ->exists();
    }
    public function getAuthenticatedStudentEnrollments()
    {
        return Enrollment::with([
                'batch:id,title,status,start_date,end_date,total_classes,teacher_id,curriculum_subject_id',
                'batch.teacher:id,name',
                'batch.curriculumSubject:id,name,grade_id',
                'batch.curriculumSubject.grade:id,name,board_id',
                'batch.curriculumSubject.grade.board:id,name',
            ])
            ->where('student_id', auth()->user()->student->id)
            ->get();
    }
}
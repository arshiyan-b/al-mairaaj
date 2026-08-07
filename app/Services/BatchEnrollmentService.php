<?php

namespace App\Services;

use App\Models\BatchEnrollment;

class BatchEnrollmentService
{
    public function getEnrollmentsByStudentId($studentId)
    {
        return BatchEnrollment::with([
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
        return BatchEnrollment::where('student_id', $studentId)
            ->where('batch_id', $batchId)
            ->exists();
    }
    public function getAuthenticatedStudentEnrollments()
    {
        return BatchEnrollment::with([
                'batch:id,title,status,start_date,end_date,total_classes,teacher_id,curriculum_subject_id',
                'batch.teacher:id,name',
                'batch.curriculumSubject:id,name,grade_id',
                'batch.curriculumSubject.grade:id,name,board_id',
                'batch.curriculumSubject.grade.board:id,name',
            ])
            ->where('student_id', auth()->user()->student->id)
            ->get();
    }
    public function create($batchId)
    {
        $student = auth()->user()->student;

        return BatchEnrollment::firstOrCreate(
            [
                'batch_id'   => $batchId,
                'student_id' => $student->id,
            ],
            [
                'payment_status' => 'paid',
                'status'         => 'active',
            ]
        );
    }
}
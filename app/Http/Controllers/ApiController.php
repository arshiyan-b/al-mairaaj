<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Board;
use App\Models\CurriculumSubject;
use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\LiveClass;
use App\Models\Student;
use App\Models\Teacher;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ApiController extends Controller
{

    public function student_subjects_data()
    {
        $curriculum_subjects = CurriculumSubject::with('grade.board')->orderBy('name')->get();
        $grades = Grade::with('board')->get();
        $boards = Board::all();

        return response()->json([
            'curriculum_subjects' => $curriculum_subjects,
            'grades' => $grades,
            'boards' => $boards,
        ]);
    }
    public function student_live_classes_data()
    {
        $student = auth()->user()->student;

        $enrollments = Enrollment::with([
                'batch:id,title,status,start_date,end_date,total_classes,teacher_id,curriculum_subject_id',
                'batch.teacher:id,name',
                'batch.curriculumSubject:id,name,grade_id',
                'batch.curriculumSubject.grade:id,name,board_id',
                'batch.curriculumSubject.grade.board:id,name',
            ])
            ->where('student_id', $student->id)
            ->get();

        $batchIds = $enrollments->pluck('batch_id');

        $liveClasses = LiveClass::with('batch:id,title')
            ->whereIn('batch_id', $batchIds)
            ->whereDate('class_date', '>=', now()->toDateString())
            ->orderBy('class_date')
            ->orderBy('start_time')
            ->get();

        $today = now()->toDateString();
        $liveToday = $liveClasses->filter(fn ($c) => $c->class_date->toDateString() === $today)->values();
        $upcomingLiveClasses = $liveClasses->filter(fn ($c) => $c->class_date->toDateString() > $today)
            ->take(10)
            ->values();

        return response()->json([
            'student' => $student,
            'enrollments' => $enrollments,
            'live_today' => $liveToday,
            'upcoming_live_classes' => $upcomingLiveClasses,
            'stats' => [
                'active_batches' => $enrollments->count(),
                'live_today_count' => $liveToday->count(),
                'upcoming_count' => $upcomingLiveClasses->count(),
            ],
        ]);
    }

    public function browse_live_classes_data()
    {
        $batches = Batch::with([
            'teacher:id,name',
            'curriculumSubject:id,name,code,grade_id',
            'curriculumSubject.grade:id,name,board_id',
            'curriculumSubject.grade.board:id,name',
        ])
            ->whereIn('status', ['active', 'pending'])
            ->get();
        $boards = Board::select('id', 'name')->get();
        $grades = Grade::with('board:id,name')->get();
        $subjects = CurriculumSubject::with('grade:id,name,board_id')->get();
        $enrollments = Enrollment::where('student_id', auth()->user()->student->id)->get();

        return response()->json([
            'batches'      => $batches,
            'boards'       => $boards,
            'grades'       => $grades,
            'subjects'     => $subjects,
            'enrollments'  => $enrollments,
        ]);
    }

    public function student_live_class_batch($id)
    {
        $batch = Batch::with([
            'teacher',
            'curriculumSubject.grade.board',
        ])->findOrFail($id);

        $live_classes = LiveClass::where('batch_id', $id)
            ->orderBy('class_date')
            ->orderBy('start_time')
            ->get();
        
        $in_enrolled = Enrollment::where('student_id', auth()->user()->student->id)->where('batch_id', $batch->id)->exists();

        return response()->json([
            'batch' => $batch,
            'live_classes' => $live_classes,
            'is_enrolled' => $in_enrolled,
        ]);
    }
}
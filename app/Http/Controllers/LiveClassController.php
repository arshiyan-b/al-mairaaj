<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\CurriculumSubject;
use App\Models\Enrollment;
use App\Models\Board;
use App\Models\Grade;
use App\Models\LiveClass;

use App\Services\LiveClassesService;

use Illuminate\Http\Request;


class LiveClassController extends Controller
{
    public function __construct(
        protected LiveClassesService $liveClassesService,
    ){}
    public function index()
    {
        $batches = Batch::with(['teacher', 'grade', 'curriculumSubject'])->get();
        return view('admin.live_classes.index', compact('batches'));
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'batch_id' => 'required|exists:batches,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',

            'meeting_provider' => 'required|in:jitsi,zoom',

            'class_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',

            'duration' => 'nullable|integer|min:1',

            'status' => 'required|in:scheduled,completed,canceled',
        ]);

        $this->liveClassesService->create($validated);

        return redirect()->back()->with('success', 'Live class created successfully.');
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
}
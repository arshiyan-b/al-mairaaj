<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\CurriculumSubject;
use App\Models\Enrollment;
use App\Models\Board;
use App\Models\Grade;
use App\Models\LiveClass;
use App\Services\LiveClassesService;
use App\Http\Requests\StoreLiveClassRequest;
use App\Http\Requests\UpdateLiveClassRequest;

class LiveClassController extends Controller
{
    public function __construct(
        protected LiveClassesService $liveClassesService,
    ){}
    public function show($id)
    {
        $liveClass = $this->liveClassesService->getLiveClass($id);
        return view('admin.live_classes.show', compact('liveClass'));
    }
    public function store(StoreLiveClassRequest $request)
    {
        $validated = $request->validated();

        $this->liveClassesService->create($validated);

        return redirect()
            ->back()
            ->with('success', 'Live class created successfully.');
    }
    public function update(UpdateLiveClassRequest $request, $live_class)
    {
        $liveClass = $this->liveClassesService->getLiveClass($live_class);

        $this->liveClassesService->update($liveClass, $request->validated());

        return redirect()
            ->back()
            ->with('success', 'Live class updated successfully.');
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
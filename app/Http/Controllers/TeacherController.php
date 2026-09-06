<?php

namespace App\Http\Controllers;

use App\Services\BatchService;
use App\Services\LiveClassesService;
use App\Models\Batch;
use App\Models\Board;
use App\Models\Grade;
use App\Models\LiveClass;
use App\Http\Requests\TeacherStoreLiveClassRequest;
use App\Http\Requests\TeacherUpdateLiveClassRequest;

class TeacherController extends Controller
{
    protected $teacher;
    protected $classes;
    protected $subjects;

    public function __construct(
        protected BatchService $batchService,
        protected LiveClassesService $liveClassesService,
    ) {}

    public function dashboard()
    {
        return view('teacher.dashboard', [
            'teacher' => $this->teacher,
        ]);
    }
    public function live_class_batches_index($board, $grade)
    {
        $board = Board::where('slug', $board)->firstOrFail();
        $grade = Grade::where('board_id', $board->id)->where('slug', $grade)->firstOrFail();
        $batches = $this->batchService->getBatchFromAuthenticatedTeacherID($grade->id);
        return view('teacher.live_class_batches.index', compact('grade', 'batches'));
    }
    public function live_class_batch_show($id)
    {
        $batch = $this->batchService->getBatch($id);

        abort_unless(
            auth()->user()->teacher && $batch->teacher_id === auth()->user()->teacher->id,
            403
        );

        return view('teacher.live_class_batches.show', compact('batch'));
    }
    public function live_class_show($id)
    {
        $liveClass = $this->liveClassesService->getLiveClass($id);

        abort_unless(
            auth()->user()->teacher
                && $liveClass->batch
                && $liveClass->batch->teacher_id === auth()->user()->teacher->id,
            403
        );

        return view('teacher.live_classes.show', compact('liveClass'));
    }
    public function live_class_store(TeacherStoreLiveClassRequest $request)
    {
        $this->liveClassesService->create($request->validated());

        return redirect()
            ->back()
            ->with('success', 'Live class created successfully.');
    }
    public function live_class_update(TeacherUpdateLiveClassRequest $request, $live_class)
    {
        $liveClass = $this->liveClassesService->getLiveClass($live_class);

        $this->liveClassesService->update($liveClass, $request->validated());

        return redirect()
            ->back()
            ->with('success', 'Live class updated successfully.');
    }
}
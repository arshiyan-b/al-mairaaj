<?php

namespace App\Http\Controllers;

use App\Services\BatchService;
use App\Services\LiveClassesService;
use App\Models\Batch;
use App\Models\Board;
use App\Models\Grade;

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
        $batches = $this->batchService->getBatchFromAuthenticatedTeacherID();
        return view('teacher.live_class_batches.index', compact('grade', 'batches'));
    }
    public function live_class_batch_show($id)
    {
        $batch = $this->batchService->getBatch($id);
        return view('teacher.live_class_batches.show', compact('batch'));
    }
    public function live_class_show($id)
    {
        $liveClass = $this->liveClassesService->getLiveClass($id);
        return view('teacher.live_classes.show', compact('liveClass'));
    }
}

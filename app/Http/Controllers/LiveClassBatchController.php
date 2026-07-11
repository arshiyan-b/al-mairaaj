<?php

namespace App\Http\Controllers;

use App\Models\AllowedClass;
use App\Models\Batch;
use App\Models\CurriculumSubject;
use App\Models\Role;
use App\Models\User;
use App\Models\Teacher;
use App\Models\TeacherDoc;
use App\Models\Student;
use App\Models\Board;
use App\Models\Grade;
use App\Models\Subject;
use App\Models\Book;
use App\Models\PearsonCourse;
use App\Models\PearsonIgcseVideo;
use App\Models\CaieCourse;
use App\Models\CaieOlevelVideo;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class LiveClassBatchController extends Controller
{
    public function index($board, $grade)
    {
        $grade = Grade::where('slug', $grade)->whereHas('board', function ($query) use ($board) {
            $query->where('slug', $board);
        })->firstOrFail();
        $board = Board::where('slug', $board)->firstOrFail();
        $curriculum_subjects = CurriculumSubject::where('grade_id', $grade->id)->get();

        $teachers = Teacher::whereHas('allowed_classes', function ($query) use ($grade) {
            $query->where('grade_id', $grade->id);
        })->with(['allowed_classes' => function ($query) use ($grade) {
            $query->where('grade_id', $grade->id);
        }])->get();

        $batches = Batch::where('grade_id', $grade->id)
            ->with(['teacher', 'grade', 'curriculumSubject'])
            ->get();

        return view('admin.live_class_batches.index', compact('board', 'grade', 'curriculum_subjects', 'teachers', 'batches'));
    }

    public function store(Request $request, $board, $grade)
    {
        $grade = Grade::where('slug', $grade)
            ->whereHas('board', function ($query) use ($board) {
                $query->where('slug', $board);
            })->firstOrFail();

        $request->merge(['grade_id' => $grade->id]);

        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'grade_id' => 'required|exists:grades,id',
            'curriculum_subject_id' => 'required|exists:curriculum_subjects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'total_classes' => 'required|integer|min:1',
        ]);

        $batch = Batch::create($validated);

        return redirect()->route('admin.live_class_batches.index', [
                'board' => $board,
                'grade' => $grade->slug,
            ])
            ->with('success', 'Batch created successfully.');
    }

    public function show($board, $grade, $batch)
    {
        $grade = Grade::where('slug', $grade)
            ->whereHas('board', function ($query) use ($board) {
                $query->where('slug', $board);
            })->firstOrFail();
        $board = Board::where('slug', $board)->firstOrFail();

        $batch = Batch::where('id', $batch)
            ->where('grade_id', $grade->id)
            ->with(['teacher', 'grade', 'curriculumSubject', 'liveClasses'])
            ->firstOrFail();
        
        $live_classes = $batch->liveClasses()->orderBy('start_time')->get();

        return view('admin.live_class_batches.show', compact('board', 'grade', 'batch', 'live_classes'));
    }

    public function edit($board, $grade, $batch)
    {
        $grade = Grade::where('slug', $grade)
            ->whereHas('board', function ($query) use ($board) {
                $query->where('slug', $board);
            })->firstOrFail();
        $board = Board::where('slug', $board)->firstOrFail();

        $batch = Batch::where('id', $batch)
            ->where('grade_id', $grade->id)
            ->with(['teacher', 'grade', 'curriculumSubject'])
            ->firstOrFail();

        $teachers = Teacher::whereHas('allowed_classes', function ($query) use ($grade) {
            $query->where('grade_id', $grade->id);
        })->with(['allowed_classes' => function ($query) use ($grade) {
            $query->where('grade_id', $grade->id);
        }])->get();

        return view('admin.live_class_batches.edit', compact('board', 'grade', 'batch', 'teachers'));
    }

    public function update(Request $request, $board, $grade, $batch)
    {
        $grade = Grade::where('slug', $grade)
            ->whereHas('board', function ($query) use ($board) {
                $query->where('slug', $board);
            })->firstOrFail();

        $batch = Batch::where('id', $batch)
            ->where('grade_id', $grade->id)
            ->firstOrFail();

        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'curriculum_subject_id' => 'required|exists:curriculum_subjects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'total_classes' => 'required|integer|min:1',
        ]);

        $batch->update($validated);

        return redirect()->route('admin.live_class_batches.index', [
                'board' => $board,
                'grade' => $grade->slug,
            ])
            ->with('success', 'Batch updated successfully.');
    }

    public function destroy($board, $grade, $batch)
    {
        $grade = Grade::where('slug', $grade)
            ->whereHas('board', function ($query) use ($board) {
                $query->where('slug', $board);
            })->firstOrFail();

        $batch = Batch::where('id', $batch)
            ->where('grade_id', $grade->id)
            ->firstOrFail();

        $batch->delete();

        return redirect()->route('admin.live_class_batches.index', [
                'board' => $board,
                'grade' => $grade->slug,
            ])
            ->with('success', 'Batch deleted successfully.');
    }

}
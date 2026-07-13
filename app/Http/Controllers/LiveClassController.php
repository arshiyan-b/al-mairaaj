<?php

namespace App\Http\Controllers;

use App\Models\AllowedClass;
use App\Models\Batch;
use App\Models\CurriculumSubject;
use App\Models\Enrollment;
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
use App\Models\LiveClass;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class LiveClassController extends Controller
{

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
            'meeting_provider' => 'required|string|in:zoom,google_meet,other',
            'meeting_link' => 'nullable|url',
            'meeting_id' => 'nullable|string|max:255',
            'meeting_password' => 'nullable|string|max:255',
            'class_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'duration' => 'nullable|integer|min:1',
            'status' => 'required|in:scheduled,completed,canceled',
        ]);

        LiveClass::create($validated);

        return redirect()->back()->with('success', 'Live class created successfully.');
    }

    public function student_live_classes_data()
    {
        $enrollments = Enrollment::with('batch.teacher', 'batch.curriculum_subject.grade.board')
            ->where('student_id', auth()->user()->student->id)->get();
        $live_today = LiveClass::whereDate('class_date', now()->toDateString())->get();
        $upcoming_live_classes = LiveClass::whereDate('class_date', '>', now()->toDateString())->get();

        return response()->json($enrollments);
    }
    
}
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

class StudentController extends Controller
{
    public function dashboard()
    {
        return view('student.dashboard', ['user' => auth()->user()]);
    }
    public function courses()
    {
        return view('student.courses.index', ['user' => auth()->user()]);
    }
    public function live_classes()
    {
        return view('student.live_classes.index');
    }
    public function browse_live_classes()
    {
        return view('student.live_classes.browse');
    }
    public function live_class_batch($id)
    {
        $batch = Batch::with(['teacher', 'curriculumSubject.grade.board'])->findOrFail($id);

        $live_classes = LiveClass::where('batch_id', $batch->id)
            ->orderBy('class_date')
            ->orderBy('start_time')
            ->get();

        return view('student.live_classes.batch', compact('batch', 'live_classes'));
    }
    public function boards()
    {
        return view('student.boards.index');
    }
    public function subjects()
    {
        return view('student.subjects.index');
    }
    public function books()
    {
        return view('student.books.index');
    }
    public function past_papers()
    {
        return view('student.past_papers.index');
    }
    public function teachers()
    {
        return view('student.teachers.index');
    }
    public function teacher($id)
    {
        $teacher = Teacher::find($id);
        return view('student.teachers.index', compact('teacher'));
    }
    public function profile()
    {
        return view('student.profile.index');
    }
    public function wallet()
    {
        return view('student.wallet.index');
    }
}
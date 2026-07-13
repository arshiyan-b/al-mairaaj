<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Board;
use App\Models\CurriculumSubject;
use App\Models\Enrollment;
use App\Models\Grade;
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
        $batches = Batch::with('teacher', 'curriculum_subject.grade.board')->where('status', 'active')->get();
        $student = Student::where('user_id', auth()->id())->first();
        $enrollments = Enrollment::with('batch.teacher', 'batch.curriculum_subject.grade.board')->where('student_id', $student->id)->get();
        return view('student.live_classes.index', compact('batches', 'enrollments'));
    }
    public function boards()
    {
        return view('student.boards.index');
    }
    public function subjects()
    {
        $curriculum_subjects = CurriculumSubject::with('grade.board')->orderBy('name')->get();
        $grades = Grade::with('board')->get();
        $boards = Board::all();

        return view('student.subjects.index', compact('curriculum_subjects', 'grades', 'boards'));
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
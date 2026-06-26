<?php

namespace App\Http\Controllers;

use App\Models\CaieCourse;
use App\Models\CaieOlevelVideo;
use App\Models\PearsonCourse;
use App\Models\PearsonIgcseVideo;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\StudentUserOtp;
use App\Models\User;
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
        return view('student.live_classes.index', ['user' => auth()->user()]);
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
        return view('student.teachers.show', ['teacher' => $teacher]);
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
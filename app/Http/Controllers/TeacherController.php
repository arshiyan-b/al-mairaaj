<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

use App\Models\AllowedClass;
use App\Models\Batch;
use App\Models\Board;
use App\Models\Grade;
use App\Models\Teacher;

class TeacherController extends Controller
{
    protected $teacher;
    protected $classes;
    protected $subjects;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {

            $this->teacher = Teacher::where('user_id', Auth::user()->id)->first();
            $this->classes = AllowedClass::where('teacher_id', $this->teacher->id)->get();

            return $next($request);
        });
    }

    public function dashboard()
    {
        return view('teacher.dashboard', [
            'teacher' => $this->teacher,
        ]);
    }
    public function class_index($board, $grade)
    {
        $board = Board::where('slug', $board)->firstOrFail();
        $grade = Grade::where('board_id', $board->id)->where('slug', $grade)->firstOrFail();
        $batches = Batch::where('teacher_id', $this->teacher->id)->where('grade_id', $grade->id)->get();
        return view('teacher.live_class_batches.index', compact('grade', 'batches'));
    }
}

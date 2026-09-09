<?php

namespace App\Http\Controllers;

class TeacherController extends Controller
{
    public function dashboard()
    {
        return view('teacher.dashboard');
    }

    public function profile()
    {
        return view('teacher.profile');
    }

    public function wallet()
    {
        return view('teacher.wallet');
    }

    public function simulators()
    {
        return view('teacher.simulators');
    }

    public function live_class_batches_index($board, $grade)
    {
        return view('teacher.live_class_batches.index');
    }

    public function live_class_batch_show($id)
    {
        return view('teacher.live_class_batches.show');
    }

    public function live_class_show($id)
    {
        return view('teacher.live_classes.show');
    }
}
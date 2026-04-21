<?php

namespace App\Http\Controllers;

class VideoController extends Controller
{
    public function index()
    {
        return view("student.videos.index");
    }
}
<?php

namespace App\Http\View\Composers;

use Illuminate\View\View;
use Illuminate\Support\Facades\Auth;
use App\Models\Teacher;

class AllowedClassesComposer
{
    public function compose(View $view)
    {
        $classes = collect();

        if (Auth::check()) {

            $teacher = Teacher::where('user_id', Auth::user()->id)->first();

            if ($teacher) {
                $classes = $teacher->allowed_classes()->with('grade')->get();
            }
        }

        $view->with('classes', $classes ?? collect());
    }
}
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
            $teacher = Teacher::where('user_id', Auth::id())->first();

            if ($teacher) {
                $classes = $teacher->allowed_classes()
                    ->with('grade.board')
                    ->get()
                    ->map(function ($allowedClass) {
                        return (object) [
                            'board' => $allowedClass->grade->board->slug ?? null,
                            'grade' => $allowedClass->grade->slug ?? null,
                        ];
                    })
                    ->filter(fn($c) => $c->board && $c->grade);
            }
        }

        $view->with('classes', $classes);
    }
}
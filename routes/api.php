<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Student\LiveClassesController;

Route::middleware(['web', 'auth'])->prefix('student')->group(function () {
    Route::get('/student-live-classes-data', [LiveClassesController::class, 'student_live_classes_data'])->name('student.live_classes.data');
});
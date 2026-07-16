<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\LiveClassController;

Route::middleware(['web', 'auth'])->prefix('student')->group(function () {

    Route::get('/subjects-data', [ApiController::class, 'student_subjects_data'])->name('student.subjects.data');

    Route::get('/live-classes-data', [ApiController::class, 'student_live_classes_data'])->name('student.live_classes.data');
    Route::get('/browse-live-classes-data', [ApiController::class, 'browse_live_classes_data'])->name('student.browse_live_classes.data');
    Route::get('/live-class-batch/{id}', [ApiController::class, 'student_live_class_batch'])->name('student.live_class_batch');
});
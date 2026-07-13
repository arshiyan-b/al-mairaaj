<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LiveClassController;

Route::middleware(['web', 'auth'])->prefix('student')->group(function () {
    Route::get('/live-classes-data', [LiveClassController::class, 'student_live_classes_data'])->name('student.live_classes.data');
    Route::get('/browse-live-classes-data', [LiveClassController::class, 'browse_live_classes_data'])->name('student.browse_live_classes.data');
});
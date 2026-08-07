<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;

Route::middleware(['web', 'auth'])->prefix('student')->group(function () {

    Route::get('/profile-data', [ApiController::class, 'student_profile_data'])->name('student.profile.data');

    Route::get('/wallet-data', [ApiController::class, 'student_wallet_data'])->name('student.wallet.data');
    Route::post('/topup-request', [ApiController::class, 'student_topup_request'])->name('student.topup.request');
    Route::post('/withdraw-request', [ApiController::class, 'student_withdraw_request'])->name('student.withdraw.request');

    Route::get('/subjects-data', [ApiController::class, 'student_subjects_data'])->name('student.subjects.data');

    Route::get('/teachers-data', [ApiController::class, 'student_teachers_data'])->name('student.teachers.data');
    Route::get('/teacher-profile-data/{id}', [ApiController::class, 'student_teacher_profile_data'])->name('student.teacher_profile.data');

    Route::get('/live-classes-data', [ApiController::class, 'student_live_classes_data'])->name('student.live_classes.data');
    Route::get('/browse-live-classes-data', [ApiController::class, 'browse_live_classes_data'])->name('student.browse_live_classes.data');
    Route::get('/live-class-batch/{id}', [ApiController::class, 'student_live_class_batch'])->name('student.live_class_batch');
});
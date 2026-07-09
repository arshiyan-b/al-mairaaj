<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\VideoController;

Route::get('/', function () {
    return view('index');
});

Route::get('/register-as-a-teacher', [LoginController::class, 'teacher_register'])->name('teacher.register');
Route::post('/teacher-register', [LoginController::class, 'teacher_register_store'])->name('teacher.register.store');

Route::get('/register', [LoginController::class, 'register'])->name('register');
Route::post('/register-auth', [LoginController::class, 'register_authenticate'])->name('register.auth');

Route::get('/verify-otp', [LoginController::class, 'verify_otp'])->name('otp');
Route::post('/verify-otp-auth', [LoginController::class, 'verify_otp_authenticate'])->name('otp.verify');

Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login-auth', [LoginController::class, 'authenticate'])->name('login.auth');
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

Route::get('/chatbot', [ChatbotController::class, 'index'])->name('chatbot.index');

Route::middleware(['auth', 'role:admin'])->group(function () {

    Route::post('admin/logout', [LoginController::class, 'logout'])->name('admin.logout');

    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    Route::get('/admin/students', [AdminController::class, 'student'])->name('admin.student');

    Route::get('/admin/teachers', [AdminController::class, 'teacher'])->name('admin.teacher');
    Route::get('/admin/teachers/{teacher}', [AdminController::class, 'teacher_show'])->name('admin.teachers_show');
    Route::post('admin/teacher/{id}/assign-subjects', [AdminController::class, 'teacher_assign_subjects'])->name('admin.teacher_assign_subjects');
    Route::delete('admin/teacher/{id}/class-destroy', [AdminController::class, 'teacher_class_destroy'])->name('admin.teacher_class_destroy');
    Route::post('/admin/teacher/{id}/create-user', [AdminController::class, 'teacher_create_user'])->name('admin.teacher_create_user');
    Route::post('/admin/teachers/user', [AdminController::class, 'teacher_user'])->name('admin.teacher_user');

    Route::get('/admin/books/{board}', [AdminController::class, 'books_index'])->name('admin.books.index');


    Route::get('/admin/courses/{board}/{grade}', [AdminController::class, 'course_index'])->name('admin.course.index');

    Route::get('/admin/live_class_batches/{board}/{grade}', [AdminController::class, 'live_class_batches_index'])->name('admin.live_class_batches.index');
    Route::post('/admin/live_class_batches/{board}/{grade}/store', [AdminController::class, 'live_class_batches_store'])->name('admin.live_class_batches.store');
    Route::get('/admin/live_class_batches/{board}/{grade}/{batch}', [AdminController::class, 'live_class_batches_show'])->name('admin.live_class_batches.show');
    Route::get('/admin/live_class_batches/{board}/{grade}/{batch}/edit', [AdminController::class, 'live_class_batches_edit'])->name('admin.live_class_batches.edit');
    Route::put('/admin/live_class_batches/{board}/{grade}/{batch}', [AdminController::class, 'live_class_batches_update'])->name('admin.live_class_batches.update');
    Route::delete('/admin/live_class_batches/{board}/{grade}/{batch}', [AdminController::class, 'live_class_batches_destroy'])->name('admin.live_class_batches.destroy');

    Route::get('/admin/announcements', [AnnouncementController::class, 'index'])->name('admin.announcement.index');

    Route::get('admin/demo', [AdminController::class, 'demo']);
    Route::post('/video/track', [AdminController::class, 'trackWatchTime'])->name('video.track');
});


// Teacher Routes
Route::middleware(['auth', 'role:teacher'])->group(function () {

    Route::get('/teacher/dashboard', [TeacherController::class, 'dashboard'])->name('teacher.dashboard');
    Route::get('/teacher/{board}/{qualification}', [TeacherController::class, 'class_index'])->name('teacher.class.index');
    Route::post('/teacher/course/store', [TeacherController::class, 'course_store'])->name('teacher.course.store');
    Route::get('/teacher/{board}/{qualification}/{course}', [TeacherController::class, 'course_show'])->name('teacher.course.show');
    Route::post('/teacher/course/video/store', [TeacherController::class, 'course_video_store'])->name('teacher.course.video.store');
    Route::get('/teacher/{board}/{qualification}/{course}/video', [TeacherController::class, 'course_video'])->name('teacher.course.video');

    Route::post('/mcq/store', [TeacherController::class, 'mcq_store'])->name('mcq.store');
});

// Student Routes
Route::middleware(['auth', 'role:student'])->group(function () {

    Route::post('student/logout', [LoginController::class, 'logout'])->name('student.logout');

    Route::get('/dashboard', [StudentController::class, 'dashboard'])->name('student.dashboard');

    // courses
    Route::get('/courses', [StudentController::class, 'courses'])->name('student.courses');
    Route::get('/course/{id}', [CourseController::class, 'index'])->name('course.index');
    Route::get('/video/{id}', [VideoController::class, 'index'])->name('video.index');

    // live classes
    Route::get('/live_classes', [StudentController::class, 'live_classes'])->name('student.live_classes');

    // boards
    Route::get('/examination-boards', [StudentController::class, 'boards'])->name('student.boards');

    // subjects
    Route::get('/subjects', [StudentController::class, 'subjects'])->name('student.subjects');

    // books
    Route::get('/books', [StudentController::class, 'books'])->name('student.books');

    // past papers
    Route::get('/past-papers', [StudentController::class, 'past_papers'])->name('student.past_papers');

    // teachers
    Route::get('/teachers', [StudentController::class, 'teachers'])->name('student.teachers');
    Route::get('/teacher/{id}', [StudentController::class, 'teacher'])->name('student.teacher');

    // profile
    Route::get('/profile', [StudentController::class, 'profile'])->name('student.profile');

    // Wallet
    Route::get('/wallet', [StudentController::class, 'wallet'])->name('student.wallet');

    Route::get('/courses/caie/olevel', [StudentController::class, 'caie_olevel'])->name('student.caie_olevel');
    Route::get('/courses/pearson/igcse', [StudentController::class, 'pearson_igcse'])->name('student.pearson_igcse');
});
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
    return view('welcome');
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

    Route::post('/admin/teachers/user', [AdminController::class, 'teacher_user'])->name('admin.teacher_user');

    Route::get('/admin/pearson/books', [AdminController::class, 'pearson_books'])->name('admin.pearson_books');
    Route::post('/admin/pearson/books', [AdminController::class, 'pearson_books_store'])->name('admin.pearson_books_store');

    Route::get('/admin/pearson/igcse/courses', [AdminController::class, 'pearson_igcse_courses'])->name('admin.pearson_igcse_courses');
    Route::post('/admin/pearson/igcse/courses/store', [AdminController::class, 'pearson_courses_store'])->name('admin.pearson_courses_store');

    Route::get('/admin/pearson/igcse/courses/{id}', [AdminController::class, 'pearson_courses_show'])->name('admin.pearson_course_details');
    Route::post('/admin/pearson/igcse/video/store', [AdminController::class, 'pearson_igcse_video_store'])->name('admin.pearson_igcse_video_store');

    Route::get('/admin/caie/olevel/courses', [AdminController::class, 'caie_olevel_courses'])->name('admin.caie_olevel_courses');
    Route::post('/admin/caie/olevel/courses/store', [AdminController::class, 'caie_courses_store'])->name('admin.caie_courses_store');

    Route::get('/admin/caie/olevel/courses/{id}', [AdminController::class, 'caie_courses_show'])->name('admin.caie_course_details');
    Route::post('/admin/caie/olevel/video/store', [AdminController::class, 'caie_olevel_video_store'])->name('admin.caie_olevel_video_store');


    Route::get('admin/demo', [AdminController::class, 'demo']);

    Route::post('/video/track', [AdminController::class, 'trackWatchTime'])->name('video.track');
});


// Teacher Routes
Route::middleware(['auth', 'role:teacher'])->group(function () {

    Route::post('teacher/logout', [LoginController::class, 'logout'])->name('teacher.logout');

    Route::get('/teacher/dashboard', [TeacherController::class, 'dashboard'])->name('teacher.dashboard');

    Route::get('/teacher/caie/olevel', [TeacherController::class, 'caie_olevel_index'])->name('teacher.caie_olevel');
    Route::get('/teacher/caie/alevel-as', [TeacherController::class, 'caie_alevel_as_index'])->name('teacher.caie_alevel_as');
    Route::get('/teacher/pearson/igcse', [TeacherController::class, 'pearson_igcse_index'])->name('teacher.pearson_igcse');

    Route::get('/teacher/{board}/{grade}/{id}/videos', [TeacherController::class, 'course_videos'])->name('teacher.course_videos');
    Route::post('/teacher/video/store/{board}/{grade}/{id}', [TeacherController::class, 'video_store'])->name('teacher.video_store');

    Route::post('/teacher/course/store', [TeacherController::class, 'course_store'])->name('teacher.course_store');

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

    // profile
    Route::get('/profile', [StudentController::class, 'profile'])->name('student.profile');

    // Wallet
    Route::get('/wallet', [StudentController::class, 'wallet'])->name('student.wallet');

    Route::get('/courses/caie/olevel', [StudentController::class, 'caie_olevel'])->name('student.caie_olevel');
    Route::get('/courses/pearson/igcse', [StudentController::class, 'pearson_igcse'])->name('student.pearson_igcse');
});
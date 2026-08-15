<?php
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LiveClassBatchController;
use App\Http\Controllers\LiveClassController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\WalletController;

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

Route::get('/forgot-password', [LoginController::class, 'forgot_password'])->name('forgot.password');
Route::post('/forgot-password', [LoginController::class, 'send_forgot_password_otp'])->name('forgot.password.submit');

Route::get('/reset-password', [LoginController::class, 'reset_password'])->name('reset.password'); 
Route::post('/verify-reset-password-otp', [LoginController::class, 'verify_reset_password_otp'])->name('verify.reset.password.otp');
Route::post('/update-reset-password', [LoginController::class, 'update_reset_password'])
    ->name('update.reset.password');

Route::get('/chatbot', [ChatbotController::class, 'index'])->name('chatbot.index');

Route::get('/optimize-clear', function () {
    Artisan::call('optimize:clear');

    return response()->json([
        'success' => true,
        'message' => 'Application cache cleared successfully.',
    ]);
});

Route::middleware(['auth', 'role:admin'])->group(function () {

    Route::post('admin/logout', [LoginController::class, 'logout'])->name('admin.logout');

    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    Route::get('/admin/students', [AdminController::class, 'student'])->name('admin.student');

    Route::get('/admin/teacher/applications', [AdminController::class, 'teacher_applications'])->name('admin.teacher.applications');
    Route::get('/admin/teacher/application/{application}', [AdminController::class, 'teacher_application_show'])->name('admin.teacher.application.show');
    Route::put('/admin/teacher/application/update/status/{application}', [AdminController::class, 'teacher_application_update_status'])->name('admin.teacher.application.status.update');


    Route::get('/admin/teachers', [AdminController::class, 'teacher'])->name('admin.teacher.index');
    Route::get('/admin/teachers/{teacher}', [AdminController::class, 'teacher_show'])->name('admin.teachers.show');
    Route::post('admin/teacher/{id}/assign-subjects', [AdminController::class, 'teacher_assign_subjects'])->name('admin.teacher.assign.subjects');
    Route::delete('admin/teacher/{id}/class-destroy', [AdminController::class, 'teacher_class_destroy'])->name('admin.teacher.class.destroy');
    Route::post('/admin/teacher/{id}/create-user', [AdminController::class, 'teacher_create_user'])->name('admin.teacher.create.user');
    Route::post('/admin/teachers/user', [AdminController::class, 'teacher_user'])->name('admin.teacher_user');

    Route::get('/admin/books/{board}', [AdminController::class, 'books_index'])->name('admin.books.index');

    Route::get('/admin/courses/{board}/{grade}', [AdminController::class, 'course_index'])->name('admin.course.index');

    Route::get('/admin/live_class_batches/{board}/{grade}', [LiveClassBatchController::class, 'index'])->name('admin.live_class_batches.index');
    Route::post('/admin/live_class_batches/{board}/{grade}/store', [LiveClassBatchController::class, 'store'])->name('admin.live_class_batches.store');
    Route::get('/admin/live_class_batches/{board}/{grade}/{batch}', [LiveClassBatchController::class, 'show'])->name('admin.live_class_batches.show');
    Route::get('/admin/live_class_batches/{board}/{grade}/{batch}/edit', [LiveClassBatchController::class, 'edit'])->name('admin.live_class_batches.edit');
    Route::put('/admin/live_class_batches/{board}/{grade}/{batch}', [LiveClassBatchController::class, 'update'])->name('admin.live_class_batches.update');
    Route::delete('/admin/live_class_batches/{board}/{grade}/{batch}', [LiveClassBatchController::class, 'destroy'])->name('admin.live_class_batches.destroy');

    Route::get('/admin/live_class/{live_class}', [LiveClassController::class, 'index'])->name('admin.live_classes.index');
    Route::post('/admin/live_class/store', [LiveClassController::class, 'store'])->name('admin.live_classes.store');

    Route::get('admin/wallets', [WalletController::class, 'index'])->name('admin.wallet.index');
    Route::get('admin/wallet/top-up/requests', [WalletController::class, 'topup_requests'])->name('admin.top-up.requests');
    Route::get('admin/wallet/top-up/request/{id}', [WalletController::class, 'topup_request_details'])->name('admin.top-up.request.details');
    Route::get('admin/wallet/top-up/request/{id}/screenshot', [WalletController::class, 'topup_request_screenshot'])->name('admin.top-up.request.screenshot');
    Route::post('admin/wallet/top-up-request/{id}/status', [WalletController::class, 'topup_request_update_status'])->name('admin.top-up.request.update-status');
    Route::get('admin/vouchers', [WalletController::class, 'vouchers'])->name('admin.vouchers.index');
    Route::get('admin/voucher/{id}', [WalletController::class, 'voucher_show'])->name('admin.vouchers.show');
    Route::post('admin/voucher/store', [WalletController::class, 'voucher_store'])->name('admin.vouchers.store');

    Route::get('admin/demo', [AdminController::class, 'demo']);
    Route::post('/video/track', [AdminController::class, 'trackWatchTime'])->name('video.track');
});


// Teacher Routes
Route::middleware(['auth', 'role:teacher'])->group(function () {

    Route::get('/teacher/dashboard', [TeacherController::class, 'dashboard'])->name('teacher.dashboard');
    Route::get('/teacher/{board}/{grade}/batches', [TeacherController::class, 'live_class_batches_index'])->name('teacher.live_class_batches.index');
    
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
    Route::get('/live-classes', [StudentController::class, 'live_classes'])->name('student.live_classes');
    Route::get('/browse-live-classes', [StudentController::class, 'browse_live_classes'])->name('student.browse_live_classes');
    Route::get('/live-classes-batch/{id}', [StudentController::class, 'live_class_batch'])->name('student.live_class_batch');
    
    Route::post('/live-class-enroll/{id}', [StudentController::class, 'live_class_enroll'])->name('student.live_class.enroll');
    Route::post('/live-class-batch-enroll/{id}', [StudentController::class, 'live_classes_batch_enroll'])->name('student.live_class_batch.enroll');

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
    Route::post('/profile-update', [StudentController::class, 'profile_update'])->name('student.profile.update');

    // Wallet
    Route::get('/wallet', [StudentController::class, 'wallet'])->name('student.wallet');
    Route::get('/top-up', [StudentController::class, 'topup'])->name('student.topup');
    Route::get('/withdraw', [StudentController::class, 'withdraw'])->name('student.withdraw');

    Route::get('/courses/caie/olevel', [StudentController::class, 'caie_olevel'])->name('student.caie_olevel');
    Route::get('/courses/pearson/igcse', [StudentController::class, 'pearson_igcse'])->name('student.pearson_igcse');
});
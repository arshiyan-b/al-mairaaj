<?php

namespace App\Http\Controllers;

use App\Services\BatchService;
use App\Services\EnrollmentService;
use App\Services\WalletService;

use App\Models\Batch;
use App\Models\Board;
use App\Models\CurriculumSubject;
use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\LiveClass;
use App\Models\Student;
use App\Models\Teacher;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    protected $batchService;
    protected $enrollmentService;
    protected $walletService;

    public function __construct(
        BatchService $batchService,
        EnrollmentService $enrollmentService,
        WalletService $walletService,
    ) {
        $this->batchService = $batchService;
        $this->enrollmentService = $enrollmentService;
        $this->walletService = $walletService;
    }

    public function dashboard()
    {
        return view('student.dashboard', ['user' => auth()->user()]);
    }
    public function courses()
    {
        return view('student.courses.index', ['user' => auth()->user()]);
    }
    public function live_classes()
    {
        return view('student.live_classes.index');
    }
    public function browse_live_classes()
    {
        return view('student.live_classes.browse');
    }
    public function live_class_batch($id)
    {
        $batchTitle = $this->batchService->getBatchTitle($id);
        return view('student.live_classes.batch', compact('batchTitle'));
    }
    public function live_class_batch_enroll($id)
    {
        $batchTitle = $this->batchService->getBatchTitle($id);
        $canEnroll = $this->batchService->checkAuthenticatedStudentWalletBalanceForBatch($id);

        if (!$canEnroll) {
            return redirect()
                ->route('student.wallet')
                ->with('error', 'Insufficient wallet balance to enroll in "' . $batchTitle . '". Please top up your wallet.');
        }
        
        $batchPrice = $this->batchService->getBatchPrice($id);
        $this->enrollmentService->create($id);
        $this->walletService->debit(auth()->user()->student->wallet, $batchPrice);

        return redirect()
            ->route('student.wallet')
            ->with('success', 'You have successfully enrolled in "' . $batchTitle . '".');
    }
    public function boards()
    {
        return view('student.boards.index');
    }
    public function subjects()
    {
        return view('student.subjects.index');
    }
    public function books()
    {
        return view('student.books.index');
    }
    public function past_papers()
    {
        return view('student.past_papers.index');
    }
    public function teachers()
    {
        return view('student.teachers.index');
    }
    public function teacher()
    {
        return view('student.teachers.profile');
    }
    public function profile()
    {
        return view('student.profile.index');
    }
    public function wallet()
    {
        return view('student.wallet.index');
    }
    public function topup()
    {
        return view('student.wallet.topup');
    }
    public function withdraw()
    {
        return view('student.wallet.withdraw');
    }
}
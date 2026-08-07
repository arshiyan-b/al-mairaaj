<?php

namespace App\Http\Controllers;

use App\Services\BatchService;
use App\Services\BatchEnrollmentService;
use App\Services\LiveClassesService;
use App\Services\LiveClassEnrollmentService;
use App\Services\WalletService;
use App\Services\WalletTransactionService;

class StudentController extends Controller
{
    protected $batchService;
    protected $batchEnrollmentService;
    protected $liveClassesService;
    protected $liveClassEnrollmentService;
    protected $walletService;
    protected $walletTransactionService;

    public function __construct(
        BatchService $batchService,
        BatchEnrollmentService $batchEnrollmentService,
        LiveClassesService $liveClassesService,
        LiveClassEnrollmentService $liveClassEnrollmentService,
        WalletService $walletService,
        WalletTransactionService $walletTransactionService,
    ) {
        $this->batchService = $batchService;
        $this->batchEnrollmentService = $batchEnrollmentService;
        $this->liveClassesService = $liveClassesService;
        $this->liveClassEnrollmentService = $liveClassEnrollmentService;
        $this->walletService = $walletService;
        $this->walletTransactionService = $walletTransactionService;
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
    public function live_class_enroll($id)
    {
        $liveClassTitle = $this->liveClassesService->getLiveClassTitle($id);
        $canEnroll = $this->liveClassesService->checkAuthenticatedStudentWalletBalanceForLiveClass($id);

        if (!$canEnroll) {
            return redirect()
                ->route('student.wallet')
                ->with('error', 'Insufficient wallet balance to enroll in "' . $liveClassTitle . '". Please top up your wallet.');
        }

        $liveClassEnrollment = $this->liveClassEnrollmentService->create($id, auth()->user()->student->id);
        $this->walletTransactionService->debitForAuthenticatedStudentLiveClassEnrollment(
            auth()->user()->student->wallet,
            $liveClassEnrollment->id,
            $liveClassEnrollment->liveClass->price,
            'live_class_enrollment',
            'wallet',
            'completed',
            'Live class enrollment: ' . $liveClassTitle
        );

        return redirect()
            ->back()
            ->with('success', 'You have successfully enrolled in "' . $liveClassTitle . '".');
    }
    public function live_classes_batch_enroll($id)
    {
        $batchTitle = $this->batchService->getBatchTitle($id);
        $canEnroll = $this->batchService->checkAuthenticatedStudentWalletBalanceForBatch($id);

        if (!$canEnroll) {
            return redirect()
                ->route('student.wallet')
                ->with('error', 'Insufficient wallet balance to enroll in "' . $batchTitle . '". Please top up your wallet.');
        }
        
        return redirect()
            ->back()
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
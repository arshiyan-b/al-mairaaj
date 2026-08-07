<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTopupRequestRequest;

use App\Services\BatchService;
use App\Services\BatchEnrollmentService;
use App\Services\BoardService;
use App\Services\CurriculumSubjectService;
use App\Services\GradeService;
use App\Services\LiveClassesService;
use App\Services\StudentService;
use App\Services\TeacherService;
use App\Services\TopupRequestService;
use App\Services\WalletService;
use App\Services\WalletTransactionService;

use App\Models\Batch;
use App\Models\Wallet;
use App\Models\WalletTransaction;

use Illuminate\Http\Request;

class ApiController extends Controller
{
    protected $batchService;
    protected $batchEnrollmentService;
    protected $boardService;
    protected $curriculumSubjectService;
    protected $gradeService;
    protected $liveClassesService;
    protected $studentService;
    protected $teacherService;
    protected $topupRequestService;
    protected $walletService;
    protected $walletTransactionService;

    public function __construct(
        BatchService $batchService,
        BatchEnrollmentService $batchEnrollmentService,
        BoardService $boardService,
        CurriculumSubjectService $curriculumSubjectService,
        GradeService $gradeService,
        LiveClassesService $liveClassesService,
        StudentService $studentService,
        TeacherService $teacherService,
        TopupRequestService $topupRequestService,
        WalletService $walletService,
        WalletTransactionService $walletTransactionService,
    ) {
        $this->batchService = $batchService;
        $this->batchEnrollmentService = $batchEnrollmentService;
        $this->boardService = $boardService;
        $this->curriculumSubjectService = $curriculumSubjectService;
        $this->gradeService = $gradeService;
        $this->liveClassesService = $liveClassesService;
        $this->studentService = $studentService;
        $this->teacherService = $teacherService;
        $this->topupRequestService = $topupRequestService;
        $this->walletService = $walletService;
        $this->walletTransactionService = $walletTransactionService;
    }
    public function student_profile_data()
    {
        $profile = $this->studentService->getAuthenticatedStudent();

        return response()->json([
            'profile' => $profile,
        ]);
    }
    public function student_wallet_data()
    {
        $student = $this->studentService->getAuthenticatedStudent();
        $wallet = $this->walletService->getAuthenticatedStudentWallet();

        if (!$wallet) {
            $wallet = Wallet::create([
                'student_id' => $student->id,
                'balance' => 0.00,
                'currency' => 'PKR',
                'status' => 'active',
            ]);
            $wallet->setRelation('transactions', []);
        }

        $walletTransactions = $this->walletTransactionService->getAuthenticatedStudentWalletTransactions();
        $topupRequests = $this->topupRequestService->getAuthenticatedStudentPendingTopupRequests();

        return response()->json([
            'wallet' => $wallet,
            'walletTransactions' => $walletTransactions,
            'topupRequests' => $topupRequests,
        ]);
    }
    public function student_topup_request(StoreTopupRequestRequest $request)
    {
        $topupRequest = $this->topupRequestService->create(
            auth()->user()->student->wallet,
            $request->validated(),
            $request->file('screenshot')
        );

        return redirect()
            ->route('student.wallet')
            ->with('success', 'Top-up request submitted successfully.');
    }
    public function student_withdraw_request(Request $request)
    {
        dd($request);
        $profile = $this->studentService->getAuthenticatedStudent();
        if (!$student) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'amount' => 'required|numeric|min:1',
            'method' => 'required|string',
            'account_title' => 'required|string',
            'account_number' => 'required|string',
            'bank_name' => 'nullable|string',
        ]);

        $wallet = $this->walletService->getAuthenticatedStudentWallet();
        if (!$wallet || $wallet->balance < $request->amount) {
            return response()->json(['message' => 'Insufficient wallet balance for withdrawal.'], 422);
        }

        $wallet->balance -= $request->amount;
        $wallet->save();

        $ref = 'WD-' . strtoupper(substr(md5(uniqid()), 0, 8));

        WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'title' => 'Withdrawal Request (' . ucfirst($request->method) . ')',
            'type' => 'debit',
            'amount' => $request->amount,
            'reference' => $ref,
            'status' => 'pending',
            'description' => 'Withdrawal to ' . $request->account_title . ' (' . $request->account_number . ')',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Withdrawal request submitted successfully.',
            'balance' => (float) $wallet->balance,
            'reference' => $ref,
            'status' => 'pending',
        ]);
    }
    public function student_subjects_data()
    {
        $curriculum_subjects = $this->curriculumSubjectService->getCurriculumSubjects();
        $grades = $this->gradeService->getGrades();
        $boards = $this->boardService->getBoards();

        return response()->json([
            'curriculum_subjects' => $curriculum_subjects,
            'grades' => $grades,
            'boards' => $boards,
        ]);
    }
    public function student_teachers_data()
    {   
        $curriculum_subjects = $this->curriculumSubjectService->getCurriculumSubjects();
        $grades = $this->gradeService->getGrades();
        $boards = $this->boardService->getBoards();
        $teachers = $this->teacherService->getTeachers();

        return response()->json([
            'curriculum_subjects' => $curriculum_subjects,
            'grades' => $grades,
            'boards' => $boards,
            'teachers' => $teachers,
        ]);
    }
    public function student_teacher_profile_data($id)
    {
        $teacher = $this->teacherService->getTeacher($id);
        return response()->json($teacher); 
    }
    public function student_live_classes_data()
    {
        $student = $this->studentService->getAuthenticatedStudent();
        $enrollments = $this->batchEnrollmentService->getAuthenticatedStudentEnrollments();
        $batchIds = $enrollments->pluck('batch_id');
        $liveClasses = $this->liveClassesService->getUpcomingLiveClassesByBatchIds($batchIds);
        $today = now()->toDateString();
        $liveToday = $liveClasses->filter(fn ($c) => $c->class_date->toDateString() === $today)->values();
        $upcomingLiveClasses = $liveClasses->filter(fn ($c) => $c->class_date->toDateString() > $today)
            ->take(10)
            ->values();

        return response()->json([
            'student' => $student,
            'enrollments' => $enrollments,
            'live_today' => $liveToday,
            'upcoming_live_classes' => $upcomingLiveClasses,
            'stats' => [
                'active_batches' => $enrollments->count(),
                'live_today_count' => $liveToday->count(),
                'upcoming_count' => $upcomingLiveClasses->count(),
            ],
        ]);
    }

    public function browse_live_classes_data()
    {
        $batches = Batch::with([
            'teacher:id,name',
            'curriculumSubject:id,name,code,grade_id',
            'curriculumSubject.grade:id,name,board_id',
            'curriculumSubject.grade.board:id,name',
        ])
            ->whereIn('status', ['active', 'pending'])
            ->get();

        $grades = $this->gradeService->getGrades();
        $boards = $this->boardService->getBoards();
        $curriculum_subjects = $this->curriculumSubjectService->getCurriculumSubjects();
        $enrollments = $this->batchEnrollmentService->getAuthenticatedStudentEnrollments();

        return response()->json([
            'batches' => $batches,
            'boards' => $boards,
            'grades' => $grades,
            'curriculum_subjects' => $curriculum_subjects,
            'enrollments' => $enrollments,
        ]);
    }

    public function student_live_class_batch($id)
    {
        $batch = $this->batchService->getBatch($id);
        $liveClasses = $this->liveClassesService->getAuthenticatedStudentLiveClassesByBatchId($batch->id);

        return response()->json([
            'batch' => $batch,
            'live_classes' => $liveClasses,
        ]);
    }
}
<?php

namespace App\Http\Controllers;

use App\Services\BatchService;
use App\Services\BoardService;
use App\Services\CurriculumSubjectService;
use App\Services\EnrollmentService;
use App\Services\GradeService;
use App\Services\LiveClassesService;
use App\Services\TeacherService;
use App\Services\TopupRequestService;

use App\Models\Batch;
use App\Models\Board;
use App\Models\CurriculumSubject;
use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\LiveClass;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\TopupRequest;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\WithdrawRequest;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ApiController extends Controller
{
    protected $batchService;
    protected $boardService;
    protected $enrollmentService;
    protected $gradeService;
    protected $liveClassesService;
    protected $teacherService;
    protected $topupRequestService;

    public function __construct(
        BatchService $batchService,
        BoardService $boardService,
        CurriculumSubjectService $curriculumSubjectService,
        EnrollmentService $enrollmentService,
        GradeService $gradeService,
        LiveClassesService $liveClassesService,
        TeacherService $teacherService,
        TopupRequestService $topupRequestService,
    ) {
        $this->batchService = $batchService;
        $this->curriculumSubjectService = $curriculumSubjectService;
        $this->enrollmentService = $enrollmentService;
        $this->liveClassesService = $liveClassesService;
        $this->topupRequestService = $topupRequestService;
    }
    public function student_profile_data()
    {
        $profile = Student::find(auth()->user()->student->id);

        return response()->json([
            'profile' => $profile,
        ]);
    }
    public function student_wallet_data()
    {
        $student = auth()->user()?->student;
        if (!$student) {
            return response()->json(['wallet' => null, 'message' => 'Unauthenticated student'], 401);
        }

        $wallet = Wallet::with('transactions')
            ->where('student_id', $student->id)
            ->first();

        if (!$wallet) {
            $wallet = Wallet::create([
                'student_id' => $student->id,
                'balance' => 0.00,
                'currency' => 'PKR',
                'status' => 'active',
            ]);
            $wallet->setRelation('transactions', []);
        }

        $topupRequests = TopupRequest::where('user_id', auth()->user()->id)->first();

        return response()->json([
            'wallet' => $wallet,
            'topupRequests' => $topupRequests,
        ]);
    }
    public function student_topup_request(StoreTopupRequestRequest $request)
    {
        $topupRequest = $this->topupRequestService->create(
            auth()->user()->student,
            $request->validated(),
            $request->file('screenshot')
        );

        return response()->json([
            'success' => true,
            'message' => 'Top-up request submitted successfully.',
            'data' => $topupRequest,
        ], 201);
    }
    public function student_withdraw_request(Request $request)
    {
        dd($request);
        $student = auth()->user()?->student;
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

        $wallet = Wallet::where('student_id', $student->id)->first();
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
        $batches = Batch::with([
            'teacher:id,name',
            'curriculumSubject:id,name,code,grade_id',
            'curriculumSubject.grade:id,name,board_id',
            'curriculumSubject.grade.board:id,name',
        ])
            ->where('teacher_id', $teacher->id)
            ->get();

        return response()->json($teacher); 
    }
    public function student_live_classes_data()
    {
        $student = auth()->user()->student;

        $enrollments = Enrollment::with([
                'batch:id,title,status,start_date,end_date,total_classes,teacher_id,curriculum_subject_id',
                'batch.teacher:id,name',
                'batch.curriculumSubject:id,name,grade_id',
                'batch.curriculumSubject.grade:id,name,board_id',
                'batch.curriculumSubject.grade.board:id,name',
            ])
            ->where('student_id', $student->id)
            ->get();

        $batchIds = $enrollments->pluck('batch_id');

        $liveClasses = LiveClass::with('batch:id,title')
            ->whereIn('batch_id', $batchIds)
            ->whereDate('class_date', '>=', now()->toDateString())
            ->orderBy('class_date')
            ->orderBy('start_time')
            ->get();

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
        $enrollments = $this->enrollmentService->getEnrollmentsByStudentId(auth()->user()->student->id);

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
        $liveClasses = $this->liveClassesService->getLiveClassesByBatchId($batch->id);
        $studentId = auth()->user()->student->id;
        $isEnrolled = $this->enrollmentService->isStudentEnrolled(
            $studentId,
            $batch->id
        );

        return response()->json([
            'batch' => $batch,
            'live_classes' => $liveClasses,
            'is_enrolled' => $isEnrolled,
        ]);
    }
}
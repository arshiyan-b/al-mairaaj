<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

use App\Services\BatchService;
use App\Services\BatchEnrollmentService;
use App\Services\JitsiTokenService;
use App\Services\LiveClassesService;
use App\Services\LiveClassEnrollmentService;
use App\Services\WalletService;
use App\Services\WalletTransactionService;

use App\Models\Student;
use App\Models\LiveClass;

class StudentController extends Controller
{
    protected $batchService;
    protected $batchEnrollmentService;
    protected $jitsiTokenService;
    protected $liveClassesService;
    protected $liveClassEnrollmentService;
    protected $walletService;
    protected $walletTransactionService;

    public function __construct(
        BatchService $batchService,
        BatchEnrollmentService $batchEnrollmentService,
        JitsiTokenService $jitsiTokenService,
        LiveClassesService $liveClassesService,
        LiveClassEnrollmentService $liveClassEnrollmentService,
        WalletService $walletService,
        WalletTransactionService $walletTransactionService,
    ) {
        $this->batchService = $batchService;
        $this->batchEnrollmentService = $batchEnrollmentService;
        $this->jitsiTokenService = $jitsiTokenService;
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
    public function profile_update(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'father_name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'whatsapp_number' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
        ]);

        $student = Student::where('user_id', auth()->id())->first();

        if (!$student) {
            return response()->json(['status' => 'error', 'message' => 'Student profile not found.'], 404);
        }

        $student->update($request->only([
            'first_name', 'middle_name', 'last_name', 'father_name',
            'phone_number', 'whatsapp_number', 'date_of_birth',
            'address', 'city', 'country',
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully!',
            'profile' => $student->fresh(),
        ]);
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
    public function redeem_voucher()
    {
        
    }
    public function join(
        Request $request,
        JitsiTokenService $jitsiTokenService
    ) {
        $request->validate([
            'live_class_id' => [
                'required',
                'integer',
                'exists:live_classes,id',
            ],
        ]);

        $user = $request->user();

        if (!$user || !$user->student) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $liveClass = LiveClass::with('meetingDetail')
            ->findOrFail($request->live_class_id);

        /*
         * Check enrollment
         */
        $isEnrolled = $liveClass->enrollments()
            ->where('student_id', $user->student->id)
            ->where('status', 'enrolled')
            ->exists();

        if (!$isEnrolled) {
            return response()->json([
                'message' => 'You are not enrolled in this live class.',
            ], 403);
        }

        /*
         * Check meeting details
         */
        if (!$liveClass->meetingDetail) {
            return response()->json([
                'message' => 'Meeting is not available for this class.',
            ], 404);
        }

        /*
         * JITSI
         */
        if ($liveClass->meeting_provider === 'jitsi') {
            $tokenData = $jitsiTokenService->generate(
                liveClass: $liveClass,
                studentId: $user->student->id,
                userName: $user->name,
                userEmail: $user->email,
                isModerator: false
            );

            return response()->json([
                'provider' => 'jitsi',
                'meeting_url' => $tokenData['meeting_url'],
            ]);
        }

        /*
         * ZOOM
         */
        if ($liveClass->meeting_provider === 'zoom') {
            return response()->json([
                'provider' => 'zoom',
                'meeting_url' => $liveClass->meetingDetail->meeting_url,
            ]);
        }

        return response()->json([
            'message' => 'Unsupported meeting provider.',
        ], 400);
    }
}
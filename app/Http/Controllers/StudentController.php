<?php

namespace App\Http\Controllers;

use App\Models\CaieCourse;
use App\Models\CaieOlevelVideo;
use App\Models\PearsonCourse;
use App\Models\PearsonIgcseVideo;
use App\Models\Student;
use App\Models\StudentUserOtp;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function dashboard()
    {
        return view('student.dashboard', ['user' => auth()->user()]);
    }
    public function courses()
    {
        return view('student.courses.index', ['user' => auth()->user()]);
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
    public function profile()
    {
        return view('student.profile.index');
    }
    public function wallet()
    {
        return view('student.wallet.index');
    }

    public function otp_verify(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        $otpRecord = StudentUserOtp::where('email', $request->email)
            ->where('otp', $request->otp)
            ->where('status', 'pending')
            ->first();

        if (!$otpRecord) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid OTP or email address.',
            ], 400);
        }

        if ($otpRecord->isExpired()) {
            return response()->json([
                'status' => 'error',
                'message' => 'OTP has expired. Please request a new one.',
            ], 400);
        }

        // Create user account
        $user = User::create([
            'name' => $otpRecord->student->first_name . ' ' . $otpRecord->student->last_name,
            'email' => $otpRecord->email,
            'password' => $otpRecord->password,
            'role' => 'student',
        ]);

        // Update student record
        $otpRecord->student->update([
            'user_created' => 1,
        ]);

        // Update OTP record
        $otpRecord->update([
            'status' => 'verified',
        ]);

        // Login the user
        Auth::login($user);

        return response()->json([
            'status' => 'success',
            'message' => 'Account verified successfully!',
            'redirect' => route('student.dashboard'),
        ]);
    }

}

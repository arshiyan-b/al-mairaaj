<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

use App\Models\Role;
use App\Models\Student;
use App\Models\StudentUserOtp;
use App\Models\Subject;
use App\Models\TeacherApplication;
use App\Models\TeacherDoc;
use App\Models\User;
use App\Models\Grade;
use App\Models\Wallet;

use App\Mail\StudentRegistrationOTP;

class LoginController extends Controller
{
    // Show login form
    public function showLoginForm()
    {
        return view('login'); // Return the login view
    }

    public function teacher_register(Request $request)
    {
        $grades = Grade::all();
        $subjects = Subject::all();

        return view('register_as_a_teacher', compact('grades', 'subjects'));
    }

    public function teacher_register_store (Request $request)
    {
        $request->validate([
            'teacher_name' => 'required|string|max:50',
            'teacher_cnic' => 'required|string|max:15|unique:teacher_applications,cnic',
            'teacher_gender' => 'required|in:male,female,other',
            'teacher_phone_no' => 'required|string|max:15',
            'teacher_whatsapp_no' => 'required|string|max:15',
            'teacher_email' => 'required|email|max:60|unique:teacher_applications,email',
            'teacher_city' => 'required|string|max:50',
            'teacher_address' => 'required|string|max:120',
            'highest_degree' => 'required|string|max:45',
            'field_of_study' => 'required|string|max:65',
            'university' => 'required|string|max:75',
            'experience' => 'required',

            'preferred_grades' => 'required|array|min:1',
            'preferred_grades.*' => 'integer|exists:grades,id',

            'preferred_subjects' => 'required|array|min:1',
            'preferred_subjects.*' => 'string|max:255',

            'preferred_timings' => 'required|array|min:1',
            'preferred_timings.*' => 'required|string|in:Morning,Afternoon,Evening,Night',

            'resume' => 'required|file|mimes:pdf,doc,docx',
            'picture' => 'required|image',
            'agree' => 'required',
        ]);

        $teacherApplication = TeacherApplication::create([
            'name' => $request->teacher_name,
            'cnic' => $request->teacher_cnic,
            'gender' => $request->teacher_gender,
            'phone_number' => $request->teacher_phone_no,
            'whatsapp_number' => $request->teacher_whatsapp_no,
            'email' => $request->teacher_email,
            'city' => $request->teacher_city,
            'address' => $request->teacher_address,
            'highest_degree' => $request->highest_degree,
            'field_of_study' => $request->field_of_study,
            'university' => $request->university,
            'experience' => $request->experience,
            'preferred_grades' => $request->preferred_grades,
            'preferred_subjects' => $request->preferred_subjects,
            'preferred_timings' => $request->preferred_timings,
            'agree' => 'yes',
            'user_created' => 0,
        ]);

        if ($request->hasFile('resume')) {
            $path = $request->file('resume')->store('teacher_docs/resumes', 'public');

            TeacherDoc::create([
                'application_id' => $teacherApplication->id,
                'type' => 'resume',
                'file_path' => $path,
            ]);
        }

        if ($request->hasFile('picture')) {
            $path = $request->file('picture')->store('teacher_docs/pictures', 'public');

            TeacherDoc::create([
                'application_id' => $teacherApplication->id,
                'type' => 'picture',
                'file_path' => $path,
            ]);
        }

        return redirect()
            ->back()
            ->with('success', 'Registration submitted successfully.');
    }

    public function register()
    {
        return view('register');
    }

    public function register_authenticate(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'father_name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email',
            'phone' => ['required', 'regex:/^\+[1-9]\d{7,14}$/'],
            'whatsapp' => ['required', 'regex:/^\+[1-9]\d{7,14}$/'],
            'password' => ['required', 'confirmed', 'regex:/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/'],
        ], [
            'email.unique' => 'This email is already registered.',
            'phone.regex' => 'Please enter a valid phone number including the country code.',
            'whatsapp.regex' => 'Please enter a valid phone number including the country code.',
            'password.confirmed' => 'Password confirmation does not match.',
            'password.regex' => 'Password must be at least 8 characters long and include: one uppercase letter, one lowercase letter, one number, and one special character.',
        ]);

        $otp = rand(100000, 999999);

        $student = Student::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'father_name' => $request->father_name,
            'email' => $request->email,
            'phone_number' => $request->phone,
            'whatsapp_number' => $request->whatsapp,
        ]);

        StudentUserOtp::create([
            'student_id' => $student->id,
            'email' => $student->email,
            'password' => Hash::make($request->password),
            'otp' => $otp,
            'status' => 'pending',
            'type' => 'registration',
            'expires_at' => now()->addMinutes(10),
        ]);

        $formattedLink = route('otp') . '?email=' . urlencode($student->email);
        Mail::to($student->email)->send(new StudentRegistrationOTP($otp, $formattedLink));

        return response()->json([
            'status' => 'success',
            'message' => 'OTP has been sent to your email address.',
            'redirect' => route('otp'),
            'email' => $student->email,
        ]);
    }
    public function verify_otp(Request $request)
    {
        $email = $request->input('email') ?? $request->query('email');

        if ($email) {
            return view('otp', compact('email'));
        } else {
            return redirect()->route('register')
                ->with('error', 'Email not found. Please start registration again.');
        }
    }

    public function verify_otp_authenticate(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|numeric',
        ]);

        $otpRecord = StudentUserOtp::where('email', $request->email)
            ->whereIn('type', ['registration', 'reset_password'])
            ->latest()
            ->first();

        if (!$otpRecord) {
            return response()->json([
                'status' => 'error',
                'message' => 'No OTP found for this email.',
            ]);
        } elseif ($otpRecord->status === 'verified') {
            return response()->json([
                'status' => 'success',
                'message' => 'This OTP has already been verified.',
                'redirect' => route('login'),
            ]);
        } elseif ($otpRecord->status === 'expired') {
            return response()->json([
                'status' => 'error',
                'message' => 'This OTP is no longer valid.',
            ]);
        } elseif (now()->greaterThan($otpRecord->expires_at)) {

            $otp = rand(100000, 999999);
            $otpRecord->update(['otp' => $otp, 'expires_at' => now()->addMinutes(10)]);

            $formattedLink = $otpRecord->type === 'registration'
                ? route('otp') . '?email=' . urlencode($request->email)
                : route('reset.password') . '?email=' . urlencode($request->email);

            Mail::to($request->email)->send(new StudentRegistrationOTP($otp, $formattedLink));

            return response()->json([
                'status' => 'success',
                'message' => 'This OTP has expired. Please enter the new one.',
                'redirect' => $formattedLink,
                'email' => $request->email,
            ]);
        } elseif ((string) $otpRecord->otp !== (string) $request->otp) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid OTP. Please try again.',
            ]);
        }

        // ---- OTP is valid — branch by type ----

        if ($otpRecord->type === 'registration') {
            // Original registration logic, unchanged
            $otpRecord->update(['status' => 'verified']);

            $student = Student::where('email', $request->email)->first();
            $studentRole = Role::where('slug', 'student')->first();

            $student->update(['otp_verified' => 1]);

            $user = User::create([
                'name' => $student->full_name,
                'email' => $student->email,
                'password' => $otpRecord->password,
                'role_id' => $studentRole->id,
                'student_id' => $student->id,
                'created_at' => now(),
                'email_verified_at' => now(),
            ]);

            $student->update([
                'user_id' => $user->id,
            ]);

            Wallet::create([
                'student_id' => $student->id,
                'balance' => 0,
                'currency' => 'PKR',
                'status' => 'active',
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'OTP verified successfully!',
                'redirect' => route('login'),
            ]);
        }

        // type === 'reset_password'
        $otpRecord->update(['status' => 'verified']);

        $student = Student::where('email', $request->email)->first();
        $user = User::where('student_id', $student->id)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'No account found to reset.',
            ]);
        }

        $user->update(['password' => $otpRecord->password]);

        return response()->json([
            'status' => 'success',
            'message' => 'Password reset successfully!',
            'redirect' => route('login'),
        ]);
    }

    public function authenticate(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $student = Student::where('email', $request->email)->first();

        if ($student && !$student->otp_verified) {
            $otp = rand(100000, 999999);

            StudentUserOtp::updateOrCreate(
                ['student_id' => $student->id],
                [
                    'email' => $student->email,
                    'password' => Hash::make($request->password),
                    'otp' => $otp,
                    'status' => 'pending',
                    'type' => 'registration',
                    'expires_at' => now()->addMinutes(10),
                ]
            );

            $formattedLink = route('otp') . '?email=' . urlencode($student->email);
            Mail::to($student->email)->send(new StudentRegistrationOTP($otp, $formattedLink));
            $student->update(['opt_sent' => 1]);

            return response()->json([
                'status' => 'success',
                'message' => 'OTP has been sent to your email address.',
                'redirect' => route('otp'). '?email=' . urlencode($student->email),
                'email' => $student->email,
            ]);
        }

        if (Auth::attempt($request->only('email', 'password'))) {
            $request->session()->regenerate();

            $user = Auth::user();

            if ($user->role->slug === 'student') {
                return response()->json([
                    'status' => 'success',
                    'redirect' => route('student.dashboard'),
                ]);
            } elseif ($user->role->slug === 'admin') {
                return response()->json([
                    'status' => 'success',
                    'redirect' => route('admin.dashboard'),
                ]);
            } elseif ($user->role->slug === 'teacher') {
                return response()->json([
                    'status' => 'success',
                    'redirect' => route('teacher.dashboard'),
                ]);
            }

            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized role.',
            ], 403);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Invalid email or password.',
        ], 401);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('login');
    }

    public function forgot_password()
    {
        return view('forgot_password');
    }

    public function reset_password()
    {
        return view('reset_password');
    }

    public function send_forgot_password_otp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:students,email',
            'password' => ['required', 'confirmed', 'regex:/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/'],
        ], [
            'email.exists' => 'No account found with that email.',
            'password.confirmed' => 'Password confirmation does not match.',
            'password.regex' => 'Password must be at least 8 characters long and include: one uppercase letter, one lowercase letter, one number, and one special character.',
        ]);

        $student = Student::where('email', $request->email)->first();

        $otp = rand(100000, 999999);

        StudentUserOtp::create([
            'student_id' => $student->id,
            'email' => $student->email,
            'password' => Hash::make($request->password),
            'otp' => $otp,
            'status' => 'pending',
            'type' => 'reset_password',
            'expires_at' => now()->addMinutes(10),
        ]);

        $formattedLink = route('reset.password') . '?email=' . urlencode($student->email);
        Mail::to($student->email)->send(new StudentRegistrationOTP($otp, $formattedLink));

        return response()->json([
            'status' => 'success',
            'message' => 'An OTP has been sent to your email to confirm the password reset.',
            'redirect' => route('reset.password') . '?email=' . urlencode($student->email),
            'email' => $student->email,
        ]);
    }
}

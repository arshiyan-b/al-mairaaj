<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

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

            // Picture is presented as optional on the form, so the validation
            // now matches that instead of silently rejecting valid submissions.
            'resume' => 'required|file|mimes:pdf,doc,docx|max:5120',
            'picture' => 'nullable|image|max:3072',
            'agree' => 'accepted',
        ], [
            'teacher_cnic.unique' => 'That CNIC is already registered with us.',
            'teacher_email.unique' => 'That email is already registered with us.',
            'resume.max' => 'Your resume is a bit large — please keep it under 5MB.',
            'picture.max' => 'Your picture is a bit large — please keep it under 3MB.',
            'agree.accepted' => 'Please accept the terms to continue.',
        ]);

        // Everything past this point is no longer covered by the validation
        // above, so wrap it and make sure a failure here (a bad upload, a
        // database hiccup, etc.) still tells the applicant what happened
        // instead of leaving them looking at a blank error page.
        try {

            DB::transaction(function () use ($request) {

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

            });

        } catch (\Throwable $e) {

            Log::error('Teacher application submission failed: ' . $e->getMessage());

            return redirect()
                ->back()
                ->withInput()
                ->with('error', "We hit a snag saving your application and it wasn't submitted. Please try again, and if it keeps happening, reach out to us directly so we can help.");
        }

        return redirect()
            ->back()
            ->with('success', "Thank you, {$request->teacher_name}! Your application is in good hands - our academic team will review it and reach out soon.");
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
            ->where('type', 'registration')
            ->latest()
            ->first();

        if (!$otpRecord) {
            return response()->json([
                'status' => 'error',
                'message' => 'No registration OTP found for this email.',
            ]);
        }

        if ($otpRecord->status === 'verified') {
            return response()->json([
                'status' => 'success',
                'message' => 'This OTP has already been verified.',
                'redirect' => route('login'),
            ]);
        }

        if ($otpRecord->status === 'expired') {
            return response()->json([
                'status' => 'error',
                'message' => 'This OTP is no longer valid.',
            ]);
        }

        if (now()->greaterThan($otpRecord->expires_at)) {

            $otp = rand(100000, 999999);

            $otpRecord->update([
                'otp' => $otp,
                'expires_at' => now()->addMinutes(10),
                'status' => 'pending',
            ]);

            $formattedLink = route('otp') . '?email=' . urlencode($request->email);

            Mail::to($request->email)->send(
                new StudentRegistrationOTP($otp, $formattedLink)
            );

            return response()->json([
                'status' => 'success',
                'message' => 'This OTP has expired. A new OTP has been sent to your email.',
                'redirect' => $formattedLink,
                'email' => $request->email,
            ]);
        }

        // Check OTP
        if ((string) $otpRecord->otp !== (string) $request->otp) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid OTP. Please try again.',
            ]);
        }

        $student = Student::where('email', $request->email)->first();

        if (!$student) {
            return response()->json([
                'status' => 'error',
                'message' => 'Student account not found.',
            ]);
        }

        $studentRole = Role::where('slug', 'student')->first();

        if (!$studentRole) {
            return response()->json([
                'status' => 'error',
                'message' => 'Student role not found.',
            ]);
        }

        // Mark OTP as verified
        $otpRecord->update([
            'status' => 'verified',
        ]);

        // Mark student as OTP verified
        $student->update([
            'otp_verified' => 1,
        ]);

        // Create user account
        $user = User::create([
            'name' => $student->full_name,
            'email' => $student->email,
            'password' => $otpRecord->password,
            'role_id' => $studentRole->id,
            'student_id' => $student->id,
            'created_at' => now(),
            'email_verified_at' => now(),
        ]);

        // Link user to student
        $student->update([
            'user_id' => $user->id,
        ]);

        // Create student's wallet
        Wallet::create([
            'student_id' => $student->id,
            'balance' => 0,
            'currency' => 'PKR',
            'status' => 'active',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'OTP verified successfully! Your account has been created.',
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
        ], [
            'email.exists' => 'No account found with that email.',
        ]);

        $student = Student::where('email', $request->email)->first();

        $otp = rand(100000, 999999);

        // Check for an existing pending password-reset OTP
        $otpRecord = StudentUserOtp::where('email', $student->email)
            ->where('type', 'reset_password')
            ->where('status', 'pending')
            ->first();

        if ($otpRecord) {
            // Update the existing OTP
            $otpRecord->update([
                'student_id' => $student->id,
                'otp' => $otp,
                'expires_at' => now()->addMinutes(10),
            ]);
        } else {
            // Create a new OTP if no pending OTP exists
            $otpRecord = StudentUserOtp::create([
                'student_id' => $student->id,
                'email' => $student->email,
                'otp' => $otp,
                'status' => 'pending',
                'type' => 'reset_password',
                'expires_at' => now()->addMinutes(10),
            ]);
        }

        $formattedLink = route('reset.password') . '?email=' . urlencode($student->email);

        Mail::to($student->email)->send(
            new StudentRegistrationOTP($otp, $formattedLink)
        );

        return response()->json([
            'status' => 'success',
            'message' => 'An OTP has been sent to your email to confirm the password reset.',
            'redirect' => route('reset.password') . '?email=' . urlencode($student->email),
            'email' => $student->email,
        ]);
    }

    public function verify_reset_password_otp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|numeric',
        ]);

        $otpRecord = StudentUserOtp::where('email', $request->email)
            ->where('type', 'reset_password')
            ->latest()
            ->first();

        if (!$otpRecord) {
            return response()->json([
                'status' => 'error',
                'message' => 'No OTP found for this email.',
            ]);
        }

        if ($otpRecord->status === 'verified') {
            return response()->json([
                'status' => 'error',
                'message' => 'This OTP has already been verified.',
            ]);
        }

        if ($otpRecord->status === 'expired') {
            return response()->json([
                'status' => 'error',
                'message' => 'This OTP is no longer valid.',
            ]);
        }

        // OTP expired
        if (now()->greaterThan($otpRecord->expires_at)) {

            $otp = rand(100000, 999999);

            $otpRecord->update([
                'otp' => $otp,
                'expires_at' => now()->addMinutes(10),
                'status' => 'pending',
            ]);

            $formattedLink = route('reset.password')
                . '?email=' . urlencode($request->email);

            Mail::to($request->email)->send(
                new StudentRegistrationOTP($otp, $formattedLink)
            );

            return response()->json([
                'status' => 'success',
                'message' => 'This OTP has expired. A new one has been sent.',
                'redirect' => $formattedLink,
                'email' => $request->email,
            ]);
        }

        // Invalid OTP
        if ((string) $otpRecord->otp !== (string) $request->otp) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid OTP. Please try again.',
            ]);
        }

        // OTP is valid
        $otpRecord->update([
            'status' => 'verified',
        ]);

        $student = Student::where('email', $request->email)->first();

        if (!$student) {
            return response()->json([
                'status' => 'error',
                'message' => 'No account found for this email.',
            ]);
        }

        $user = User::find($student->user_id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'No account found to reset.',
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'OTP verified. Set your new password.',
            'email' => $request->email,
        ]);
    }

    public function update_reset_password(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $student = Student::where('email', $request->email)->first();

        if (!$student) {
            return response()->json([
                'status' => 'error',
                'message' => 'No account found with that email.',
            ], 404);
        }

        $user = User::find($student->user_id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'No user account found.',
            ], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Password reset successfully.',
            'redirect' => route('login'),
        ]);
    }
    
}
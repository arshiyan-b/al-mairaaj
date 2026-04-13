<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Student;
use App\Models\StudentUserOtp;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TeacherDoc;
use App\Models\User;
use App\Mail\StudentRegistrationOTP;
use Carbon\Carbon;

class LoginController extends Controller
{
    // Show login form
    public function showLoginForm()
    {
        return view('login'); // Return the login view
    }

    public function teacher_register(Request $request)
    {
        $subjects = Subject::all();
        return view('register_as_a_teacher', compact('subjects'));
    }

    public function teacher_register_store(Request $request)
    {
        $request->validate([
            'teacher_name' => 'required|string|max:50',
            'teacher_cnic' => 'required|string|max:15',
            'teacher_gender' => 'required|in:male,female,other',
            'teacher_phone_no' => 'required|string|max:15',
            'teacher_whatsapp_no' => 'required|string|max:15',
            'teacher_email' => 'required|email|max:60',
            'teacher_city' => 'required|string|max:50',
            'teacher_address' => 'required|string|max:120',
            'highest_degree' => 'required|string|max:45',
            'field_of_study' => 'required|string|max:65',
            'university' => 'required|string|max:75',
            'experience' => 'required|in:Less than 1 year,1-2 years,3-5 years,6-10 years,More than 10 years',
            'preferred_board' => 'required|array',
            'preferred_board.*' => 'string|max:120',
            'subjects' => 'required|array',
            'subjects.*' => 'string|max:255',
            'grades' => 'required|array',
            'grades.*' => 'string|max:100',
            'agree' => 'required|in:Yes,yes',
        ]);

        $teacher = Teacher::create([
            'name' => $request->teacher_name,
            'cnic' => $request->teacher_cnic,
            'gender' => $request->teacher_gender,
            'phone_number' => $request->teacher_phone_no,
            'whatsapp_number' => $request->teacher_whatsapp_no,
            'email' => $request->teacher_email,
            'city' => $request->teacher_city,
            'address' => $request->teacher_address,
            'degree' => $request->highest_degree,
            'field_of_study' => $request->field_of_study,
            'university' => $request->university,
            'experience' => $request->experience,
            'preferred_board' => implode(',', $request->preferred_board ?? []),
            'subjects' => implode(',', $request->subjects ?? []),
            'grades' => implode(',', $request->grades ?? []),
            'agree' => $request->agree,
            'user_created' => 0,
        ]);

        if ($request->hasFile('resume')) {
            $path = $request->file('resume')->store('teacher_docs/resumes', 'public');
            TeacherDoc::create([
                'teacher_id' => $teacher->teacher_id,
                'type' => 'resume',
                'file_path' => $path,
            ]);
        }

        if ($request->hasFile('picture')) {
            $path = $request->file('picture')->store('teacher_docs/pictures', 'public');
            TeacherDoc::create([
                'teacher_id' => $teacher->teacher_id,
                'type' => 'picture',
                'file_path' => $path,
            ]);
        }

        return redirect('login.two')->with('success', 'Teacher registered successfully!');
    }

    public function register()
    {
        return view('student.register');
    }

    public function register_authenticate(Request $request)
    {

        $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'father_name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email',
            'phone' => ['required', 'regex:/^(92\d{10})$/',],
            'password' => ['required', 'confirmed', 'regex:/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/'],
        ], [
            'email.unique' => 'This email is already registered.',
            'phone.regex' => 'Phone number must start with 92 and be 12 digits long (e.g., 923001234567).',
            'password.confirmed' => 'Password confirmation does not match.',
            'password.regex' => 'Password must be at least 8 characters long and include: one uppercase letter, one lowercase letter, one number, and one special character.'
        ]);


        $otp = rand(100000, 999999);

        $student = Student::create([
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'last_name' => $request->last_name,
            'father_name' => $request->father_name,
            'email' => $request->email,
            'phone_number' => $request->phone,
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

        Mail::to($student->email)->send(new StudentRegistrationOTP($otp));

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
            return view('student.otp', compact('email'));
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
            ->first();

        if (!$otpRecord) {
            return response()->json([
                'status' => 'error',
                'message' => 'No OTP found for this email.',
            ]);
        }

        if ($otpRecord->status == 'pending') {

            if ($otpRecord->otp == $request->otp) {

                $otpRecord->update(['status' => 'verified']);
                $student = Student::where('email', $request->email)->first();
                User::create([
                    'name' => trim(collect([$student->first_name, $student->middle_name, $student->last_name])->filter()->join(' ')),
                    'email' => $student->email,
                    'password' => $otpRecord->password,
                    'role' => 'student',
                    'student_id' => $student->id,
                    'created_at' => now(),
                    'email_verified_at' => now(),
                ]);

                return response()->json([
                    'status' => 'success',
                    'message' => 'OTP verified successfully!',
                    'redirect' => route('login'),
                ]);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid OTP. Please try again.',
                ]);
            }
        } else if ($otpRecord->status == 'verified') {
            return response()->json([
                'status' => 'info',
                'message' => 'This OTP has already been verified.',
                'redirect' => route('login'),
            ]);
        }
    }
    public function login()
    {
        return view('student.login');
    }

    public function authenticate(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            $request->session()->regenerate();

            $user = Auth::user();

            if ($user->role === 'student') {
                return response()->json([
                    'status' => 'success',
                    'redirect' => route('student.dashboard'),
                ]);
            } elseif ($user->role === 'admin') {
                return response()->json([
                    'status' => 'success',
                    'redirect' => route('admin.dashboard'),
                ]);
            } elseif ($user->role === 'teacher') {
                return response()->json([
                    'status' => 'success',
                    'redirect' => route('teacher.dashboard'),
                ]);
            }

            Auth::logout();
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized role.',
            ], 403);
        }

        // Always JSON, no redirects here
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
}

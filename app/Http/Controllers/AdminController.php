<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use App\Models\AllowedClass;
use App\Models\CurriculumSubject;
use App\Models\Role;
use App\Models\User;
use App\Models\Teacher;
use App\Models\TeacherApplication;
use App\Models\TeacherDoc;
use App\Models\Student;
use App\Models\Grade;
use App\Models\Subject;
use App\Models\PearsonCourse;

class AdminController extends Controller
{
    protected $grades;
    protected $subjects;
    public function __construct()
    {
        $this->middleware(function ($request, $next) {

            $this->grades = Grade::with('board')->get();
            $this->subjects = Subject::all();

            return $next($request);
        });
    }
    private function token(): string
    {
        return Cache::remember('google_access_token', 3500, function () {
            $creds = config('services.google');

            $response = Http::asForm()
                ->withOptions(['curl' => [CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4]])
                ->post('https://oauth2.googleapis.com/token', [
                    'client_id' => $creds['client_id'],
                    'client_secret' => $creds['client_secret'],
                    'refresh_token' => $creds['refresh_token'],
                    'grant_type' => 'refresh_token',
                ]);

            $response->throw();

            return $response->json()['access_token'];
        });
    }

    public function dashboard()
    {
        $studentCount = Student::all()->count();
        $teacherCount = Teacher::all()->count();
        $pearson_courses = PearsonCourse::all()->count();

        return view('admin.dashboard', compact(
            'studentCount',
            'teacherCount',
            'pearson_courses'
        ));
    }

    public function student()
    {
        $studentList = Student::all();

        return view('admin.student', compact('studentList'));
    }

    public function teacher_applications()
    {
        $teacherApplications = TeacherApplication::all();
        return view('admin.teacher.application.index', compact('teacherApplications'));
    }
    public function teacher_application_show($id)
    {
        $application = TeacherApplication::find($id);
        $docs = TeacherDoc::where('application_id', $id)->get();
        return view('admin.teacher.application.show', compact('application', 'docs'));
    }
    public function teacher_application_update_status(Request $request, $id)
    {
        $application = TeacherApplication::find($id);
        $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $application->update([
            'status' => $request->status,
        ]);

        if ($request->status === 'approved') {

            $teacher = Teacher::where('application_id', $application->id)->first();

            if (!$teacher) {
                $teacher = Teacher::create([
                    'application_id' => $application->id,
                    'name' => $application->name,
                ]);
            } else {
                $teacher->update([
                    'status' => 'active',
                ]);
            }
            
        }

        return redirect()
            ->back()
            ->with('success', 'Teacher status updated successfully.');
    }
    public function teacher()
    {
        $teachers = Teacher::all();
        return view('admin.teacher.index', compact('teachers'));
    }
    public function teacher_show($id)
    {
        $teacher = Teacher::find($id);
        $docs = TeacherDoc::where('application_id', $teacher->application->id)->get();
        $classes = AllowedClass::where('teacher_id', $id)->get();
        $curriculumSubjects = CurriculumSubject::all()->keyBy('id');

        return view('admin.teacher.details', [
            'teacher' => $teacher,
            'docs' => $docs,
            'classes' => $classes,
            'grades' => $this->grades,
            'subjects' => $this->subjects,
            'curriculumSubjects' => $curriculumSubjects,
        ]);
    }

    public function teacher_update(Request $request, Teacher $teacher)
    {
        $application = $teacher->application;

        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'cnic' => 'required|string|max:15|unique:teacher_applications,cnic,' . $application->id,
            'gender' => 'required|in:male,female,other',
            'phone_number' => 'required|string|max:15',
            'whatsapp_number' => 'required|string|max:15',
            'email' => 'required|email|max:60|unique:teacher_applications,email,' . $application->id,
            'city' => 'required|string|max:50',
            'address' => 'required|string|max:120',
            'highest_degree' => 'required|string|max:45',
            'field_of_study' => 'required|string|max:65',
            'university' => 'required|string|max:75',
            'experience' => 'required|string|max:45',
            'resume' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'picture' => 'nullable|image|max:3072',
        ], [
            'cnic.unique' => 'That CNIC is already registered with another application.',
            'email.unique' => 'That email is already registered with another application.',
            'resume.max' => 'Resume must be under 5MB.',
            'picture.max' => 'Picture must be under 3MB.',
        ]);

        $application->update([
            'name' => $validated['name'],
            'cnic' => $validated['cnic'],
            'gender' => $validated['gender'],
            'phone_number' => $validated['phone_number'],
            'whatsapp_number' => $validated['whatsapp_number'],
            'email' => $validated['email'],
            'city' => $validated['city'],
            'address' => $validated['address'],
            'highest_degree' => $validated['highest_degree'],
            'field_of_study' => $validated['field_of_study'],
            'university' => $validated['university'],
            'experience' => $validated['experience'],
        ]);

        // The Teacher record keeps its own copy of the name, so update both.
        $teacher->update(['name' => $validated['name']]);

        if ($request->hasFile('resume')) {
            $this->replaceTeacherDoc($application, 'resume', $request->file('resume'), 'teacher_docs/resumes');
        }

        if ($request->hasFile('picture')) {
            $this->replaceTeacherDoc($application, 'picture', $request->file('picture'), 'teacher_docs/pictures');
        }

        return redirect()
            ->route('admin.teachers.show', $teacher->id)
            ->with('success', 'Teacher details updated successfully.');
    }

    private function replaceTeacherDoc(TeacherApplication $application, string $type, $file, string $directory): void
    {
        $existing = $application->teacherDocs()->where('type', $type)->first();

        if ($existing) {
            Storage::disk('public')->delete($existing->file_path);
            $existing->delete();
        }

        $path = $file->store($directory, 'public');

        TeacherDoc::create([
            'application_id' => $application->id,
            'type' => $type,
            'file_path' => $path,
        ]);
    }

    public function teacher_assign_subjects(Request $request, Teacher $teacher)
    {
        $request->validate([
            'teacherGrades' => 'required|exists:grades,id',

            'teacherSubjects' => 'required|array|min:1',
            'teacherSubjects.*' => 'exists:curriculum_subjects,id',
        ]);

        $teacher = Teacher::findOrFail($request->teacher_id);

        $grade = Grade::with('board')->findOrFail($request->teacherGrades);

        $subjectIds = collect($request->teacherSubjects)
            ->unique()
            ->values()
            ->toArray();

        // Check if a row already exists for this teacher + grade
        $allowedClass = AllowedClass::where('teacher_id', $teacher->id)
            ->where('grade_id', $grade->id)
            ->first();

        if ($allowedClass) {

            // Merge subject ids into the existing row
            $existingSubjectIds = collect($allowedClass->curriculum_subject_ids ?? []);

            $allowedClass->update([
                'curriculum_subject_ids' => $existingSubjectIds
                    ->merge($subjectIds)
                    ->unique()
                    ->values()
                    ->toArray(),
            ]);

        } else {

            // Create a new row for this grade
            AllowedClass::create([
                'teacher_id'              => $teacher->id,
                'grade_id'                => $grade->id,
                'curriculum_subject_ids'  => $subjectIds,
            ]);
        }

        return back()->with('success', 'Classes assigned successfully.');
    }
    public function teacher_class_destroy($id)
    {
        $class = AllowedClass::find($id);
        $class->delete();

        return redirect()->back()->with('success', 'Class deleted successfully.');
    }

    public function teacher_create_user(Request $request, $id)
    {
        $teacher = Teacher::findOrFail($id);
        $teacherRole = Role::where('slug', 'teacher')->firstOrFail();

        $user = new User();
        $user->name = $teacher->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role_id = $teacherRole->id;
        $user->save();

        $teacher->user_created = true;
        $teacher->user_id = $user->id;
        $teacher->save();

        return redirect()->back()->with('success', 'User created successfully!');
    }
    public function teacher_reset_passport(Request $request, $id)
    {
        $request->validate([
            'password' => [
                'required','string','min:8','confirmed',
            ],
        ]);

        $teacher = Teacher::findOrFail($id);

        $user = $teacher->user;

        if (!$user) {
            return redirect()
                ->back()
                ->with('error', 'No user account is associated with this teacher.');
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return redirect()
            ->back()
            ->with('success', 'Teacher password reset successfully.');
    }
    public function teacher_user(Request $request)
    {
        $validated = $request->validate([
            'teacherEmail' => 'required|string|max:255',
            'teacherPassword' => 'required|string|max:15',
            'teacher_id' => 'required|exists:teachers,teacher_id',
        ]);

        $teacher = Teacher::findOrFail($request->teacher_id);

        $teacher->user_created = true;

        $teacher->save();

        $user = new User();
        $user->name = $teacher->teacher_name;
        $user->email = $validated['teacherEmail'];
        $user->password = Hash::make($validated['teacherPassword']);
        $user->role = 'teacher';
        $user->teacher_id = $teacher->teacher_id;

        $user->save();

        return redirect()->back()->with('success', 'Teacher added successfully!');
    }

     public function books_index($board)
    {

        dd($board);
        return view('admin.books.index', compact('board'));
    }

    public function course_index($board, $grade)
    {

        dd($board, $grade);
        return view('admin.courses.index', compact('board', 'grade'));
    }

    public function demo()
    {
        $videoId = 123;
        return view('admin.demo', compact('videoId'));
    }

    public function trackWatchTime(Request $request)
    {
        $data = $request->validate([
            'video_id' => 'required|string',
            'user_id' => 'required|integer|exists:users,id',
            'watch_time' => 'required|numeric|min:0|max:15',
            'is_completed' => 'sometimes|boolean'
        ]);

        // For now, just dump the data - you'll want to store this in your database
        dd($data);

        // Later implementation might look like:
        // VideoView::create($data);
        // return response()->json(['success' => true]);
    }
}
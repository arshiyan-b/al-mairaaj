<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use App\Models\AllowedClass;
use App\Models\Batch;
use App\Models\CurriculumSubject;
use App\Models\Role;
use App\Models\User;
use App\Models\Teacher;
use App\Models\TeacherDoc;
use App\Models\Student;
use App\Models\Board;
use App\Models\Grade;
use App\Models\Subject;
use App\Models\Book;
use App\Models\PearsonCourse;
use App\Models\PearsonIgcseVideo;
use App\Models\CaieCourse;
use App\Models\CaieOlevelVideo;

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

    public function teacher()
    {
        $teacherList = Teacher::all();
        return view('admin.teacher.index', [
            'teacherList' => $teacherList,
            'subjects' => $this->subjects,
        ]);
    }

    public function teacher_show($id)
    {
        $teacher = Teacher::where('id', $id)->first();
        $docs = TeacherDoc::where('teacher_id', $id)->get();
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

        $boardSlug = $grade->board->slug;
        $gradeSlug = $grade->slug;

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
                'board'                   => $boardSlug,
                'grade'                   => $gradeSlug,
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

        $user = new User();
        $user->name = $teacher->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role = 'teacher';
        $user->save();

        $teacher->user_created = true;
        $teacher->user_id = $user->id;
        $teacher->save();

        return redirect()->back()->with('success', 'User created successfully!');
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

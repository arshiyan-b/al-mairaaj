<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use App\Models\AllowedClass;
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
    protected $boards;
    protected $grades;
    protected $subjects;
    public function __construct()
    {
        $this->middleware(function ($request, $next) {

            $this->boards = Board::all();
            $this->grades = Grade::all();
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
        return view('admin.teacher', [
            'teacherList' => $teacherList,
            'subjects' => $this->subjects,
        ]);
    }

    public function teacher_show($id)
    {
        $teacher = Teacher::where('id', $id)->first();
        $docs = TeacherDoc::where('teacher_id', $id)->get();
        $classes = AllowedClass::where('teacher_id', $id)->get();

        return view('admin.teacher_details', [
            'teacher' => $teacher,
            'docs' => $docs,
            'classes' => $classes,
            'boards' => $this->boards,
            'grades' => $this->grades,
            'subjects' => $this->subjects,
        ]);
    }

    public function teacher_assign_subjects(Request $request, $id)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'teacherBoards' => 'required|string',
            'teacherGrades' => 'required|array|min:1',
            'teacherSubjects' => 'required|array|min:1',
        ]);
        AllowedClass::create([
            'teacher_id' => $validated['teacher_id'],
            'board' => $validated['teacherBoards'],
            'grades' => $validated['teacherGrades'],
            'subjects' => $validated['teacherSubjects'],
        ]);
        return redirect()->back()->with('success', 'Subjects and grades assigned successfully.');
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

        $teacher_role = Role::where('name', 'teacher')->value('id');

        $user = new User();
        $user->name = $teacher->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role_id = $teacher_role;
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

    public function pearson_books()
    {
        $subjects = $this->subjects;
        $books = Book::where('board', 'pearson')->get();
        $board = 'pearson';
        return view('admin.study_material.books', compact('subjects', 'books', 'board'));
    }


    public function pearson_books_store(Request $request)
    {
        $request->validate([
            'pdfUpload' => 'required|file|mimes:pdf|max:10240',
            'subject' => 'required|string',
            'qualification' => 'required|string',
            'category' => 'required|string',
        ]);

        if (!$request->hasFile('pdfUpload')) {
            return back()->with('error', 'No file uploaded.');
        }

        $access_token = $this->token(); // already working
        $folder_id = config('services.google.folder_id');
        $file = $request->file('pdfUpload');

        $file_name = $file->getClientOriginalName();
        $mime_type = $file->getMimeType();
        $file_path = $file->getRealPath();

        $boundary = Str::random(32);
        $eol = "\r\n";

        // Metadata for the file, including the folder ID
        $metadata = json_encode([
            'name' => $file_name,
            'parents' => [$folder_id],
        ]);

        // Multipart body with metadata + file content
        $body =
            "--{$boundary}{$eol}" .
            "Content-Type: application/json; charset=UTF-8{$eol}{$eol}" .
            $metadata . $eol .
            "--{$boundary}{$eol}" .
            "Content-Type: {$mime_type}{$eol}{$eol}" .
            file_get_contents($file_path) . $eol .
            "--{$boundary}--";

        // Send the POST request to Drive
        $response = Http::withToken($access_token)
            ->withHeaders([
                'Content-Type' => "multipart/related; boundary={$boundary}",
            ])
            ->withBody($body, "multipart/related; boundary={$boundary}")
            ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

        if ($response->failed()) {
            return back()->with('error', 'Google Drive upload failed: ' . $response->body());
        }

        $driveFile = $response->json();

        Book::create([
            'drive_id' => $driveFile['id'],
            'book_name' => $file_name,
            'category' => $request->input('category'),
            'board' => $request->input('board'),
            'grade' => $request->input('qualification'),
            'subject_id' => $request->input('subject'),
        ]);

        return back()->with('success', "File uploaded to Google Drive! File ID: {$driveFile['id']}");
    }

    public function pearson_igcse_courses(Request $request)
    {
        $teacherList = Teacher::all();
        $courses = PearsonCourse::where('course_qualification', 'igcse')->get();

        return view('admin.courses.pearson_igcse', [
            'teacherList' => $teacherList,
            'courses' => $courses,
            'subjects' => $this->subjects,
        ]);
    }
    public function pearson_courses_store(Request $request)
    {

        $validated = $request->validate([
            'courseSubject' => 'required',
            'coursePaper' => 'required',
            'courseTeacher' => 'required',
            'courseTitle' => 'required',
            'courseDescription' => 'required',
            'courseQualification' => 'required',
        ]);

        PearsonCourse::create([
            'course_subject' => $validated['courseSubject'],
            'course_paper' => $validated['coursePaper'],
            'course_teacher_id' => $validated['courseTeacher'],
            'course_title' => $validated['courseTitle'],
            'course_description' => $validated['courseDescription'],
            'course_qualification' => $validated['courseQualification'],
        ]);

        return redirect()->back()->with('success', 'Course has been uploaded Successfully!');
    }
    public function pearson_courses_show($id)
    {
        $course = PearsonCourse::where('course_id', $id)->get()->first();

        $highestOrder = PearsonIgcseVideo::where('video_course_id', $course->course_id)->max('video_order');

        if ($course->course_qualification == 'igcse') {
            $videos = PearsonIgcseVideo::where('video_course_id', $course->course_id)->orderBy('video_order', 'asc')->get();
        }

        return view('admin.courses.pearson_details', compact('course', 'videos', 'highestOrder'));
    }

    public function pearson_igcse_video_store(Request $request)
    {
        $validated = $request->validate([
            'videoTitle' => 'required',
            'videoDescription' => 'required',
            'videoLink' => 'required',
            'videoLanguage' => 'required',
            'videoOrder' => 'required',
            'videoPrice' => 'required',
            'videoDuration' => 'required',
            'videoSubject' => 'required',
            'videoCourseID' => 'required',
        ]);

        PearsonIgcseVideo::create([
            'video_title' => $validated['videoTitle'],
            'video_description' => $validated['videoDescription'],
            'video_link' => $validated['videoLink'],
            'video_lang' => $validated['videoLanguage'],
            'video_order' => $validated['videoOrder'],
            'video_price' => $validated['videoPrice'],
            'video_duration' => $validated['videoDuration'],
            'video_subject' => $validated['videoSubject'],
            'video_course_id' => $validated['videoCourseID'],
        ]);

        return redirect()->back()->with('success', 'Video has been uploaded Successfully!');
    }
    public function caie_olevel_courses(Request $request)
    {
        $teacherList = Teacher::all();
        $courses = CaieCourse::where('course_qualification', 'olevel')->get();

        return view('admin.courses.caie_olevel', [
            'teacherList' => $teacherList,
            'courses' => $courses,
            'subjects' => $this->subjects,
        ]);
    }
    public function caie_courses_store(Request $request)
    {
        $validated = $request->validate([
            'courseSubject' => 'required',
            'coursePaper' => 'required',
            'courseTeacher' => 'required',
            'courseTitle' => 'required',
            'courseDescription' => 'required',
            'courseQualification' => 'required',
        ]);

        CaieCourse::create([
            'course_subject' => $validated['courseSubject'],
            'course_paper' => $validated['coursePaper'],
            'course_teacher_id' => $validated['courseTeacher'],
            'course_title' => $validated['courseTitle'],
            'course_description' => $validated['courseDescription'],
            'course_qualification' => $validated['courseQualification'],
        ]);

        return redirect()->back()->with('success', 'Course has been uploaded Created!');
    }

    public function caie_courses_show($id)
    {
        $course = CaieCourse::where('course_id', $id)->get()->first();

        $highestOrder = CaieOlevelVideo::where('video_course_id', $course->course_id)->max('video_order');

        if ($course->course_qualification == 'olevel') {
            $videos = CaieOlevelVideo::where('video_course_id', $course->course_id)->orderBy('video_order', 'asc')->get();
        }
        return view('admin.courses.caie_details', compact('course', 'videos', 'highestOrder'));
    }
    public function caie_olevel_video_store(Request $request)
    {
        $validated = $request->validate([
            'videoTitle' => 'required',
            'videoDescription' => 'required',
            'videoLink' => 'required',
            'videoLanguage' => 'required',
            'videoOrder' => 'required',
            'videoPrice' => 'required',
            'videoDuration' => 'required',
            'videoSubject' => 'required',
            'videoCourseID' => 'required',
        ]);

        CaieOlevelVideo::create([
            'video_title' => $validated['videoTitle'],
            'video_description' => $validated['videoDescription'],
            'video_link' => $validated['videoLink'],
            'video_lang' => $validated['videoLanguage'],
            'video_order' => $validated['videoOrder'],
            'video_price' => $validated['videoPrice'],
            'video_duration' => $validated['videoDuration'],
            'video_subject' => $validated['videoSubject'],
            'video_course_id' => $validated['videoCourseID'],
        ]);

        return redirect()->back()->with('success', 'Video has been uploaded Successfully!');
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

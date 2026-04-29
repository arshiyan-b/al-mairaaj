<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\AllowedClass;
use App\Models\CaieCourse;
use App\Models\PearsonCourse;
use App\Models\CaieOlevelVideo;
use App\Models\PearsonIgcseVideo;
use App\Models\CaieMcq;
use Illuminate\Http\Request;
use Vimeo\Vimeo;

class TeacherController extends Controller
{
    protected $teacher;
    protected $classes;
    protected $subjects;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {

            $this->teacher = Teacher::where('user_id', Auth::user()->id)->first();
            $this->classes = AllowedClass::where('teacher_id', $this->teacher->id)->get();
            $this->subjects = Subject::all()->keyBy('subject_id');

            return $next($request);
        });
    }
    protected function getSubjectsForBoardAndGrade($board, $grade)
    {

        $classes = $this->classes->filter(function ($class) use ($board, $grade) {

            $classBoard = $class->board;

            $grades = $class->grades ?? [];

            return $classBoard === $board &&
                in_array($grade, $grades);
        });
        $subjectIds = $classes->pluck('subjects')->flatten()->unique();

        return $subjectIds
            ->map(fn($id) => $this->subjects->get($id))
            ->filter()
            ->values();
    }

    protected function getHighestOrder($board, $grade, $id)
    {
        return match ([$board, $grade]) {
            ['caie', 'olevel'] => CaieOlevelVideo::where('video_course_id', $id)->max('video_order'),
            ['pearson', 'igcse'] => PearsonIgcseVideo::where('video_course_id', $id)->max('video_order'),
            default => 0,
        };
    }

    public function dashboard()
    {
        return view('teacher.dashboard', [
            'teacher' => $this->teacher,
            'classes' => $this->classes,
        ]);
    }

    public function course_index($board, $grade)
    {
        $subjects = $this->getSubjectsForBoardAndGrade($board, $grade);

        if ($board == "caie") {
            $courses = CaieCourse::where('course_teacher_id', $this->teacher->id)->where('course_qualification', $grade)->get();
        } elseif ($board == "pearson") {
            $courses = PearsonCourse::where('course_teacher_id', $this->teacher->id)->where('course_qualification', $grade)->get();
        }

        return view('teacher.courses.index', [
            'teacher' => $this->teacher,
            'subjects' => $subjects,
            'courses' => $courses,
            'board' => $board,
            'grade' => $grade,
        ]);
    }
    public function course_videos($board, $grade, $id)
    {
        if ($board === "caie") {
            if ($grade === "olevel") {
                $videos = CaieOlevelVideo::where('video_course_id', $id)->get();
                $course = CaieCourse::where('course_id', $id)->first();
                $highestOrder = $this->getHighestOrder('caie', 'olevel', $id);

                return view('teacher.courses.course_videos', compact('videos', 'course', 'highestOrder', 'board'));
            }
        } elseif ($board === "pearson") {
            if ($grade === "igcse") {
                $videos = PearsonIgcseVideo::where('video_course_id', $id)->get();
                $course = PearsonCourse::where('course_id', $id)->first();
                $highestOrder = $this->getHighestOrder('pearson', 'igcse', $id);

                return view('teacher.courses.course_videos', compact('videos', 'course', 'highestOrder', 'board'));
            }
        }
    }
    public function video_store(Request $request, $board, $grade, $id)
    {

        $data = $request->all();

        $vimeo = new \Vimeo\Vimeo(
            env('VIMEO_CLIENT_ID'),
            env('VIMEO_CLIENT_SECRET'),
            env('VIMEO_ACCESS_TOKEN')
        );


        try {
            if (!$request->hasFile('videoFile')) {
                return back()->with('error', 'No video file uploaded.');
            }

            $uploadedFile = $request->file('videoFile');
            if (!$uploadedFile->isValid()) {
                return back()->with('error', 'Uploaded file is not valid.');
            }

            $filePath = $uploadedFile->getPathname();

            $uri = $vimeo->upload($filePath, [
                'name' => $data['videoTitle'],
                'description' => $data['videoDescription'],
            ]);

            // Request details from Vimeo
            $details = $vimeo->request($uri, [], 'GET');

            // Get the embed HTML
            $embedHtml = $details['body']['embed']['html'] ?? null;
            if (!$embedHtml) {
                return back()->with('error', 'Could not retrieve embed HTML.');
            }

            // Extract video URL from embed HTML
            preg_match('/src="([^"]+)"/', $embedHtml, $matches);
            if (!isset($matches[1])) {
                return back()->with('error', 'Could not extract video link.');
            }

            $fullUrl = html_entity_decode($matches[1]);  // Decode &amp; to &

            preg_match('/video\/(\d+)/', $fullUrl, $idMatch);
            if (!isset($idMatch[1])) {
                return back()->with('error', 'Could not extract video ID.');
            }

            $videoId = $idMatch[1];

        } catch (\Exception $e) {
            return back()->with('error', 'Vimeo upload failed: ' . $e->getMessage());
        }


        $modelMap = [
            'caie.olevel' => CaieOlevelVideo::class,
            'pearson.igcse' => PearsonIgcseVideo::class,
        ];

        $key = strtolower($board) . '.' . strtolower($grade);

        if (!isset($modelMap[$key])) {
            return back()->with('error', 'Invalid board/grade combination.');
        }

        $modelClass = $modelMap[$key];

        $video = new $modelClass([
            'video_order' => $data['videoOrder'],
            'video_title' => $data['videoTitle'],
            'video_subject' => $data['videoSubject'],
            'video_description' => $data['videoDescription'],
            'video_price' => 2,
            'video_lang' => $data['videoLanguage'],
            'video_duration' => $data['videoDuration'],
            'video_link' => $videoId,
            'video_course_id' => $id,
        ]);

        $video->save();

        return redirect()->back()->with('success', 'Video uploaded and saved successfully.');
    }


    public function course_store(Request $request)
    {
        if ($request->courseBoard === "caie") {

            $validated = $request->validate([
                'courseSubject' => 'required',
                'coursePaper' => 'required',
                'courseTitle' => 'required',
                'courseDescription' => 'required',
                'courseQualification' => 'required',
            ]);

            CaieCourse::create([
                'course_subject' => $validated['courseSubject'],
                'course_paper' => $validated['coursePaper'],
                'course_teacher_id' => $this->teacher->teacher_id,
                'course_title' => $validated['courseTitle'],
                'course_description' => $validated['courseDescription'],
                'course_qualification' => $validated['courseQualification'],
            ]);
        } elseif ($request->courseBoard === "pearson") {
            $validated = $request->validate([
                'courseSubject' => 'required',
                'coursePaper' => 'required',
                'courseTitle' => 'required',
                'courseDescription' => 'required',
                'courseQualification' => 'required',
            ]);

            PearsonCourse::create([
                'course_subject' => $validated['courseSubject'],
                'course_paper' => $validated['coursePaper'],
                'course_teacher_id' => $this->teacher->teacher_id,
                'course_title' => $validated['courseTitle'],
                'course_description' => $validated['courseDescription'],
                'course_qualification' => $validated['courseQualification'],
            ]);
        }
        return redirect()->back()->with('success', 'Course has been uploaded Created!');
    }

    public function mcq_store(Request $request)
    {
        if ($request->board === 'caie') {
            $mcq = CaieMcq::create([
                'video_id' => $request->video_id,
                'question' => $request->question,
                'option_a' => $request->option_a,
                'option_b' => $request->option_b,
                'option_c' => $request->option_c,
                'option_d' => $request->option_d,
                'correct_option' => $request->correct_option,
            ]);

            CaieOlevelVideo::where('video_id', $request->video_id)->update([
                'mcq_id' => $mcq->mcq_id,
                'minutes' => $request->minutes,
                'seconds' => $request->seconds,
            ]);
        }

        return back()->with('success', 'MCQ uploaded successfully!');
    }
}

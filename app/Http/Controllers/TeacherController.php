<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

use App\Models\Board;
use App\Models\Qualification;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\AllowedClass;
use App\Models\AkuebCourse;
use App\Models\CaieCourse;
use App\Models\PearsonCourse;
use App\Models\CaieOlevelVideo;
use App\Models\PearsonIgcseVideo;
use App\Models\CaieMcq;

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
            $this->subjects = Subject::all()->keyBy('id');

            return $next($request);
        });
    }
    protected function getSubjectsForBoardAndGrade($board, $qualification)
    {

        $classes = $this->classes->filter(function ($class) use ($board, $qualification) {
            $classBoard = $class->board;
            $qualifications = $class->qualifications ?? [];
            return $classBoard === $board &&
                in_array($qualification, $qualifications);
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
            ['caie', 'olevel'] => CaieOlevelVideo::where('video_id', $id)->max('video_order'),
            ['pearson', 'igcse'] => PearsonIgcseVideo::where('video_id', $id)->max('video_order'),
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
    public function course_index($board, $qualification)
    {
        $subjects = $this->getSubjectsForBoardAndGrade($board, $qualification);
        $board = Board::where('key', $board)->first();
        $qualification = Qualification::where('key', $qualification)->first();

        if ($board->key == "caie") {
            $courses = CaieCourse::where('teacher_id', $this->teacher->id)->where('qualification_id', $qualification->id)->get();
        } elseif ($board->key == "pearson") {
            $courses = PearsonCourse::where('teacher_id', $this->teacher->id)->where('qualification_id', $qualification->id)->get();
        } elseif ($board->key == "akueb") {
            $courses = AkuebCourse::where('teacher_id', $this->teacher->id)->where('qualification_id', $qualification->id)->get();
        }
        $courses = $courses->load('subject')
            ->groupBy(fn($course) => $course->subject->name);

        return view('teacher.courses.index', [
            'teacher' => $this->teacher,
            'subjects' => $subjects,
            'courses' => $courses,
            'board' => $board,
            'qualification' => $qualification,
        ]);
    }
    public function course_store(Request $request)
    {
        $board = Board::find($request->board);
        if ($board->key === "caie") {
            CaieCourse::create([
                'title' => $request->title,
                'description' => $request->description,
                'subject_id' => $request->subject,
                'paper' => $request->paper,
                'qualification_id' => $request->qualification,
                'teacher_id' => $this->teacher->id,
            ]);
        } elseif ($board->key === "pearson") {
            PearsonCourse::create([
                'title' => $request->title,
                'description' => $request->description,
                'subject_id' => $request->subject,
                'paper' => $request->paper,
                'qualification_id' => $request->qualification,
                'teacher_id' => $this->teacher->id,
            ]);
        } elseif ($board->key === "akueb") {
            AkuebCourse::create([
                'title' => $request->title,
                'description' => $request->description,
                'subject_id' => $request->subject,
                'paper' => $request->paper,
                'qualification_id' => $request->qualification,
                'teacher_id' => $this->teacher->id,
            ]);
        }
        return redirect()->back()->with('success', 'Course has been uploaded Created!');
    }
    public function course_show($board, $qualification, $course)
    {
        if ($board == "caie") {
            $course = CaieCourse::find($course);
            if ($qualification == "olevel") {
                $videos = CaieOlevelVideo::where('course_id', $course->id)->get();
            } elseif ($qualification == "alevel") {
                $videos = CaieAlevelVideo::where('course_id', $course->id)->get();
            }
        } elseif ($board == "pearson") {
            $course = PearsonCourse::find($course);
            if ($qualification == "igcse") {
                $videos = PearsonIgcseVideo::where('course_id', $course->id)->get();
            } elseif ($qualification == "alevel") {
                $videos = PearsonAlevelVideo::where('course_id', $course->id)->get();
            }
        } elseif ($board == "akueb") {
            $course = AkuebCourse::find($course);
            if ($qualification == "ssc1") {
                $videos = AkuebSsc1Video::where('course_id', $course->id)->get();
            } elseif ($qualification == "ssc2") {
                $videos = AkuebSsc2Video::where('course_id', $course->id)->get();
            }
        }
        $qualification = Qualification::where('key', $qualification)->first();
        $board = Board::where('key', $board)->first();
        return view('teacher.courses.show', compact('board', 'qualification', 'course', 'videos'));
    }

    public function course_video_store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'file' => 'required|file|mimes:mp4,mov,avi,webm|max:51200',
            'course_id' => 'required',
            'qualification_id' => 'required',
            'board_id' => 'required',
            'subject_id' => 'required',
        ]);

        $qualification = Qualification::find($request->qualification_id);
        $board = Board::find($request->board_id);

        if ($board->key == "caie") {
            $course = CaieCourse::find($request->course_id);
            if ($qualification->key == "olevel") {
                $videoModel = CaieOlevelVideo::class;
                $videos = CaieOlevelVideo::where('course_id', $request->course_id)->get();
            } elseif ($qualification == "alevel") {
                $videoModel = CaieAlevelVideo::class;
                $videos = CaieAlevelVideo::where('course_id', $request->course_id)->get();
            }
        } elseif ($board == "pearson") {
            $course = PearsonCourse::find($request->course_id);
            if ($qualification == "igcse") {
                $videoModel = PearsonIgcseVideo::class;
                $videos = PearsonIgcseVideo::where('course_id', $request->course_id)->get();
            } elseif ($qualification == "alevel") {
                $videoModel = PearsonAlevelVideo::class;
                $videos = PearsonAlevelVideo::where('course_id', $request->course_id)->get();
            }
        } elseif ($board == "akueb") {
            $course = AkuebCourse::find($request->course_id);
            if ($qualification == "ssc1") {
                $videoModel = AkuebSsc1Video::class;
                $videos = AkuebSsc1Video::where('course_id', $request->course_id)->get();
            } elseif ($qualification == "ssc2") {
                $videoModel = AkuebSsc2Video::class;
                $videos = AkuebSsc2Video::where('course_id', $request->course_id)->get();
            }
        }
        $subject = Subject::find($course->subject->id);

        $file = $request->file('file');
        $filename = Str::slug($request->title, '_');
        $extension = $file->getClientOriginalExtension();
        $finalName = $filename . '.' . $extension;
        $path = $file->storeAs($board->key . '/' . $qualification->key . '/' . $subject->key, $finalName, 'private');

        $videoModel::create([
            'title' => $request->title,
            'description' => $request->description,
            'course_id' => $course->id,
            'order' => 1,
            'subject_id' => $request->subject_id,
            'language' => 'urdu',
        ]);

        return back()->with('success', 'Video uploaded successfully!');
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

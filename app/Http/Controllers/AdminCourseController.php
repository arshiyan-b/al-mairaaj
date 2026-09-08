<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseVideo;
use App\Models\CourseVideoQuestion;
use App\Models\Grade;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminCourseController extends Controller
{
    public function index()
    {
        $courses = Course::with(['grade.board', 'subject', 'teacher'])
            ->withCount('videos')
            ->latest()
            ->get();

        $grades = Grade::with('board')->orderBy('name')->get();
        $subjects = Subject::orderBy('name')->get();
        $teachers = Teacher::orderBy('name')->get();

        return view('admin.courses.index', compact('courses', 'grades', 'subjects', 'teachers'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'grade_id' => 'required|integer|exists:grades,id',
            'subject_id' => 'required|integer|exists:subjects,id',
            'teacher_id' => 'nullable|integer|exists:teachers,id',
            'title' => 'required|string|max:255',
            'paper' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|image|max:2048',
            'per_minute_cost' => 'required|numeric|min:0',
            'status' => 'required|in:draft,published,archived',
        ]);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('course_thumbnails', 'public');
        }

        Course::create($validated);

        return redirect()
            ->route('admin.courses.index')
            ->with('success', 'Course created successfully.');
    }

    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'grade_id' => 'required|integer|exists:grades,id',
            'subject_id' => 'required|integer|exists:subjects,id',
            'teacher_id' => 'nullable|integer|exists:teachers,id',
            'title' => 'required|string|max:255',
            'paper' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|image|max:2048',
            'per_minute_cost' => 'required|numeric|min:0',
            'status' => 'required|in:draft,published,archived',
        ]);

        if ($request->hasFile('thumbnail')) {
            if ($course->thumbnail) {
                Storage::disk('public')->delete($course->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')->store('course_thumbnails', 'public');
        }

        $course->update($validated);

        return redirect()
            ->route('admin.courses.index')
            ->with('success', 'Course updated successfully.');
    }

    public function destroy(Course $course)
    {
        if ($course->thumbnail) {
            Storage::disk('public')->delete($course->thumbnail);
        }

        // course_videos and course_video_questions cascade-delete at the
        // database level.
        $course->delete();

        return redirect()
            ->route('admin.courses.index')
            ->with('success', 'Course deleted successfully.');
    }

    public function show(Course $course)
    {
        $course->load(['grade.board', 'subject', 'teacher', 'videos']);

        return view('admin.courses.show', compact('course'));
    }

    public function storeVideo(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'video_provider' => 'required|in:vimeo,youtube,upload',
            'video_id' => 'required_unless:video_provider,upload|nullable|string|max:255',
            'video_file' => 'required_if:video_provider,upload|nullable|file|mimetypes:video/mp4,video/quicktime|max:512000',
            'duration_seconds' => 'nullable|integer|min:0',
            'sort_order' => 'nullable|integer|min:0',
            'status' => 'required|in:draft,published',
        ]);

        if ($validated['video_provider'] === 'upload' && $request->hasFile('video_file')) {
            $validated['video_id'] = $request->file('video_file')->store('course_videos', 'public');
        }

        unset($validated['video_file']);

        $course->videos()->create($validated);

        return redirect()
            ->route('admin.courses.show', $course)
            ->with('success', 'Video added successfully.');
    }

    public function updateVideo(Request $request, CourseVideo $video)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'video_provider' => 'required|in:vimeo,youtube,upload',
            'video_id' => 'required_unless:video_provider,upload|nullable|string|max:255',
            'video_file' => 'nullable|file|mimetypes:video/mp4,video/quicktime|max:512000',
            'duration_seconds' => 'nullable|integer|min:0',
            'sort_order' => 'nullable|integer|min:0',
            'status' => 'required|in:draft,published',
        ]);

        if ($validated['video_provider'] === 'upload' && $request->hasFile('video_file')) {
            if ($video->video_provider === 'upload' && $video->video_id) {
                Storage::disk('public')->delete($video->video_id);
            }
            $validated['video_id'] = $request->file('video_file')->store('course_videos', 'public');
        }

        unset($validated['video_file']);

        $video->update($validated);

        return redirect()
            ->route('admin.courses.show', $video->course_id)
            ->with('success', 'Video updated successfully.');
    }

    public function destroyVideo(CourseVideo $video)
    {
        $courseId = $video->course_id;

        if ($video->video_provider === 'upload' && $video->video_id) {
            Storage::disk('public')->delete($video->video_id);
        }

        // course_video_questions cascade-delete at the database level.
        $video->delete();

        return redirect()
            ->route('admin.courses.show', $courseId)
            ->with('success', 'Video deleted successfully.');
    }

    public function showVideo(CourseVideo $video)
    {
        $video->load(['course', 'questions']);

        return view('admin.courses.videos.show', compact('video'));
    }

    public function storeQuestion(Request $request, CourseVideo $video)
    {
        $validated = $this->validateQuestion($request);

        $video->questions()->create($validated);

        return redirect()
            ->route('admin.courses.videos.show', $video)
            ->with('success', 'Question added successfully.');
    }

    public function updateQuestion(Request $request, CourseVideoQuestion $question)
    {
        $validated = $this->validateQuestion($request);

        $question->update($validated);

        return redirect()
            ->route('admin.courses.videos.show', $question->course_video_id)
            ->with('success', 'Question updated successfully.');
    }

    public function destroyQuestion(CourseVideoQuestion $question)
    {
        $videoId = $question->course_video_id;

        $question->delete();

        return redirect()
            ->route('admin.courses.videos.show', $videoId)
            ->with('success', 'Question deleted successfully.');
    }

    private function validateQuestion(Request $request): array
    {
        $validated = $request->validate([
            'trigger_at_seconds' => 'required|integer|min:0',
            'question_type' => 'required|in:mcq,true_false',
            'question_text' => 'required|string',
            'option_a' => 'required|string|max:255',
            'option_b' => 'required|string|max:255',
            'option_c' => 'nullable|required_if:question_type,mcq|string|max:255',
            'option_d' => 'nullable|string|max:255',
            'correct_option' => 'required|in:a,b,c,d',
            'explanation' => 'nullable|string',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        // True/false questions only ever have two real options - keep the
        // stored data consistent regardless of what a stray form field
        // might contain, and make sure the correct answer is actually one
        // of the options that exists for this question.
        if ($validated['question_type'] === 'true_false') {
            $validated['option_a'] = $validated['option_a'] ?: 'True';
            $validated['option_b'] = $validated['option_b'] ?: 'False';
            $validated['option_c'] = null;
            $validated['option_d'] = null;

            if (! in_array($validated['correct_option'], ['a', 'b'], true)) {
                abort(422, 'A true/false question\'s correct answer must be option A or B.');
            }
        } elseif (empty($validated['option_' . $validated['correct_option']])) {
            abort(422, 'The correct option must match one of the provided options.');
        }

        return $validated;
    }
}
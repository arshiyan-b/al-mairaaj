@extends('teacher.layout.app')
@section('title')
    Courses
@endsection
@section('content')

    <div class="container">
        @include('teacher.layout.alerts')
        @foreach ($courses as $subjectName => $subjectCourses)

            <div class="card mb-2">
                <div class="card-header d-flex align-items-center justify-content-between">
                    <h5 class="text-uppercase">{{ $board->name }} | {{ $qualification->name }} | {{ $subjectName }}</h5>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addCourseModal">
                        Add Course
                    </button>
                </div>
                <div class="card-body">
                    <div class="row">
                        @foreach ($subjectCourses as $course)
                            <div class="col-md-4">
                                <div class="card p-3 mb-3">
                                    <h3>{{ $course->title }}</h3>
                                    <p>{{ $course->description }}</p>
                                    <a class="btn btn-sm btn-outline-secondary"
                                        href="{{ route('teacher.course.show', [$board->key, $qualification->key, $course->id]) }}">
                                        View Details
                                    </a>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>

        @endforeach
    </div>

    <div class="modal fade" id="addCourseModal" tabindex="-1" aria-labelledby="addCourseModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title" id="addCourseModalLabel">Add Course</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <form action="{{ route('teacher.course.store') }}" method="POST">
                    @csrf

                    <div class="modal-body">

                        <div class="mb-3">
                            <label class="form-label">Title</label>
                            <input type="text" name="title" class="form-control" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Description</label>
                            <textarea name="description" class="form-control" rows="3" required></textarea>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Paper</label>
                            <select name="paper" class="form-control" required>
                                <option value="" selected disabled>Select Paper</option>
                                <option value="1">Paper 1</option>
                                <option value="2">Paper 2</option>
                                <option value="3">Paper 3</option>
                                <option value="4">Paper 4</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Examination Board</label>
                            <select name="board" class="form-control" required>
                                <option value="{{ $board->id }}" selected>{{ $board->name }}</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Qualification</label>
                            <select name="qualification" class="form-control" required>
                                <option value="{{ $qualification->id }}" selected>{{ $qualification->name }}</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Subject</label>
                            <select name="subject" class="form-control" required>
                                <option value="" selected disabled>Select Subject</option>
                                @foreach ($subjects as $subject)
                                    <option value="{{ $subject->id }}">{{ $subject->name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Save Course</button>
                    </div>

                </form>

            </div>
        </div>
    </div>
@endsection
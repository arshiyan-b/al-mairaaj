@extends('teacher.layout.app')
@section('title')
    {{ $course->title }}
@endsection
@section('content')

    <div class="container">
        @include('teacher.layout.alerts')

        <div class="card mb-2">
            <div class="card-header">
                <h3>Course Details</h3>
            </div>

            <div class="card-body">

                <div class="table-responsive mb-4">
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <th>Examination Board</th>
                                <td>{{ $board->name }}</td>
                            </tr>
                            <tr>
                                <th>Qualification</th>
                                <td>{{ $qualification->name }}</td>
                            </tr>
                            <tr>
                                <th>Subject</th>
                                <td>{{ $course->subject->name }}</td>
                            </tr>
                            <tr>
                                <th>Paper</th>
                                <td>{{ $course->paper }}</td>
                            </tr>
                            <tr>
                                <th style="width: 30%;">Course Title</th>
                                <td>{{ $course->title }}</td>
                            </tr>
                            <tr>
                                <th>Description</th>
                                <td>{{ $course->description }}</td>
                            </tr>
                            <tr>
                                <th>Total Videos</th>
                                <td>{{ $videos->count() }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h3>Videos</h3>

                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addVideoModal">
                    Add Video
                </button>
            </div>

            <div class="card-body">
                <div class="card-body">
                    <div class="list-group">

                        @foreach ($videos as $video)

                            <div class="list-group-item mb-2 border rounded">
                                <h5 class="mb-1">{{ $video->title }}</h5>
                                <p class="mb-0 text-muted">
                                    {{ $video->description }}
                                </p>
                            </div>

                        @endforeach

                    </div>
                </div>
            </div>

        </div>

    </div>

    <div class="modal fade" id="addVideoModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">Add Video</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <form action="{{ route('teacher.course.video.store') }}" method="POST" enctype="multipart/form-data">
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
                            <label class="form-label">Upload Video</label>
                            <input type="file" name="file" class="form-control" accept="video/*" required>
                        </div>

                        <input type="hidden" name="course_id" value="{{ $course->id }}">
                        <input type="hidden" name="qualification_id" value="{{ $qualification->id }}">
                        <input type="hidden" name="board_id" value="{{ $board->id }}">
                        <input type="hidden" name="subject_id" value="{{ $course->subject->id }}">

                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Cancel
                        </button>

                        <button type="submit" class="btn btn-primary submit">
                            Save Video
                        </button>
                    </div>

                </form>

            </div>
        </div>
    </div>
@endsection
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
            <div class="card-header">
                <h3>Videos</h3>
            </div>

            <div class="card-body">
                <div class="row align-items-center">
                    @foreach ($videos as $video)
                        <div class="col-md-4">
                            <div class="card p-3 mb-3">
                                <a class="btn btn-outline-secondary"
                                    href="{{ route('teacher.course.video', [$board->key, $qualification->key, $course->id, $video->id]) }}">
                                    View Details
                                </a>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>

    </div>
@endsection
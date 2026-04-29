@extends('teacher.layout.app')
@section('title')
    Courses
@endsection
@section('content')

    <div class="container">
        <div class="card">
            <div class="card-header d-flex align-items-center justify-content-between">
                <h5 class="text-uppercase">{{$board}} | {{$grade}}</h5>
                <button class="btn btn-primary">Add Course</button>
            </div>

            <div class="card-body">
                <div class="row">
                    @forelse ($courses as $course)

                        <div class="col-md-4">
                            <a class="card border-0 text-decoration-none" style="background-color: #F5F7FA;"
                                href="{{ route('teacher.course.video', [$board, $grade, $course->course_id]) }}">
                                <div class="card-body">
                                    <h4 class="fw-bold">{{ $course->course_name }}</h4>
                                    <p>{{ \Str::limit($course->course_description, 50, '...') }}</p>

                                    <span class="badge bg-primary">{{ $course->course_qualification }}</span>

                                    <div class="mt-3">
                                        <small>Teacher</small>
                                        <div class="d-flex align-items-center mt-1">
                                            <img src="https://ui-avatars.com/api/?name=Teacher+John&color=random&background=random"
                                                width="40" class="rounded-circle me-2">
                                            <div>
                                                <small>Mr. John Doe</small><br>
                                                <small class="text-muted">Subject Specialist</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>

                    @empty
                        <div class="col-12 text-center py-5">
                            <p>No courses found for this board and grade.</p>
                        </div>
                    @endforelse
                </div>
            </div>

        </div>
    </div>
@endsection
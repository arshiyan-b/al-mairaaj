@extends('admin.layout.app')
@section('title')
    Recorded Courses
@endsection
@include('scripts.table')
@section('content')

<div class="container">
    @include('admin.layout.alerts')

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h2 class="mb-0">Recorded Courses</h2>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addCourseModal">
                <i class="bi bi-plus-lg me-1"></i> Add Course
            </button>
        </div>

        <div class="card-body">
            <table class="table table-bordered datatable">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Board</th>
                        <th>Grade</th>
                        <th>Subject</th>
                        <th>Teacher</th>
                        <th>Videos</th>
                        <th>Per-Minute Cost</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    @forelse ($courses as $course)
                        <tr>
                            <td>{{ $loop->iteration }}</td>
                            <td><strong>{{ $course->title }}</strong></td>
                            <td>{{ $course->grade->board->name ?? '-' }}</td>
                            <td>{{ $course->grade->name ?? '-' }}</td>
                            <td>{{ $course->subject->name ?? '-' }}</td>
                            <td>{{ $course->teacher->name ?? '-' }}</td>
                            <td>{{ $course->videos_count }}</td>
                            <td>{{ number_format($course->per_minute_cost, 2) }}</td>
                            <td>
                                @if ($course->status === 'published')
                                    <span class="badge bg-success">Published</span>
                                @elseif ($course->status === 'draft')
                                    <span class="badge bg-secondary">Draft</span>
                                @else
                                    <span class="badge bg-dark">Archived</span>
                                @endif
                            </td>
                            <td>
                                <a href="{{ route('admin.courses.show', $course->id) }}" class="btn btn-sm btn-outline-secondary">
                                    Manage Videos
                                </a>
                                <button type="button" class="btn btn-sm btn-outline-warning"
                                    data-bs-toggle="modal" data-bs-target="#editCourseModal{{ $course->id }}">
                                    Edit
                                </button>
                                <form action="{{ route('admin.courses.destroy', $course->id) }}" method="POST" class="d-inline"
                                    onsubmit="return confirm('Delete this course and all of its videos and questions? This cannot be undone.');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-sm btn-outline-danger">Delete</button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="10" class="text-center text-muted">No courses have been created yet.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

{{-- Add Course --}}
<div class="modal fade" id="addCourseModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="POST" action="{{ route('admin.courses.store') }}" enctype="multipart/form-data">
                @csrf

                <div class="modal-header">
                    <h5 class="modal-title">Add Course</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    @include('admin.courses.partials.form')
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Add Course</button>
                </div>
            </form>
        </div>
    </div>
</div>

{{-- Edit Course (one modal per row) --}}
@foreach ($courses as $course)
    <div class="modal fade" id="editCourseModal{{ $course->id }}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form method="POST" action="{{ route('admin.courses.update', $course->id) }}" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')

                    <div class="modal-header">
                        <h5 class="modal-title">Edit Course</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body">
                        @include('admin.courses.partials.form', ['course' => $course])
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-warning">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endforeach

@endsection
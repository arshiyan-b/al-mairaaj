@extends('admin.layout.app')
@section('title')
    {{ $course->title }}
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

    <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h4 class="mb-0">{{ $course->title }}</h4>
            <a href="{{ route('admin.courses.index') }}" class="btn btn-outline-secondary btn-sm">
                <i class="bi bi-arrow-left me-1"></i> Back to Courses
            </a>
        </div>

        <div class="card-body">
            <div class="row">
                <div class="col-md-3 mb-2">
                    <div class="text-muted small">Board / Grade</div>
                    <div class="fw-semibold">
                        {{ $course->grade->board->name ?? '-' }} / {{ $course->grade->name ?? '-' }}
                    </div>
                </div>
                <div class="col-md-3 mb-2">
                    <div class="text-muted small">Subject</div>
                    <div class="fw-semibold">{{ $course->subject->name ?? '-' }}</div>
                </div>
                <div class="col-md-3 mb-2">
                    <div class="text-muted small">Teacher</div>
                    <div class="fw-semibold">{{ $course->teacher->name ?? 'Unassigned' }}</div>
                </div>
                <div class="col-md-3 mb-2">
                    <div class="text-muted small">Per-Minute Cost</div>
                    <div class="fw-semibold">{{ number_format($course->per_minute_cost, 2) }}</div>
                </div>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Videos</h5>
            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addVideoModal">
                <i class="bi bi-plus-lg me-1"></i> Add Video
            </button>
        </div>

        <div class="card-body">
            <table class="table table-bordered datatable">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Provider</th>
                        <th>Duration</th>
                        <th>Questions</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    @forelse ($course->videos as $video)
                        <tr>
                            <td>{{ $video->sort_order }}</td>
                            <td><strong>{{ $video->title }}</strong></td>
                            <td class="text-capitalize">{{ $video->video_provider }}</td>
                            <td>
                                @if ($video->duration_seconds)
                                    {{ gmdate('i:s', $video->duration_seconds) }}
                                @else
                                    -
                                @endif
                            </td>
                            <td>{{ $video->questions()->count() }}</td>
                            <td>
                                @if ($video->status === 'published')
                                    <span class="badge bg-success">Published</span>
                                @else
                                    <span class="badge bg-secondary">Draft</span>
                                @endif
                            </td>
                            <td>
                                <a href="{{ route('admin.courses.videos.show', $video->id) }}" class="btn btn-sm btn-outline-secondary">
                                    Manage Questions
                                </a>
                                <button type="button" class="btn btn-sm btn-outline-warning"
                                    data-bs-toggle="modal" data-bs-target="#editVideoModal{{ $video->id }}">
                                    Edit
                                </button>
                                <form action="{{ route('admin.courses.videos.destroy', $video->id) }}" method="POST" class="d-inline"
                                    onsubmit="return confirm('Delete this video and all of its questions? This cannot be undone.');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-sm btn-outline-danger">Delete</button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="text-center text-muted">No videos have been added to this course yet.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

{{-- Add Video --}}
<div class="modal fade" id="addVideoModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="POST" action="{{ route('admin.courses.videos.store', $course->id) }}" enctype="multipart/form-data">
                @csrf
                <div class="modal-header">
                    <h5 class="modal-title">Add Video</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    @include('admin.courses.partials.video-form')
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Add Video</button>
                </div>
            </form>
        </div>
    </div>
</div>

{{-- Edit Video (one modal per row) --}}
@foreach ($course->videos as $video)
    <div class="modal fade" id="editVideoModal{{ $video->id }}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form method="POST" action="{{ route('admin.courses.videos.update', $video->id) }}" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Video</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        @include('admin.courses.partials.video-form', ['video' => $video])
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
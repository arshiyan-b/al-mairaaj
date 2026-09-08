@extends('admin.layout.app')
@section('title')
    {{ $video->title }}
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
            <div>
                <h4 class="mb-0">{{ $video->title }}</h4>
                <div class="text-muted small">{{ $video->course->title ?? '' }}</div>
            </div>
            <a href="{{ route('admin.courses.show', $video->course_id) }}" class="btn btn-outline-secondary btn-sm">
                <i class="bi bi-arrow-left me-1"></i> Back to Course
            </a>
        </div>
    </div>

    <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
            <div>
                <h5 class="mb-0">Pause Questions</h5>
                <div class="text-muted small">
                    Playback pauses at the given timestamp and the student must answer before continuing.
                </div>
            </div>
            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addQuestionModal">
                <i class="bi bi-plus-lg me-1"></i> Add Question
            </button>
        </div>

        <div class="card-body">
            <table class="table table-bordered datatable">
                <thead>
                    <tr>
                        <th>Trigger At</th>
                        <th>Type</th>
                        <th>Question</th>
                        <th>Correct Answer</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    @forelse ($video->questions as $question)
                        <tr>
                            <td>{{ gmdate('i:s', $question->trigger_at_seconds) }}</td>
                            <td>
                                @if ($question->question_type === 'true_false')
                                    <span class="badge bg-info text-dark">True / False</span>
                                @else
                                    <span class="badge bg-primary">MCQ</span>
                                @endif
                            </td>
                            <td>{{ \Illuminate\Support\Str::limit($question->question_text, 60) }}</td>
                            <td>{{ $question->{'option_' . $question->correct_option} }}</td>
                            <td>
                                <button type="button" class="btn btn-sm btn-outline-warning"
                                    data-bs-toggle="modal" data-bs-target="#editQuestionModal{{ $question->id }}">
                                    Edit
                                </button>
                                <form action="{{ route('admin.courses.questions.destroy', $question->id) }}" method="POST" class="d-inline"
                                    onsubmit="return confirm('Delete this question?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-sm btn-outline-danger">Delete</button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="text-center text-muted">No pause questions have been added to this video yet.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

{{-- Add Question --}}
<div class="modal fade" id="addQuestionModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <form method="POST" action="{{ route('admin.courses.questions.store', $video->id) }}">
                @csrf
                <div class="modal-header">
                    <h5 class="modal-title">Add Pause Question</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    @include('admin.courses.partials.question-form')
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Add Question</button>
                </div>
            </form>
        </div>
    </div>
</div>

{{-- Edit Question (one modal per row) --}}
@foreach ($video->questions as $question)
    <div class="modal fade" id="editQuestionModal{{ $question->id }}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <form method="POST" action="{{ route('admin.courses.questions.update', $question->id) }}">
                    @csrf
                    @method('PUT')
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Question</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        @include('admin.courses.partials.question-form', ['question' => $question])
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
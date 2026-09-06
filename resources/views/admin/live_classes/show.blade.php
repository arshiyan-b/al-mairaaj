@extends('admin.layout.app')

@section('title')
    {{ $liveClass->batch->title }} - {{ $liveClass->name }}
@endsection
@include('scripts.disable_submit_button')

@section('content')

<div class="container">
    @include('admin.layout.alerts')

    {{-- Page Header --}}
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h4 class="mb-1">Live Class Details</h4>
            <p class="text-muted mb-0">
                View complete information about this live class.
            </p>
        </div>

        <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#editLiveClassModal">
            <i class="fas fa-edit me-1"></i> Edit
        </button>
    </div>


    {{-- Main Information --}}
    <div class="row">

        {{-- Class Information --}}
        <div class="col-lg-8 mb-4">

            <div class="card shadow-sm border-0">

                <div class="card-header bg-white border-bottom">
                    <h5 class="mb-0">
                        <i class="fas fa-chalkboard-teacher me-2"></i>
                        Class Information
                    </h5>
                </div>

                <div class="card-body">

                    <div class="row">

                        {{-- Title --}}
                        <div class="col-md-6 mb-3">
                            <label class="text-muted small">
                                Class Title
                            </label>

                            <div class="fw-semibold">
                                {{ $liveClass->title ?? 'N/A' }}
                            </div>
                        </div>


                        {{-- Status --}}
                        <div class="col-md-6 mb-3">
                            <label class="text-muted small">
                                Status
                            </label>

                            <div>
                                @php
                                    $status = strtolower($liveClass->status ?? '');
                                @endphp

                                @if($status === 'active')
                                    <span class="badge bg-success">
                                        Active
                                    </span>
                                @elseif($status === 'completed')
                                    <span class="badge bg-secondary">
                                        Completed
                                    </span>
                                @elseif($status === 'cancelled')
                                    <span class="badge bg-danger">
                                        Cancelled
                                    </span>
                                @elseif($status === 'scheduled')
                                    <span class="badge bg-primary">
                                        Scheduled
                                    </span>
                                @else
                                    <span class="badge bg-warning text-dark">
                                        {{ $liveClass->status ?? 'N/A' }}
                                    </span>
                                @endif
                            </div>
                        </div>


                        {{-- Description --}}
                        <div class="col-12 mb-3">
                            <label class="text-muted small">
                                Description
                            </label>

                            <div>
                                @if($liveClass->description)
                                    {!! nl2br(e($liveClass->description)) !!}
                                @else
                                    <span class="text-muted">
                                        No description provided.
                                    </span>
                                @endif
                            </div>
                        </div>

                    </div>

                </div>
            </div>

        </div>


        {{-- Price --}}
        <div class="col-lg-4 mb-4">

            <div class="card shadow-sm border-0 h-100">

                <div class="card-header bg-white border-bottom">
                    <h5 class="mb-0">
                        <i class="fas fa-money-bill-wave me-2"></i>
                        Pricing
                    </h5>
                </div>

                <div class="card-body d-flex align-items-center">

                    <div>
                        <div class="text-muted small mb-1">
                            Class Price
                        </div>

                        <h3 class="mb-0">
                            {{ number_format((float) ($liveClass->price ?? 0), 2) }}
                        </h3>
                    </div>

                </div>
            </div>

        </div>


        {{-- Schedule --}}
        <div class="col-lg-6 mb-4">

            <div class="card shadow-sm border-0">

                <div class="card-header bg-white border-bottom">
                    <h5 class="mb-0">
                        <i class="fas fa-calendar-alt me-2"></i>
                        Schedule
                    </h5>
                </div>

                <div class="card-body">

                    <div class="row">

                        {{-- Date --}}
                        <div class="col-md-6 mb-3">
                            <label class="text-muted small">
                                Class Date
                            </label>

                            <div class="fw-semibold">
                                {{ $liveClass->formatted_class_date ?? 'N/A' }}
                            </div>
                        </div>


                        {{-- Duration --}}
                        <div class="col-md-6 mb-3">
                            <label class="text-muted small">
                                Duration
                            </label>

                            <div class="fw-semibold">
                                {{ $liveClass->duration ?? 'N/A' }}
                                @if($liveClass->duration)
                                    minutes
                                @endif
                            </div>
                        </div>


                        {{-- Start Time --}}
                        <div class="col-md-6 mb-3">
                            <label class="text-muted small">
                                Start Time
                            </label>

                            <div class="fw-semibold">
                                {{ $liveClass->start_time
                                    ? $liveClass->start_time->format('h:i A')
                                    : 'N/A'
                                }}
                            </div>
                        </div>


                        {{-- End Time --}}
                        <div class="col-md-6 mb-3">
                            <label class="text-muted small">
                                End Time
                            </label>

                            <div class="fw-semibold">
                                {{ $liveClass->end_time
                                    ? $liveClass->end_time->format('h:i A')
                                    : 'N/A'
                                }}
                            </div>
                        </div>

                    </div>

                </div>
            </div>

        </div>


        {{-- Batch / Academic Information --}}
        <div class="col-lg-6 mb-4">

            <div class="card shadow-sm border-0">

                <div class="card-header bg-white border-bottom">
                    <h5 class="mb-0">
                        <i class="fas fa-users me-2"></i>
                        Batch Information
                    </h5>
                </div>

                <div class="card-body">

                    <div class="row">

                        {{-- Batch --}}
                        <div class="col-md-12 mb-3">
                            <label class="text-muted small">
                                Batch
                            </label>

                            <div class="fw-semibold">
                                {{ $liveClass->batch->title }}
                            </div>
                        </div>


                        {{-- Teacher --}}
                        <div class="col-md-6 mb-3">
                            <label class="text-muted small">
                                Teacher
                            </label>

                            <div class="fw-semibold">
                                {{ $liveClass->teacher?->name ?? 'N/A' }}
                            </div>
                        </div>


                        {{-- Board --}}
                        <div class="col-md-6 mb-3">
                            <label class="text-muted small">
                                Board
                            </label>

                            <div class="fw-semibold">
                                {{ $liveClass->board?->name ?? 'N/A' }}
                            </div>
                        </div>

                        {{-- Grade --}}
                        <div class="col-md-6 mb-3">
                            <label class="text-muted small">
                                Grade
                            </label>

                            <div class="fw-semibold">
                                {{ $liveClass->grade?->name ?? 'N/A' }}
                            </div>
                        </div>


                        {{-- Subject --}}
                        <div class="col-md-6 mb-3">
                            <label class="text-muted small">
                                Subject
                            </label>

                            <div class="fw-semibold">
                                {{ $liveClass->curriculum_subject?->name ?? 'N/A' }}
                            </div>
                        </div>

                    </div>

                </div>
            </div>

        </div>


        {{-- Meeting Information --}}
        <div class="col-12 mb-4">

            <div class="card shadow-sm border-0">

                <div class="card-header bg-white border-bottom">
                    <h5 class="mb-0">
                        <i class="fas fa-video me-2"></i>
                        Meeting Information
                    </h5>
                </div>

                <div class="card-body">

                    <div class="row">

                        {{-- Meeting Provider --}}
                        <div class="col-md-4 mb-3">
                            <label class="text-muted small">
                                Meeting Provider
                            </label>

                            <div class="fw-semibold">
                                {{ $liveClass->meeting_provider ?? 'N/A' }}
                            </div>
                        </div>


                        {{-- Meeting ID --}}
                        <div class="col-md-4 mb-3">
                            <label class="text-muted small">
                                Meeting ID
                            </label>

                            <div class="fw-semibold">
                                {{ $liveClass->meetingDetail?->meeting_id ?? $liveClass->meeting_id ?? 'N/A' }}
                            </div>
                        </div>


                        {{-- Password --}}
                        <div class="col-md-4 mb-3">
                            <label class="text-muted small">
                                Meeting Password
                            </label>

                            <div class="fw-semibold">
                                {{ $liveClass->meetingDetail?->password ?? $liveClass->meeting_password ?? 'N/A' }}
                            </div>
                        </div>


                        {{-- Meeting Link --}}
                        <div class="col-12">
                            <label class="text-muted small">
                                Meeting Link
                            </label>

                            <div class="mt-1">
                                <a href="{{ route('admin.jitsi.join', $liveClass) }}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="btn btn-sm btn-primary">

                                    <i class="fas fa-external-link-alt me-1"></i>
                                    Open Meeting
                                </a>
                            </div>

                        </div>

                    </div>

                </div>
            </div>

        </div>


        {{-- Enrollments --}}
        <div class="col-12 mb-4">

            <div class="card shadow-sm border-0">

                <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center">

                    <h5 class="mb-0">
                        <i class="fas fa-user-graduate me-2"></i>
                        Enrollments
                    </h5>

                    <span class="badge bg-primary">
                        {{ $liveClass->enrollments?->count() ?? 0 }}
                    </span>

                </div>

                <div class="card-body p-0">

                    @if($liveClass->enrollments && $liveClass->enrollments->count())

                        <div class="table-responsive">

                            <table class="table table-hover align-middle mb-0">

                                <thead class="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Student</th>
                                        <th>Status</th>
                                        <th>Enrolled At</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    @foreach($liveClass->enrollments as $enrollment)

                                        <tr>

                                            <td>
                                                {{ $loop->iteration }}
                                            </td>

                                            <td>
                                                {{ $enrollment->student->full_name }}
                                            </td>

                                            <td>

                                                @php
                                                    $enrollmentStatus =
                                                        strtolower($enrollment->status ?? '');
                                                @endphp

                                                @if($enrollmentStatus === 'active')
                                                    <span class="badge bg-success">
                                                        Active
                                                    </span>
                                                @elseif($enrollmentStatus === 'cancelled')
                                                    <span class="badge bg-danger">
                                                        Cancelled
                                                    </span>
                                                @elseif($enrollmentStatus === 'completed')
                                                    <span class="badge bg-secondary">
                                                        Completed
                                                    </span>
                                                @else
                                                    <span class="badge bg-warning text-dark">
                                                        {{ $enrollment->status ?? 'N/A' }}
                                                    </span>
                                                @endif

                                            </td>

                                            <td>
                                                {{ $enrollment->created_at
                                                    ? $enrollment->created_at->format('d M Y h:i A')
                                                    : 'N/A'
                                                }}
                                            </td>

                                        </tr>

                                    @endforeach

                                </tbody>

                            </table>

                        </div>

                    @else

                        <div class="text-center py-5">

                            <i class="fas fa-users fa-2x text-muted mb-3"></i>

                            <p class="text-muted mb-0">
                                No students are enrolled in this live class.
                            </p>

                        </div>

                    @endif

                </div>
            </div>

        </div>


        {{-- Timestamps --}}
        <div class="col-12">

            <div class="card shadow-sm border-0">

                <div class="card-body">

                    <div class="row">

                        <div class="col-md-6">
                            <span class="text-muted">
                                Created:
                            </span>

                            <strong>
                                {{ $liveClass->created_at
                                    ? $liveClass->created_at->format('d M Y h:i A')
                                    : 'N/A'
                                }}
                            </strong>
                        </div>

                        <div class="col-md-6 text-md-end">
                            <span class="text-muted">
                                Last Updated:
                            </span>

                            <strong>
                                {{ $liveClass->updated_at
                                    ? $liveClass->updated_at->format('d M Y h:i A')
                                    : 'N/A'
                                }}
                            </strong>
                        </div>

                    </div>

                </div>
            </div>

        </div>

    </div>

</div>

<div class="modal fade" id="editLiveClassModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="POST" action="{{ route('admin.live_classes.update', $liveClass->id) }}">
                @csrf
                @method('PUT')

                <div class="modal-header">
                    <h5 class="modal-title">Edit Live Class</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">

                    <div class="row mb-3">
                        <div class="col-md-8">
                            <label class="form-label">Title</label>
                            <input type="text" name="title" class="form-control" value="{{ old('title', $liveClass->title) }}" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Price</label>
                            <input type="number" name="price" class="form-control" value="{{ old('price', $liveClass->price) }}" required>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea name="description" class="form-control" rows="2">{{ old('description', $liveClass->description) }}</textarea>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Status</label>
                        <select name="status" class="form-control" required>
                            <option value="scheduled" {{ $liveClass->status === 'scheduled' ? 'selected' : '' }}>Scheduled</option>
                            <option value="completed" {{ $liveClass->status === 'completed' ? 'selected' : '' }}>Completed</option>
                            <option value="canceled" {{ $liveClass->status === 'canceled' ? 'selected' : '' }}>Canceled</option>
                        </select>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label class="form-label">Class Date</label>
                            <input type="date" name="class_date" class="form-control"
                                value="{{ old('class_date', $liveClass->class_date ? \Carbon\Carbon::parse($liveClass->class_date)->format('Y-m-d') : '') }}"
                                required>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label class="form-label">Start Time</label>
                            <input type="time" name="start_time" class="form-control" id="editLiveClassStartTime"
                                value="{{ old('start_time', $liveClass->start_time ? $liveClass->start_time->format('H:i') : '') }}"
                                required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">End Time</label>
                            <input type="time" name="end_time" class="form-control" id="editLiveClassEndTime"
                                value="{{ old('end_time', $liveClass->end_time ? $liveClass->end_time->format('H:i') : '') }}"
                                required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Duration (mins)</label>
                            <input type="number" name="duration" class="form-control" id="editLiveClassDuration"
                                value="{{ old('duration', $liveClass->duration) }}" min="1">
                        </div>
                    </div>

                    <div class="alert alert-secondary small mb-0">
                        Meeting provider, link and credentials can't be changed here since a meeting has
                        already been created for this class.
                    </div>

                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-warning">Save Changes</button>
                </div>

            </form>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        const startInput = document.getElementById('editLiveClassStartTime');
        const endInput = document.getElementById('editLiveClassEndTime');
        const durationInput = document.getElementById('editLiveClassDuration');

        function updateDuration() {
            if (startInput.value && endInput.value) {
                const [sh, sm] = startInput.value.split(':').map(Number);
                const [eh, em] = endInput.value.split(':').map(Number);
                const diff = (eh * 60 + em) - (sh * 60 + sm);
                if (diff > 0) {
                    durationInput.value = diff;
                }
            }
        }

        startInput.addEventListener('change', updateDuration);
        endInput.addEventListener('change', updateDuration);
    });
</script>

@endsection
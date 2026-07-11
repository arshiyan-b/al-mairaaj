@extends('admin.layout.app')
@section('title')
    Live Classes for {{ $board->name }} - {{ $grade->name }}
@endsection
@section('content')

<div class="container">

    {{-- Batch info card --}}
    <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">{{ $batch->title }}</h5>
            <span class="badge bg-{{ $batch->status === 'active' ? 'success' : 'secondary' }} text-capitalize">
                {{ $batch->status }}
            </span>
        </div>
        <div class="card-body">
            <div class="row mb-2">
                <div class="col-md-3">
                    <strong>Subject</strong>
                    <p class="mb-0">{{ $batch->curriculumSubject->name }}</p>
                </div>
                <div class="col-md-3">
                    <strong>Teacher</strong>
                    <p class="mb-0">{{ $batch->teacher->name }}</p>
                </div>
                <div class="col-md-3">
                    <strong>Price</strong>
                    <p class="mb-0">{{ $batch->price }}</p>
                </div>
                <div class="col-md-3">
                    <strong>Total Classes</strong>
                    <p class="mb-0">{{ $batch->total_classes }}</p>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-md-3">
                    <strong>Start Date</strong>
                    <p class="mb-0">{{ $batch->formatted_start_date }}</p>
                </div>
                <div class="col-md-3">
                    <strong>End Date</strong>
                    <p class="mb-0">{{ $batch->formatted_end_date }}</p>
                </div>
                <div class="col-md-3">
                    <strong>Description</strong>
                    <p class="mb-0">{{ $batch->title }}</p>
                </div>
                <div class="col-md-3">
                    <strong>Description</strong>
                    <p class="mb-0">{{ $batch->description }}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Live Classes</h5>
            <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#addLiveClassModal">
                Add Live Class
            </button>
        </div>
        <div class="card-body mx-4">
            @if ($live_classes->isEmpty())
                <div class="p-4 text-center text-muted">
                    No live classes scheduled yet for this batch.
                </div>
            @else
                <div class="table-responsive">
                    <table class="table table-bordered mb-0">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Start Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($live_classes as $index => $liveClass)
                                <tr>
                                    <td>{{ $index + 1 }}</td>
                                    <td>{{ $liveClass->title }}</td>
                                    <td>{{ $liveClass->description }}</td>
                                    <td>{{ $liveClass->formatted_class_date }}</td>
                                    <td>
                                        <span class="badge bg-{{ $liveClass->status === 'completed' ? 'success' : ($liveClass->status === 'live' ? 'danger' : 'secondary') }} text-capitalize">
                                            {{ $liveClass->status ?? 'scheduled' }}
                                        </span>
                                    </td>
                                    <td>
                                        <a href="#" class="btn btn-sm btn-outline-secondary">View</a>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        </div>
    </div>

</div>


<div class="modal fade" id="addLiveClassModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="POST" action="{{ route('admin.live_classes.store') }}">
                @csrf
                <input type="hidden" name="batch_id" value="{{ $batch->id }}">

                <div class="modal-header">
                    <h5 class="modal-title">Add Live Class</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">

                    <div class="mb-3">
                        <label class="form-label">Title</label>
                        <input type="text" name="title" class="form-control" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea name="description" class="form-control" rows="2"></textarea>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Meeting Provider</label>
                            <select name="meeting_provider" class="form-control" required>
                                <option value="">Select Provider</option>
                                <option value="zoom">Zoom</option>
                                <option value="google_meet">Google Meet</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Status</label>
                            <select name="status" class="form-control" required>
                                <option value="scheduled" selected>Scheduled</option>
                                <option value="completed">Completed</option>
                                <option value="canceled">Canceled</option>
                            </select>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Meeting Link</label>
                        <input type="url" name="meeting_link" class="form-control" placeholder="https://...">
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Meeting ID</label>
                            <input type="text" name="meeting_id" class="form-control">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Meeting Password</label>
                            <input type="text" name="meeting_password" class="form-control">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Class Date</label>
                        <input type="date" name="class_date" class="form-control" required>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label class="form-label">Start Time</label>
                            <input type="time" name="start_time" class="form-control" id="liveClassStartTime" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">End Time</label>
                            <input type="time" name="end_time" class="form-control" id="liveClassEndTime" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Duration (mins)</label>
                            <input type="number" name="duration" class="form-control" id="liveClassDuration" min="1">
                        </div>
                    </div>

                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-success">Add</button>
                </div>

            </form>
        </div>
    </div>
</div>

<script>
    // Auto-calculate duration from start_time/end_time
    document.addEventListener('DOMContentLoaded', function () {
        const startInput = document.getElementById('liveClassStartTime');
        const endInput = document.getElementById('liveClassEndTime');
        const durationInput = document.getElementById('liveClassDuration');

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
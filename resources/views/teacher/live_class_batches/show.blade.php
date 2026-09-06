@extends('teacher.layout.app')

@section('title')
    {{ $batch->title }}
@endsection
@include('scripts.disable_submit_button')
@section('content')

    <div class="container">
        @include('teacher.layout.alerts')

        @if ($errors->any())
            <div class="alert alert-danger mt-3">
                <ul class="mb-0">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Batch Description</h5>
            </div>
            <div class="card-body">
                <table class="table table-bordered table-sm mb-0">
                    <tbody>
                        <tr>
                            <th class="w-25 text-muted">Title</th>
                            <td>{{ $batch->title }}</td>
                        </tr>
                        <tr>
                            <th class="text-muted">Description</th>
                            <td>{{ $batch->description }}</td>
                        </tr>
                        <tr>
                            <th class="text-muted">Status</th>
                            <td>
                                <span class="badge bg-{{ $batch->status === 'active' ? 'success' : 'secondary' }} text-capitalize">
                                    {{ $batch->status }}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th class="text-muted">Subject</th>
                            <td>{{ $batch->curriculumSubject->name }}</td>
                        </tr>
                        <tr>
                            <th class="text-muted">Teacher</th>
                            <td>{{ $batch->teacher->name }}</td>
                        </tr>
                        <tr>
                            <th class="text-muted">Total Classes</th>
                            <td>{{ $batch->liveClasses->count() }}</td>
                        </tr>
                        <tr>
                            <th class="text-muted">Start Date</th>
                            <td>{{ $batch->formatted_start_date }}</td>
                        </tr>
                        <tr>
                            <th class="text-muted">End Date</th>
                            <td>{{ $batch->formatted_end_date }}</td>
                        </tr>
                    </tbody>
                </table>
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
                            @foreach ($batch->liveClasses as $index => $liveClass)
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
                                        <a href="{{ route('teacher.live_class.show', $liveClass->id) }}" class="btn btn-sm btn-outline-secondary">
                                            View
                                        </a>
                                        <button type="button" class="btn btn-sm btn-outline-warning"
                                            data-bs-toggle="modal"
                                            data-bs-target="#editLiveClassModal{{ $liveClass->id }}">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {{-- Add Live Class --}}
        <div class="modal fade" id="addLiveClassModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form method="POST" action="{{ route('teacher.live_classes.store') }}">
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
                                    <select name="meeting_provider" id="meetingProvider" class="form-control" required>
                                        <option value="" selected disabled>Select Provider</option>
                                        <option value="zoom">Zoom</option>
                                        <option value="jitsi">Jitsi</option>
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

                            <div class="row mb-3">
                                <div class="col-md-4">
                                    <label class="form-label">Class Date</label>
                                    <input type="date" name="class_date" class="form-control" required>
                                </div>
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

                            <div class="alert alert-secondary small mb-0">
                                Price is set to the batch's price
                                (<strong>{{ number_format((float) ($batch->price ?? 0), 2) }}</strong>)
                                and can't be changed per class.
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

        {{-- Edit Live Class (one modal per row) --}}
        @foreach ($batch->liveClasses as $liveClass)
            <div class="modal fade" id="editLiveClassModal{{ $liveClass->id }}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <form method="POST" action="{{ route('teacher.live_classes.update', $liveClass->id) }}">
                            @csrf
                            @method('PUT')

                            <div class="modal-header">
                                <h5 class="modal-title">Edit Live Class</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>

                            <div class="modal-body">

                                <div class="mb-3">
                                    <label class="form-label">Title</label>
                                    <input type="text" name="title" class="form-control" value="{{ old('title', $liveClass->title) }}" required>
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
                                        <input type="time" name="start_time" class="form-control edit-start-time"
                                            value="{{ old('start_time', $liveClass->start_time ? $liveClass->start_time->format('H:i') : '') }}"
                                            required>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label">End Time</label>
                                        <input type="time" name="end_time" class="form-control edit-end-time"
                                            value="{{ old('end_time', $liveClass->end_time ? $liveClass->end_time->format('H:i') : '') }}"
                                            required>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label">Duration (mins)</label>
                                        <input type="number" name="duration" class="form-control edit-duration"
                                            value="{{ old('duration', $liveClass->duration) }}" min="1">
                                    </div>
                                </div>

                                <div class="alert alert-secondary small mb-0">
                                    Price is set to the batch's price
                                    (<strong>{{ number_format((float) ($batch->price ?? 0), 2) }}</strong>)
                                    and meeting provider/link can't be changed here since a meeting
                                    has already been created for this class.
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
        @endforeach
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function () {

            // Duration auto-calculation for the Add Live Class modal
            const startInput = document.getElementById('liveClassStartTime');
            const endInput = document.getElementById('liveClassEndTime');
            const durationInput = document.getElementById('liveClassDuration');

            function updateDuration(start, end, duration) {
                if (start.value && end.value) {
                    const [sh, sm] = start.value.split(':').map(Number);
                    const [eh, em] = end.value.split(':').map(Number);
                    const diff = (eh * 60 + em) - (sh * 60 + sm);
                    if (diff > 0) {
                        duration.value = diff;
                    }
                }
            }

            if (startInput && endInput && durationInput) {
                startInput.addEventListener('change', () => updateDuration(startInput, endInput, durationInput));
                endInput.addEventListener('change', () => updateDuration(startInput, endInput, durationInput));
            }

            // Duration auto-calculation for every Edit Live Class modal
            document.querySelectorAll('.edit-start-time').forEach(function (start) {
                const container = start.closest('.modal-body');
                const end = container.querySelector('.edit-end-time');
                const duration = container.querySelector('.edit-duration');

                function recalc() {
                    updateDuration(start, end, duration);
                }

                start.addEventListener('change', recalc);
                end.addEventListener('change', recalc);
            });
        });
    </script>
@endsection
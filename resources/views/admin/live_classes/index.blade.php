@extends('admin.layout.app')
@section('title')
    Live Classes for {{ $board->name }} - {{ $grade->name }}
@endsection
@section('content')

<div class="container">
    <div class="card shadow">
        <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <h4 class="mb-0">
                Live Classes for {{ $board->name }} - {{ $grade->name }}
            </h4>

            <button
                type="button"
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#createBatchModal">
                <i class="fas fa-plus me-1"></i> Create Batch
            </button>
        </div>
        <div class="card-body">
            @if ($batches->isEmpty())
                <p>No batches found for this grade.</p>
            @else
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Batch Name</th>
                            <th>Teacher</th>
                            <th>Subject</th>
                            <th>Title</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($batches as $batch)
                            <tr>
                                <td>{{ $batch->name }}</td>
                                <td>{{ $batch->teacher->name }}</td>
                                <td>{{ $batch->curriculumSubject->name }}</td>
                                <td>{{ $batch->title }}</td>
                                <td>{{ $batch->start_date }}</td>
                                <td>{{ $batch->end_date }}</td>
                                <td>{{ ucfirst($batch->status) }}</td>
                                <td>
                                    <a href="{{ route('admin.live_classes.show', ['board' => $board->id, 'grade' => $grade->id, 'batch' => $batch->id]) }}" class="btn btn-primary btn-sm">View</a>
                                    <a href="{{ route('admin.live_classes.edit', ['board' => $board->id, 'grade' => $grade->id, 'batch' => $batch->id]) }}" class="btn btn-warning btn-sm">Edit</a>
                                    <form action="{{ route('admin.live_classes.destroy', ['board' => $board->id, 'grade' => $grade->id, 'batch' => $batch->id]) }}" method="POST" style="display:inline-block;">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this batch?')">Delete</button>
                                    </form>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @endif
                
        </div>
    </div>
</div>

<div class="modal fade" id="createBatchModal" tabindex="-1" aria-labelledby="createBatchModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title" id="createBatchModalLabel">
                    Create Batch
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form action="{{ route('admin.live_class_batches.store', [
                    'board' => $board->id,
                    'grade' => $grade->id
                ]) }}" method="POST">
                @csrf

                <div class="modal-body">

                    <div class="row mb-3">

                        <div class="col-md-6">
                            <label class="form-label">Subject</label>
                            <select name="curriculum_subject_id" class="form-control" id="curriculumSubject" required>
                                <option value="">Select Subject</option>
                                @foreach ($curriculum_subjects as $subject)
                                    <option value="{{ $subject->id }}">{{ $subject->name }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Select Teacher</label>
                            <select name="teacher_id" class="form-control" id="teacherSelect" required disabled>
                                <option value="">Select Teacher</option>
                                @foreach ($teachers as $teacher)
                                    <option 
                                        value="{{ $teacher->id }}" 
                                        data-subject-ids="{{ $teacher->allowed_classes->pluck('curriculum_subject_ids')->flatten()->unique()->implode(',') }}"
                                    >
                                        {{ $teacher->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Batch Title</label>
                        <input type="text" name="title" class="form-control" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea name="description" class="form-control" rows="3"></textarea>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <label class="form-label">Price</label>
                            <input type="number" step="0.01" name="price" class="form-control">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Total Classes</label>
                            <input type="number" name="total_classes" class="form-control">
                        </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col-md-6">
                            <label class="form-label">Start Date</label>
                            <input type="date" name="start_date" class="form-control">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">End Date</label>
                            <input type="date" name="end_date" class="form-control">
                        </div>
                    </div>

                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Close
                    </button>

                    <button type="submit" class="btn btn-success">
                        Create Batch
                    </button>
                </div>

            </form>

        </div>
    </div>
</div>


<script>
    $(document).ready(function () {

    // Cache the full, unfiltered list of teacher options once
    var $allTeacherOptions = $('#teacherSelect option[value!=""]').clone();

    function filterTeachersBySubject(subjectId) {
        var $teacherSelect = $('#teacherSelect');

        $teacherSelect.empty().append('<option value="">Select Teacher</option>');

        if (!subjectId) {
            $teacherSelect.prop('disabled', true).trigger('change');
            return;
        }

        var $matching = $allTeacherOptions.filter(function () {
            var idsStr = $(this).data('subject-ids');
            var ids = idsStr ? idsStr.toString().split(',').map(function (id) { return id.trim(); }) : [];
            return ids.indexOf(subjectId.toString()) !== -1;
        });

        $teacherSelect
            .append($matching.clone())
            .prop('disabled', false)
            .trigger('change');
    }

    $('#curriculumSubject').on('change', function () {
        filterTeachersBySubject($(this).val());
    });

});
</script>

@endsection
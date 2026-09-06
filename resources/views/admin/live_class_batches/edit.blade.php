@extends('admin.layout.app')
@section('title')
    Edit Batch - {{ $batch->title }}
@endsection
@include('scripts.disable_submit_button')
@section('content')

<div class="container">
    @include('admin.layout.alerts')

    <div class="card shadow">
        <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <h4 class="mb-0">
                Edit Batch - {{ $batch->title }}
            </h4>

            <a href="{{ route('admin.live_class_batches.show', [
                    'board' => $board->slug,
                    'grade' => $grade->slug,
                    'batch' => $batch->id,
                ]) }}" class="btn btn-outline-light btn-sm">
                <i class="fas fa-arrow-left me-1"></i> Back to Batch
            </a>
        </div>

        <div class="card-body">

            <form method="POST" action="{{ route('admin.live_class_batches.update', [
                    'board' => $board->slug,
                    'grade' => $grade->slug,
                    'batch' => $batch->id,
                ]) }}">
                @csrf
                @method('PUT')

                <input type="hidden" name="curriculum_subject_id" value="{{ $batch->curriculum_subject_id }}">

                <div class="row mb-3">

                    <div class="col-md-6">
                        <label class="form-label">Subject</label>
                        <div class="form-control-plaintext fw-semibold">
                            {{ $batch->curriculumSubject->name }}
                        </div>
                        <div class="form-text">
                            The subject can't be changed after a batch has been created.
                        </div>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Select Teacher</label>
                        <select name="teacher_id" class="form-control @error('teacher_id') is-invalid @enderror" required>
                            <option value="">Select Teacher</option>
                            @foreach ($teachers as $teacher)
                                <option
                                    value="{{ $teacher->id }}"
                                    {{ old('teacher_id', $batch->teacher_id) == $teacher->id ? 'selected' : '' }}>
                                    {{ $teacher->name }}
                                </option>
                            @endforeach
                        </select>
                        @error('teacher_id')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                </div>

                <div class="mb-3">
                    <label class="form-label">Batch Title</label>
                    <input type="text" name="title" class="form-control @error('title') is-invalid @enderror"
                        value="{{ old('title', $batch->title) }}" required>
                    @error('title')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>

                <div class="mb-3">
                    <label class="form-label">Description</label>
                    <textarea name="description" class="form-control @error('description') is-invalid @enderror" rows="3">{{ old('description', $batch->description) }}</textarea>
                    @error('description')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>

                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Price</label>
                        <input type="number" step="0.01" name="price"
                            class="form-control @error('price') is-invalid @enderror"
                            value="{{ old('price', $batch->price) }}">
                        @error('price')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Total Classes</label>
                        <input type="number" name="total_classes"
                            class="form-control @error('total_classes') is-invalid @enderror"
                            value="{{ old('total_classes', $batch->total_classes) }}" required>
                        @error('total_classes')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                </div>

                <div class="row mb-4">
                    <div class="col-md-6">
                        <label class="form-label">Start Date</label>
                        <input type="date" name="start_date"
                            class="form-control @error('start_date') is-invalid @enderror"
                            value="{{ old('start_date', $batch->start_date ? \Carbon\Carbon::parse($batch->start_date)->format('Y-m-d') : '') }}"
                            required>
                        @error('start_date')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">End Date</label>
                        <input type="date" name="end_date"
                            class="form-control @error('end_date') is-invalid @enderror"
                            value="{{ old('end_date', $batch->end_date ? \Carbon\Carbon::parse($batch->end_date)->format('Y-m-d') : '') }}"
                            required>
                        @error('end_date')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                </div>

                <button type="submit" class="btn btn-warning">
                    <i class="fas fa-save me-1"></i> Save Changes
                </button>

            </form>

        </div>
    </div>
</div>

@endsection
@extends('teacher.layout.app')

@section('title')
    {{ $batch->title }}
@endsection
@include('scripts.disable_submit_button')
@section('content')

    <div class="container">
        @include('teacher.layout.alerts')

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
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection
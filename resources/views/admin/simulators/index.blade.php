@extends('admin.layout.app')
@section('title')
    Simulators
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
            <h2 class="mb-0">Simulators</h2>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addSimulatorModal">
                <i class="bi bi-plus-lg me-1"></i> Add Simulator
            </button>
        </div>

        <div class="card-body">
            <table class="table table-bordered datatable">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Subject</th>
                        <th>Page</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    @forelse ($simulators as $simulator)
                        <tr>
                            <td>{{ $simulator->sort_order }}</td>
                            <td><strong>{{ $simulator->title }}</strong></td>
                            <td>{{ $simulator->subject->name ?? '-' }}</td>
                            <td>
                                @if ($simulator->page_path)
                                    <code>{{ \Illuminate\Support\Str::limit($simulator->page_path, 40) }}</code>
                                @else
                                    <span class="text-muted">Not set</span>
                                @endif
                            </td>
                            <td>
                                @if ($simulator->status === 'published')
                                    <span class="badge bg-success">Published</span>
                                @else
                                    <span class="badge bg-secondary">Draft</span>
                                @endif
                            </td>
                            <td>
                                <button type="button" class="btn btn-sm btn-outline-warning"
                                    data-bs-toggle="modal" data-bs-target="#editSimulatorModal{{ $simulator->id }}">
                                    Edit
                                </button>
                                <form action="{{ route('admin.simulators.destroy', $simulator->id) }}" method="POST" class="d-inline"
                                    onsubmit="return confirm('Delete this simulator?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-sm btn-outline-danger">Delete</button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="text-center text-muted">No simulators have been added yet.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

{{-- Add Simulator --}}
<div class="modal fade" id="addSimulatorModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="POST" action="{{ route('admin.simulators.store') }}" enctype="multipart/form-data">
                @csrf
                <div class="modal-header">
                    <h5 class="modal-title">Add Simulator</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    @include('admin.simulators.partials.form')
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Add Simulator</button>
                </div>
            </form>
        </div>
    </div>
</div>

{{-- Edit Simulator (one modal per row) --}}
@foreach ($simulators as $simulator)
    <div class="modal fade" id="editSimulatorModal{{ $simulator->id }}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form method="POST" action="{{ route('admin.simulators.update', $simulator->id) }}" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Simulator</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        @include('admin.simulators.partials.form', ['simulator' => $simulator])
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
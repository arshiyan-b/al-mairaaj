@extends('admin.layout.app')
@section('title')
    Teacher
@endsection
@include('scripts.table')
@section('content')

    <div class="container">
        @include('admin.layout.alerts')
        <div class="card">
            <div class="card-header">
                <h2>Teacher Page</h2>
            </div>
            <div class="card-body">
                <div class="table-responsive-wrapper" style="overflow-x: auto;">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>User Created</th>
                                <th>Status</th>
                                <th>View Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($teachers as $teacher)
                                <tr>
                                    <td>{{ $loop->iteration }}</td>
                                    <td>{{ $teacher->name }}</td>
                                    <td>{{ $teacher->user_created ? 'Yes' : 'No' }}</td>
                                    <td>{{ ucfirst($teacher->status) }}</td>
                                    <td>
                                        <a href="{{ route('admin.teachers.show', $teacher->id) }}" class="btn btn-sm btn-dark">
                                            View Details
                                        </a>

                                        @if ($teacher->user_created == 0)
                                            <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal"
                                                data-bs-target="#createUserModal{{ $teacher->id }}">
                                                Create User
                                            </button>
                                        @endif
                                    </td>
                                </tr>

                                <div class="modal fade" id="createUserModal{{ $teacher->id }}" tabindex="-1" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">

                                            <form action="{{ route('admin.teacher.create.user', $teacher->id) }}" method="POST">
                                                @csrf

                                                <div class="modal-header">
                                                    <h5 class="modal-title">Create User for {{ $teacher->name }}</h5>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                                </div>

                                                <div class="modal-body">

                                                    <div class="mb-3">
                                                        <label>Name</label>
                                                        <input type="text" name="name" class="form-control"
                                                            value="{{ $teacher->name }}" required>
                                                    </div>

                                                    <div class="mb-3">
                                                        <label>Email</label>
                                                        <input type="email" name="email" class="form-control"
                                                            value="{{ $teacher->email }}" required>
                                                    </div>

                                                    <div class="mb-3">
                                                        <label>Password</label>
                                                        <input type="password" name="password" class="form-control" required>
                                                    </div>

                                                </div>

                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                                        Close
                                                    </button>
                                                    <button type="submit" class="btn btn-primary">
                                                        Create User
                                                    </button>
                                                </div>

                                            </form>

                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>


@endsection
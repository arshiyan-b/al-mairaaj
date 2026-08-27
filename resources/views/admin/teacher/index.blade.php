@extends('admin.layout.app')
@section('title')
    Teacher
@endsection
@include('scripts.table')
@include('scripts.disable_submit_button')
@section('content')

    <div class="container">
        @include('admin.layout.alerts')
        <div class="card">
            <div class="card-header">
                <h2>Teacher Page</h2>
            </div>
            <div class="card-body">
                <div class="table-responsive-wrapper">
                    <table class="table table-bordered datatable">
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
                                        @elseif ($teacher->user_created == 1)
                                            <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal"
                                                data-bs-target="#resetPasswordModal{{ $teacher->id }}">
                                                Reset Password
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
                                                        <input type="text" name="password" class="form-control" required>
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

                                <div class="modal fade" id="resetPasswordModal{{ $teacher->id }}" tabindex="-1" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">

                                            <form action="{{ route('admin.teacher.reset.password', $teacher->id) }}" method="POST">
                                                @csrf

                                                <div class="modal-header">
                                                    <h5 class="modal-title">
                                                        Reset Password for {{ $teacher->name }}
                                                    </h5>

                                                    <button type="button"
                                                            class="btn-close"
                                                            data-bs-dismiss="modal"
                                                            aria-label="Close">
                                                    </button>
                                                </div>

                                                <div class="modal-body">

                                                    <div class="mb-3">
                                                        <label for="password{{ $teacher->id }}" class="form-label">
                                                            New Password
                                                        </label>

                                                        <input type="password"
                                                            name="password"
                                                            id="password{{ $teacher->id }}"
                                                            class="form-control"
                                                            required
                                                            minlength="8">

                                                        <small class="text-muted">
                                                            Password must be at least 8 characters.
                                                        </small>
                                                    </div>

                                                    <div class="mb-3">
                                                        <label for="password_confirmation{{ $teacher->id }}" class="form-label">
                                                            Confirm New Password
                                                        </label>

                                                        <input type="password"
                                                            name="password_confirmation"
                                                            id="password_confirmation{{ $teacher->id }}"
                                                            class="form-control"
                                                            required
                                                            minlength="8">
                                                    </div>

                                                </div>

                                                <div class="modal-footer">

                                                    <button type="button"
                                                            class="btn btn-secondary"
                                                            data-bs-dismiss="modal">
                                                        Close
                                                    </button>

                                                    <button type="submit"
                                                            class="btn btn-primary">
                                                        Reset Password
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
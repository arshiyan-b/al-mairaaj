@extends('admin.layout.app')
@section('title')
    Teacher
@endsection
@section('content')

    <div class="container">
        @include('admin.layout.alerts')
        <div class="card">
            <div class="card-header">
                <h2>Teachers Applications</h2>
            </div>
            <div class="card-body">
                <div class="table-responsive-wrapper" style="overflow-x: auto;">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Phone number</th>
                                <th>Email</th>
                                <th>CNIC number</th>
                                <th>View Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($teacherApplications as $application)
                                <tr>
                                    <td>{{ $application->id }}</td>
                                    <td>{{ $application->name }}</td>
                                    <td>{{ $application->phone_number }}</td>
                                    <td>{{ $application->email }}</td>
                                    <td>{{ $application->cnic }}</td>
                                    <td>
                                        <a href="{{ route('admin.teacher.application.show', ['application' => $application->id]) }}" class="btn btn-sm btn-dark">
                                            View Details
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
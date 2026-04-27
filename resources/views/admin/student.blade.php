@extends('admin.layout.app')
@section('title')
    Student
@endsection
@section('content')

    <div class="container">
        <div class="card">
            <div class="card-header">
                <h2>Welcome to Admin Dashboard - Student Page</h2>
            </div>
            <div class="card-body">
                <div class="table-responsive-wrapper" style="overflow-x: auto;">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Phone number</th>
                                <th>Email</th>
                                <th>CNIC number</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($studentList as $student)
                                <tr>
                                    <td>{{ $student->id }}</td>
                                    <td>{{ $student->first_name }}</td>
                                    <td>{{ $student->phone_number }}</td>
                                    <td>{{ $student->email }}</td>
                                    <td>{{ $student->cnic }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>


@endsection
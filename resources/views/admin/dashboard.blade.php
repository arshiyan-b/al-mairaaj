@extends('admin.layout.app')
@section('title')
    Dashboard
@endsection
@section('content')
<style>
    .card-body{
        padding: 15px;
    }
    .info-card{
        margin: 15px;
    }
    .row{
        border-bottom: 1px solid #ccc;
    }
</style>
    <div class="container">
        <div class="card">
            <div class="card-header">
                <h2>Welcome to Admin Dashboard</h2>

            </div>

            <div class="card-body">
                <div class="row">
                    <h3>General Details</h3>
                    <div class="col-md-4">
                        <div class="card info-card sales-card">
                            <div class="card-body">
                                <h5 class="card-title">Students Onboard</h5>
                                <h5 class="card-text">{{ $studentCount }}</h5>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card info-card sales-card">
                            <div class="card-body">
                                <h5 class="card-title">Teachers Onboard</h5>
                                <h5 class="card-text">{{ $teacherCount }}</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row my-4">
                    <h3>Recorded Courses</h3>
                    <div class="col-md-4">
                        <div class="card info-card sales-card">
                            <div class="card-body">
                                <h5 class="card-title">Total Courses</h5>
                                <h5 class="card-text">{{ $courseCount }}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
                
@endsection
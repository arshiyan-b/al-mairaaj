@extends('student.layout.app')

@section('title')
    Forgot Password
@endsection

@section('content')
    <div id="app"
        data-forgot-password-route="{{ route('forgot.password.submit') }}"
        data-csrf="{{ csrf_token() }}">
    </div>
@endsection
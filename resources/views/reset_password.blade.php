@extends('student.layout.app')

@section('title')
    Reset Password
@endsection

@section('content')
    <div id="app"
        data-verify-reset-otp-route="{{ route('verify.reset.password.otp') }}"
        data-reset-password-route="{{ route('update.reset.password') }}"
        data-email="{{ request()->query('email') }}"
        data-csrf="{{ csrf_token() }}">
    </div>
@endsection
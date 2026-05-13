@extends('student.layout.app')

@section('title')
    OTP
@endsection

@section('content')
    <div id="app" 
         data-email="{{ $email }}" 
         data-otp-verify-route="{{ route('otp.verify') }}"
         data-csrf="{{ csrf_token() }}">
    </div>
@endsection

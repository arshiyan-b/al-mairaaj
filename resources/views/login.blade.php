@extends('student.layout.app')

@section('title')
    Login
@endsection

@section('content')
    <div id="app" data-login-route="{{ route('login.auth') }}" data-csrf="{{ csrf_token() }}">
    </div>
@endsection
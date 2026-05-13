@extends('student.layout.app')

@section('title')
    Register
@endsection

@section('content')
    <div 
        id="app"
        data-register-route="{{ route('register.auth') }}"
        data-csrf="{{ csrf_token() }}">
    </div>

@endsection

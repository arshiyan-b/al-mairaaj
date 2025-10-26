@extends('student.layout.app')

@section('title')
    Dashboard
@endsection

@section('content')
    <div id="app" 
         data-user="{{ json_encode($user) }}"
         data-logout-route="{{ route('logout') }}"
         data-csrf="{{ csrf_token() }}">
    </div>
@endsection

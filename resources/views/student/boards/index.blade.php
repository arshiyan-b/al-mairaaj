@extends('student.layout.app')

@section('title')
    Boards
@endsection

@section('content')
    <div id="app" 
        data-user="{{ json_encode($user) }}">
    </div>
@endsection

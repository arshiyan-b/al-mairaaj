@extends('teacher.layout.app')
@section('title')
    {{ $course->title }}
@endsection
@section('content')

    <div class="container">
        @include('teacher.layout.alerts')

        
    </div>
@endsection
@extends('student.layout.app')

@section('title')
    Subjects
@endsection

@section('content')
    <div
        id="app"
        data-subjects="{{ $curriculum_subjects->toJson() }}"
        data-grades="{{ $grades->toJson() }}"
        data-boards="{{ $boards->toJson() }}"
    ></div>
@endsection
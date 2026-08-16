@extends('admin.layout.app')

@section('title')
    Books
@endsection

@include('scripts.disable_submit_button')
@include('scripts.table')

@section('content')

<div class="container">

    @include('admin.layout.alerts')
</div>

@endsection
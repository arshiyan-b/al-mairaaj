@extends('student.layout.app')

@section('title')
    Wallet
@endsection

@section('content')
    @if (session('success'))
        <script>
            window.__flash = { success: @json(session('success')) };
        </script>
    @endif
    <div id="app"></div>
@endsection
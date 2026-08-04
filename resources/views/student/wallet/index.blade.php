@extends('student.layout.app')

@section('title')
    Wallet
@endsection

@section('content')
    @if (session('success') || session('error'))
        <script>
            window.__flash = window.__flash || {};
            @if (session('success'))
                window.__flash.success = @json(session('success'));
            @endif
            @if (session('error'))
                window.__flash.error = @json(session('error'));
            @endif
        </script>
    @endif
    <div id="app"></div>
@endsection
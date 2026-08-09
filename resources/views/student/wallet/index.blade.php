@extends('student.layout.app')

@section('title')
    Wallet
@endsection

@section('content')
    @if (session('success') || session('error') || $errors->any())
        <script>
            window.__flash = window.__flash || {};
            @if (session('success'))
                window.__flash.success = @json(session('success'));
            @endif
            @if (session('error'))
                window.__flash.error = @json(session('error'));
            @endif
            @if ($errors->any())
                window.__flash.errors = @json($errors->toArray());
                window.__flash.old = @json(old());
            @endif
        </script>
    @endif
    <div id="app"></div>
@endsection
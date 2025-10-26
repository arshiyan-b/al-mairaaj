<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title') | Al Mairaaj</title>
    <link rel="icon" type="image/png" href="{{ asset('build/assets/book_logo.png') }}">
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/React-student/app.jsx'])
</head>
    <body>
        @yield('content')
    </body>
</html>

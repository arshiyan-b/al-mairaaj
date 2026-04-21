<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Al-Mairaaj</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/React-student/app.jsx'])
    <script>
        window.authUser = {!! json_encode(auth()->check() ? auth()->user() : null) !!};
        window.csrfToken = "{{ csrf_token() }}";
        window.logoutRoute = "{{ route('logout') }}";
    </script>
</head>

<body>
    <div id="app"></div>
</body>

</html>
<!DOCTYPE html>
<html lang="en">

@php
    $classes = $classes ?? collect();
@endphp

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title') | Al Mairaaj</title>
    <link rel="icon" type="image/png" href="{{ asset('build/assets/book_logo.png') }}">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://cdn.lineicons.com/4.0/lineicons.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">

    <style>
        body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
        }

        .wrapper {
            display: flex;
            min-height: 100vh;
        }

        #sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 75px;
            min-width: 75px;
            z-index: 1000;
            transition: all 0.62s ease-in-out;
            background-color: #000000;
            display: flex;
            flex-direction: column;
            max-height: 100vh;
            overflow-y: auto;
            overflow-x: hidden;
        }


        #sidebar.expand {
            width: 300px;
            min-width: 300px;
        }

        #sidebar.expand~.main {
            margin-left: 260px;
        }

        .main {
            flex: 1;
            background-color: #fafbfe;
            padding: 20px;
            margin-left: 5px;
            transition: all 0.35s ease-in-out;
            min-height: calc(100vh - 60px);
        }

        #sidebar.expand~.main {
            margin-left: 260px;
        }

        .toggle-btn {
            background-color: transparent;
            cursor: pointer;
            border: 0;
            padding: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .toggle-btn i {
            font-size: 1.5rem;
            color: #FFF;
        }

        .sidebar-logo {
            margin: auto 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFF;
        }

        #sidebar-heading {
            margin-top: 13px;
            font-size: 25px;
        }

        .sidebar-logo a {
            color: #FFF;
            font-size: 1.15rem;
            font-weight: 600;
        }

        #sidebar:not(.expand) .sidebar-logo,
        #sidebar:not(.expand) a.sidebar-link span {
            display: none;
        }

        .sidebar-nav {
            padding: 2rem 0;
            flex: 1;
        }

        a.sidebar-link {
            padding: .625rem 1.625rem;
            color: #FFF;
            display: block;
            font-size: 0.9rem;
            white-space: nowrap;
            border-left: 3px solid transparent;
            text-decoration: none;
        }

        .sidebar-link i {
            font-size: 1.1rem;
            margin-right: .75rem;
        }

        a.sidebar-link:hover {
            background-color: rgba(255, 255, 255, .075);
            border-left: 3px solid #008080;
        }

        .sidebar-item {
            position: relative;
        }

        #sidebar:not(.expand) .sidebar-item .sidebar-dropdown {
            position: absolute;
            top: 0;
            left: 70px;
            background-color: #00000;
            padding: 0;
            min-width: 15rem;
            display: none;
        }

        #sidebar.expand .sidebar-link[data-bs-toggle="collapse"]::after {
            border: solid;
            border-width: 0 .075rem .075rem 0;
            content: "";
            display: inline-block;
            padding: 2px;
            position: absolute;
            right: 1.5rem;
            top: 1.4rem;
            transform: rotate(-135deg);
            transition: all .2s ease-out;
        }

        #sidebar.expand .sidebar-link[data-bs-toggle="collapse"].collapsed::after {
            transform: rotate(45deg);
            transition: all .2s ease-out;
        }

        .sidebar-footer form {
            display: block;
            width: 100%;
        }

        .sidebar-footer button.sidebar-link {
            padding: .625rem 1.625rem;
            color: #FFF;
            display: block;
            font-size: 0.9rem;
            white-space: nowrap;
            border-left: 3px solid transparent;
            cursor: pointer;
        }

        #sidebar:not(.expand) .sidebar-footer span {
            display: none;
        }

        .sidebar-footer button.sidebar-link:hover {
            padding: .625rem 1.625rem;
            color: #FFF;
            display: flex;
            align-items: center;
            font-size: 0.9rem;
            white-space: nowrap;
            border-left: 3px solid transparent;
            cursor: pointer;
            width: 100%;
            text-align: left;
            background: transparent;
            border: 0;
        }

        .sidebar-dropdown .sidebar-item {
            padding-left: 20px;
        }

        .sidebar-dropdown .sidebar-dropdown .sidebar-item {
            padding-left: 30px;
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
            .main {
                margin-left: 45px;
            }

            #sidebar {
                width: 0;
            }

            #sidebar.expand {
                width: 200px;
            }
        }

        .form-control:focus,
        .form-control:hover {
            border-color: black !important;
            box-shadow: 0 0 0 0.25rem rgba(0, 128, 128, 0.52) !important;
        }
    </style>
    @push('styles')
</head>

<body>
    <div class="wrapper">
        <aside id="sidebar">
            <div class="d-flex">
                <button class="toggle-btn" type="button">
                    <img src="{{ asset('build/assets/book_logo.png') }}" alt="Icon" style="width: 36px; height: 36px;"
                        class="ms-2">
                </button>
                <div class="sidebar-logo">
                    <a id="sidebar-heading">
                        <img src="{{ asset('build/assets/AlMairaaj_logo.png') }}" alt="Al Mairaaj Logo"
                            style="width: 210px; height: 56px;" class="mt-2">
                    </a>
                </div>
            </div>
            <ul class="sidebar-nav">
                <li class="sidebar-item">
                    <a href="{{ route('teacher.dashboard') }}" class="sidebar-link">
                        <i class="bi bi-clipboard-data fs-4"></i>
                        <span class="fs-6">Dashboard</span>
                    </a>
                </li>

                <li class="sidebar-item">
                    <a href="#" class="sidebar-link">
                        <i class="bi bi-chat-square-text fs-4"></i>
                        <span class="fs-6">Announcements</span>
                    </a>
                </li>

                <li class="sidebar-item"> 
                    <a class="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse" data-bs-target="#live_class_batches" aria-expanded="false" aria-controls="live_class_batches">
                        <i class="bi bi-camera-video fs-4"></i>
                        <span class="fs-6">Live Class Batches</span>
                    </a>

                    <ul id="live_class_batches" class="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">

                        {{-- ================= P E A R S O N ================= --}}
                        @if ($classes->contains('board', 'pearson'))

                            <li class="sidebar-item">

                                <a class="sidebar-link collapsed has-dropdown"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#pearsonQualifications"
                                    aria-expanded="false">

                                    Pearson
                                </a>

                                <ul id="pearsonQualifications"
                                    class="sidebar-dropdown list-unstyled collapse"
                                    data-bs-parent="#classes">

                                    @if ($classes->contains(fn($c) => $c->board === 'pearson' && $c->grade === 'igcse'))
                                        <li class="sidebar-item">
                                            <a href="{{ route('teacher.live_class_batches.index', ['board' => 'pearson', 'grade' => 'igcse']) }}"
                                                class="sidebar-link">
                                                IGCSE
                                            </a>
                                        </li>
                                    @endif

                                    @if ($classes->contains(fn($c) => $c->board === 'pearson' && $c->grade === 'ial'))
                                        <li class="sidebar-item">
                                            <a href="{{ route('teacher.live_class_batches.index', ['board' => 'pearson', 'grade' => 'ial']) }}"
                                                class="sidebar-link">
                                                International A Level
                                            </a>
                                        </li>
                                    @endif

                                </ul>
                            </li>

                        @endif


                        {{-- ================= C A I E ================= --}}
                        @if ($classes->contains('board', 'caie'))

                            <li class="sidebar-item">

                                <a class="sidebar-link collapsed has-dropdown"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#caieQualifications"
                                    aria-expanded="false">

                                    CAIE
                                </a>

                                <ul id="caieQualifications"
                                    class="sidebar-dropdown list-unstyled collapse"
                                    data-bs-parent="#classes">

                                    @if ($classes->contains(fn($c) => $c->board === 'caie' && $c->grade === 'olevel'))
                                        <li class="sidebar-item">
                                            <a href="{{ route('teacher.live_class_batches.index', ['board' => 'caie', 'grade' => 'olevel']) }}"
                                                class="sidebar-link">
                                                O Level
                                            </a>
                                        </li>
                                    @endif

                                    @if ($classes->contains(fn($c) => $c->board === 'caie' && $c->grade === 'igcse'))
                                        <li class="sidebar-item">
                                            <a href="{{ route('teacher.live_class_batches.index', ['board' => 'caie', 'grade' => 'igcse']) }}"
                                                class="sidebar-link">
                                                IGCSE
                                            </a>
                                        </li>
                                    @endif

                                    @if ($classes->contains(fn($c) => $c->board === 'caie' && $c->grade === 'alevel'))
                                        <li class="sidebar-item">
                                            <a href="{{ route('teacher.live_class_batches.index', ['board' => 'caie', 'grade' => 'alevel']) }}"
                                                class="sidebar-link">
                                                A Level
                                            </a>
                                        </li>
                                    @endif

                                </ul>
                            </li>

                        @endif


                        {{-- ================= A K U - E B ================= --}}
                        @if ($classes->contains('board', 'akueb'))

                            <li class="sidebar-item">

                                <a class="sidebar-link collapsed has-dropdown"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#akuebQualifications"
                                    aria-expanded="false">

                                    AKU EB
                                </a>

                                <ul id="akuebQualifications"
                                    class="sidebar-dropdown list-unstyled collapse"
                                    data-bs-parent="#classes">

                                    @if ($classes->contains(fn($c) => $c->board === 'akueb' && $c->grade === 'ssc-i'))
                                        <li class="sidebar-item">
                                            <a href="{{ route('teacher.live_class_batches.index', ['board' => 'akueb', 'grade' => 'ssc-i']) }}" class="sidebar-link">
                                                SSC I
                                            </a>
                                        </li>
                                    @endif

                                    @if ($classes->contains(fn($c) => $c->board === 'akueb' && $c->grade === 'ssc-ii'))
                                        <li class="sidebar-item">
                                            <a href="{{ route('teacher.live_class_batches.index', ['board' => 'akueb', 'grade' => 'ssc-ii']) }}" class="sidebar-link">
                                                SSC II
                                            </a>
                                        </li>
                                    @endif

                                    @if ($classes->contains(fn($c) => $c->board === 'akueb' && $c->grade === 'hssc-i'))
                                        <li class="sidebar-item">
                                            <a href="{{ route('teacher.live_class_batches.index', ['board' => 'akueb', 'grade' => 'hssc-i']) }}" class="sidebar-link">
                                                HSSC I
                                            </a>
                                        </li>
                                    @endif

                                    @if ($classes->contains(fn($c) => $c->board === 'akueb' && $c->grade === 'hssc-ii'))
                                        <li class="sidebar-item">
                                            <a href="{{ route('teacher.live_class_batches.index', ['board' => 'akueb', 'grade' => 'hssc-ii']) }}" class="sidebar-link">
                                                HSSC II
                                            </a>
                                        </li>
                                    @endif

                                </ul>
                            </li>

                        @endif


                        {{-- ================= I N T E R M E D I A T E ================= --}}
                        @if ($classes->contains('board', 'intermediate'))

                            <li class="sidebar-item">

                                <a class="sidebar-link collapsed has-dropdown"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#intermediateQualifications"
                                    aria-expanded="false">

                                    Intermediate
                                </a>

                                <ul id="intermediateQualifications"
                                    class="sidebar-dropdown list-unstyled collapse"
                                    data-bs-parent="#classes">

                                    @if ($classes->contains(fn($c) => $c->board === 'intermediate' && $c->grade === 'x-i'))
                                        <li class="sidebar-item">
                                            <a href="{{ route('teacher.live_class_batches.index', ['board' => 'intermediate', 'grade' => 'x-i']) }}" class="sidebar-link">
                                                X-I
                                            </a>
                                        </li>
                                    @endif

                                    @if ($classes->contains(fn($c) => $c->board === 'intermediate' && $c->grade === 'x-ii'))
                                        <li class="sidebar-item">
                                            <a href="{{ route('teacher.live_class_batches.index', ['board' => 'intermediate', 'grade' => 'x-ii']) }}" class="sidebar-link">
                                                X-II
                                            </a>
                                        </li>
                                    @endif

                                </ul>
                            </li>

                        @endif

                    </ul>
                </li>
            </ul>
            <div class="sidebar-footer">
                <form method="POST" action="{{ route('logout') }}" id="logout-form" class="w-100">
                    @csrf
                    <button type="submit" class="sidebar-link w-100 text-start border-0 bg-transparent text-white">
                        <i class="lni lni-exit"></i>
                        <span class="fs-6">Logout</span>
                    </button>
                </form>
            </div>
        </aside>

        <main class="main">
            @yield('content')
        </main>

    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe"
        crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', function () {

            // Sidebar toggle
            const hamBurger = document.querySelector(".toggle-btn");

            if (hamBurger) {
                hamBurger.addEventListener("click", function () {
                    document.querySelector("#sidebar").classList.toggle("expand");
                });
            }

            // Collapse siblings
            const allToggles = document.querySelectorAll('[data-bs-toggle="collapse"]');

            allToggles.forEach(toggle => {
                toggle.addEventListener('click', function () {
                    const targetId = this.getAttribute('data-bs-target');
                    const parentUl = this.closest('ul');

                    if (parentUl) {
                        const allDropdowns = parentUl.querySelectorAll('.collapse');

                        allDropdowns.forEach(dropdown => {
                            if (dropdown.id !== targetId.replace('#', '')) {
                                new bootstrap.Collapse(dropdown, {
                                    toggle: false
                                }).hide();
                            }
                        });
                    }
                });
            });

        });
    </script>
@stack('scripts')
</body>

</html>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title') | Al Mairaaj</title>
    <link rel="icon" type="image/png" href="{{ asset('images/book_logo.png') }}">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://cdn.lineicons.com/4.0/lineicons.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">

        <!-- Select2 CSS -->
        <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />

        <!-- jQuery -->
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

        <!-- Select2 JS -->
        <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <style>
        :root {
            --brand-teal: #0d6d72;
            --brand-teal-dark: #094f53;
            --brand-ink: #1f2429;
            --sidebar-width-collapsed: 76px;
            --sidebar-width-expanded: 280px;
        }

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
            width: var(--sidebar-width-collapsed);
            min-width: var(--sidebar-width-collapsed);
            z-index: 1040;
            transition: width 0.3s ease-in-out, min-width 0.3s ease-in-out, transform 0.3s ease-in-out;
            background-color: #000000;
            box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
            display: flex;
            flex-direction: column;
            max-height: 100vh;
            overflow-y: auto;
            overflow-x: hidden;
        }

        #sidebar.expand {
            width: var(--sidebar-width-expanded);
            min-width: var(--sidebar-width-expanded);
        }

        #sidebar.expand ~ .main {
            margin-left: var(--sidebar-width-expanded);
        }

        .main {
            flex: 1;
            background-color: #fafbfe;
            padding: 24px;
            margin-left: var(--sidebar-width-collapsed);
            transition: margin-left 0.3s ease-in-out;
            min-height: 100vh;
            width: 100%;
        }

        .sidebar-header {
            display: flex;
            align-items: center;
            min-height: 68px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            flex-shrink: 0;
        }

        .toggle-btn {
            background-color: transparent;
            cursor: pointer;
            border: 0;
            padding: 0.9rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .toggle-btn img {
            width: 34px;
            height: auto;
            display: block;
        }

        .toggle-btn i {
            font-size: 1.5rem;
            color: #FFF;
        }

        .sidebar-logo {
            display: flex;
            align-items: center;
            overflow: hidden;
        }

        .sidebar-logo img {
            height: 30px;
            width: auto;
            display: block;
        }

        #sidebar:not(.expand) .sidebar-logo,
        #sidebar:not(.expand) a.sidebar-link span {
            display: none;
        }

        .sidebar-nav {
            padding: 1.25rem 0;
            flex: 1;
        }

        a.sidebar-link {
            padding: .7rem 1.625rem;
            color: rgba(255, 255, 255, 0.85);
            display: flex;
            align-items: center;
            font-size: 0.9rem;
            white-space: nowrap;
            border-left: 3px solid transparent;
            text-decoration: none;
            border-radius: 0 6px 6px 0;
            margin: 2px 6px 2px 0;
            transition: background-color 0.15s ease, color 0.15s ease;
        }

        .sidebar-link i {
            font-size: 1.1rem;
            margin-right: .75rem;
            flex-shrink: 0;
            width: 1.3rem;
            text-align: center;
        }

        a.sidebar-link:hover,
        a.sidebar-link.active {
            background-color: rgba(13, 109, 114, 0.35);
            border-left: 3px solid var(--brand-teal);
            color: #FFF;
        }

        .sidebar-item {
            position: relative;
        }

        #sidebar:not(.expand) .sidebar-item .sidebar-dropdown {
            position: absolute;
            top: 0;
            left: var(--sidebar-width-collapsed);
            background-color: #111417;
            border-radius: 0 8px 8px 0;
            box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.35);
            padding: 0.5rem 0;
            min-width: 15rem;
            display: none;
        }

        #sidebar.expand .sidebar-link[data-bs-toggle="collapse"]::after {
            border: solid;
            border-width: 0 .075rem .075rem 0;
            content: "";
            display: inline-block;
            padding: 2px;
            margin-left: auto;
            transform: rotate(-135deg);
            transition: all .2s ease-out;
        }

        #sidebar.expand .sidebar-link[data-bs-toggle="collapse"].collapsed::after {
            transform: rotate(45deg);
            transition: all .2s ease-out;
        }

        .sidebar-footer {
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            flex-shrink: 0;
        }

        .sidebar-footer form {
            display: block;
            width: 100%;
        }

        .sidebar-footer button.sidebar-link {
            padding: .75rem 1.625rem;
            color: rgba(255, 255, 255, 0.85);
            display: flex;
            align-items: center;
            font-size: 0.9rem;
            white-space: nowrap;
            border-left: 3px solid transparent;
            cursor: pointer;
            width: 100%;
            text-align: left;
            background: transparent;
            border-top: none;
            border-right: none;
            border-bottom: none;
        }

        #sidebar:not(.expand) .sidebar-footer span {
            display: none;
        }

        .sidebar-footer button.sidebar-link:hover {
            background-color: rgba(220, 53, 69, 0.25);
            border-left: 3px solid #dc3545;
            color: #FFF;
        }

        .sidebar-dropdown .sidebar-item {
            padding-left: 20px;
        }

        .sidebar-dropdown .sidebar-dropdown .sidebar-item {
            padding-left: 30px;
        }

        /* Mobile top bar - only shown on small screens so the menu toggle
           is always reachable, even while the drawer itself is closed. */
        .mobile-topbar {
            display: none;
        }

        .sidebar-backdrop {
            display: none;
        }

        /* Mobile Responsiveness */
        @media (max-width: 991.98px) {
            .mobile-topbar {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                position: sticky;
                top: 0;
                z-index: 1030;
                background-color: #000000;
                color: #fff;
                padding: 0.75rem 1rem;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
            }

            .mobile-topbar img {
                height: 26px;
                width: auto;
            }

            .mobile-topbar .mobile-toggle-btn {
                background: transparent;
                border: 0;
                color: #fff;
                font-size: 1.5rem;
                display: flex;
                align-items: center;
                padding: 0.25rem 0.5rem;
            }

            .main {
                margin-left: 0;
            }

            #sidebar {
                transform: translateX(-100%);
                width: var(--sidebar-width-expanded);
                min-width: var(--sidebar-width-expanded);
                box-shadow: 4px 0 20px rgba(0, 0, 0, 0.4);
            }

            #sidebar.expand {
                transform: translateX(0);
            }

            /* On mobile the drawer is always full/expanded once opened,
               so the logo and link labels should always show. */
            #sidebar .sidebar-logo,
            #sidebar a.sidebar-link span {
                display: flex !important;
            }

            #sidebar.expand ~ .main {
                margin-left: 0;
            }

            .sidebar-header .toggle-btn {
                display: none;
            }

            .sidebar-backdrop.show {
                display: block;
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1035;
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

    <div class="mobile-topbar">
        <button class="mobile-toggle-btn" type="button" aria-label="Open menu">
            <i class="bi bi-list"></i>
        </button>
        <img src="{{ asset('images/AlMairaaj_logo.png') }}" alt="Al Mairaaj">
    </div>

    <div class="sidebar-backdrop"></div>

    <div class="wrapper">
        <aside id="sidebar">
            <div class="sidebar-header d-flex">
                <button class="toggle-btn" type="button" aria-label="Toggle sidebar">
                    <img src="{{ asset('images/book_logo.png') }}" alt="Al Mairaaj">
                </button>
                <div class="sidebar-logo">
                    <a id="sidebar-heading" href="{{ route('admin.dashboard') }}">
                        <img src="{{ asset('images/AlMairaaj_logo.png') }}" alt="Al Mairaaj Logo">
                    </a>
                </div>
            </div>
            <ul class="sidebar-nav">
                <li class="sidebar-item">
                    <a href="{{ route('admin.dashboard') }}" class="sidebar-link {{ request()->routeIs('admin.dashboard') ? 'active' : '' }}">
                        <i class="bi bi-clipboard-data fs-4"></i>
                        <span class="fs-6">Dashboard</span>
                    </a>
                </li>
                <li class="sidebar-item">
                    <a href="{{ route('admin.student') }}" class="sidebar-link {{ request()->routeIs('admin.student') ? 'active' : '' }}">
                        <i class="bi bi-person fs-4"></i>
                        <span class="fs-6">Student</span>
                    </a>
                </li>

                <li class="sidebar-item">
                    <a class="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse"
                        data-bs-target="#teachers" aria-expanded="false" aria-controls="teachers">
                        <i class="bi bi-backpack fs-4"></i>
                        <span class="fs-6">Teacher</span>
                    </a>

                    <ul id="teachers" class="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">

                        <li class="sidebar-item">
                            <a href="{{ route('admin.teacher.applications') }}"
                                class="sidebar-link {{ request()->routeIs('admin.teacher.applications*') ? 'active' : '' }}">Teacher Applications
                            </a>
                        </li>

                        <li class="sidebar-item">
                            <a href="{{ route('admin.teacher.index') }}"
                                class="sidebar-link {{ request()->routeIs('admin.teacher.index') || request()->routeIs('admin.teachers.*') ? 'active' : '' }}">Teachers List
                            </a>
                        </li>

                    </ul>
                </li>

                <li class="sidebar-item">
                    <a href="{{ route('admin.books.index') }}" class="sidebar-link {{ request()->routeIs('admin.books.*') ? 'active' : '' }}">
                        <i class="bi bi-person fs-4"></i>
                        <span class="fs-6">Books</span>
                    </a>
                </li>
                
                <li class="sidebar-item">
                    <a href="{{ route('admin.courses.index') }}" class="sidebar-link">
                        <i class="bi bi-camera-video fs-4"></i>
                        <span class="fs-6">Recorded Courses</span>
                    </a>
                </li>

                <li class="sidebar-item">
                    <a href="{{ route('admin.simulators.index') }}" class="sidebar-link">
                        <i class="bi bi-lightning-charge fs-4"></i>
                        <span class="fs-6">Simulators</span>
                    </a>
                </li>

                <li class="sidebar-item">
                    <a class="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse" data-bs-target="#liveClassBatches"
                        aria-expanded="false" aria-controls="liveClassBatches">
                        <i class="bi bi-play-circle fs-4"></i>
                        <span class="fs-6">Live Class Batches</span>
                    </a>
                    <ul id="liveClassBatches" class="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                        @foreach ($boards as $board)
                            <li class="sidebar-item">
                                <a class="sidebar-link collapsed" data-bs-toggle="collapse"
                                    data-bs-target="#{{ $board->slug }}LiveGrades" aria-expanded="false"
                                    aria-controls="{{ $board->slug }}LiveGrades">
                                    {{ $board->name }}
                                </a>
                                <ul id="{{ $board->slug }}LiveGrades" class="sidebar-dropdown list-unstyled collapse">
                                    @foreach ($board->grades as $grade)
                                        <li class="sidebar-item">
                                            <a href="{{ route('admin.live_class_batches.index', ['board' => $board->slug, 'grade' => $grade->slug]) }}"
                                                class="sidebar-link">{{ $grade->name }}</a>
                                        </li>
                                    @endforeach
                                </ul>
                            </li>
                        @endforeach
                    </ul>
                </li>

                <li class="sidebar-item">
                    <a class="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse"
                        data-bs-target="#wallets" aria-expanded="false" aria-controls="wallets">
                        <i class="bi bi-backpack fs-4"></i>
                        <span class="fs-6">Wallets</span>
                    </a>

                    <ul id="wallets" class="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">

                        <li class="sidebar-item">
                            <a href="{{ route('admin.wallet.index') }}"
                                class="sidebar-link">Student Wallets
                            </a>
                        </li>

                        <li class="sidebar-item">
                            <a href="{{ route('admin.top-up.requests') }}"
                                class="sidebar-link">Top-up Requests
                            </a>
                        </li>

                        <li class="sidebar-item">
                            <a href="{{ route('admin.vouchers.index') }}"
                                class="sidebar-link">Vouchers
                            </a>
                        </li>

                    </ul>
                </li>

                <li class="sidebar-item">
                    <a href="#" class="sidebar-link">
                        <i class="bi bi-chat-square-text fs-4"></i>
                        <span class="fs-6">Announcements</span>
                    </a>
                </li>

            </ul>
            <div class="sidebar-footer">
                <form method="POST" action="{{ route('admin.logout') }}" id="logout-form" class="w-100">
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
        const sidebar = document.querySelector("#sidebar");
        const hamBurger = document.querySelector(".toggle-btn");
        const mobileToggle = document.querySelector(".mobile-toggle-btn");
        const backdrop = document.querySelector(".sidebar-backdrop");

        function openSidebar() {
            sidebar.classList.add("expand");
            if (window.innerWidth < 992) {
                backdrop.classList.add("show");
            }
        }

        function closeSidebar() {
            sidebar.classList.remove("expand");
            backdrop.classList.remove("show");
        }

        hamBurger.addEventListener("click", function () {
            sidebar.classList.contains("expand") ? closeSidebar() : openSidebar();
        });

        mobileToggle.addEventListener("click", function () {
            sidebar.classList.contains("expand") ? closeSidebar() : openSidebar();
        });

        backdrop.addEventListener("click", closeSidebar);

        // If the viewport is resized from mobile to desktop (or back) while
        // the drawer is open, drop the mobile-only backdrop state so it
        // doesn't linger incorrectly.
        window.addEventListener("resize", function () {
            if (window.innerWidth >= 992) {
                backdrop.classList.remove("show");
            }
        });

        document.addEventListener('DOMContentLoaded', function () {
            // Collapse all siblings when a dropdown is opened
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

        $('#sidebar').on('transitionend', function () {
            if (!$(this).hasClass('expand')) {
                $('#sidebar .collapse.show').each(function () {
                    const collapseInstance = bootstrap.Collapse.getOrCreateInstance(this);
                    collapseInstance.hide();
                });
            }
        });

        document.addEventListener("DOMContentLoaded", function() {

        const sidebarLinks = document.querySelectorAll('.sidebar-link.collapsed.has-dropdown');

        sidebarLinks.forEach(link => {
                link.addEventListener('click', function(event) {
                    if (window.innerWidth >= 992 && !sidebar.classList.contains('expand')) {
                        sidebar.classList.add('expand');
                    }
                });
            });
        });

    </script>
@stack('scripts')
</body>

</html>
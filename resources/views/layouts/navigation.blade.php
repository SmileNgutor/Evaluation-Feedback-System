<!-- Mobile Toggle Button -->
<div class="lg:hidden py-4 px-6 fixed top-0 left-0 z-50 bg-white w-full shadow-md">
    <button type="button" class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-gray-800 border border-gray-800 text-white text-sm font-medium rounded-lg shadow-2xs align-middle hover:bg-gray-950 focus:outline-none focus:bg-gray-900" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-sidebar-footer" aria-label="Toggle navigation" data-hs-overlay="#hs-sidebar-footer">
        Open Sidebar
    </button>
</div>

<!-- Sidebar Container -->
<div id="hs-sidebar-footer" class="hs-overlay [--auto-close:lg] lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 w-64
    hs-overlay-open:translate-x-0
    -translate-x-full transition-all duration-300 transform
    h-full
    fixed top-0 start-0 bottom-0 z-[60]
    bg-white border-e border-gray-200" role="dialog" tabindex="-1" aria-label="Sidebar">
    <div class="relative flex flex-col h-full max-h-full">
        <!-- Header with logo and close button -->
        <header class="p-4 flex justify-between items-center gap-x-2">
            <a href="{{ route('dashboard') }}" class="flex-none focus:outline-none focus:opacity-80" aria-label="Brand">
                <x-application-logo class="block h-9 w-auto fill-current text-gray-800" />
            </a>

            <div class="lg:hidden -me-2">
                <button type="button" class="flex justify-center items-center gap-x-3 size-6 bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-sidebar-footer">
                    <i data-lucide="x" class="size-4"></i>
                    <span class="sr-only">Close</span>
                </button>
            </div>
        </header>

        <!-- Main Navigation Content -->
        <nav class="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
            <div class="pb-0 px-2 w-full flex flex-col flex-wrap">
                <ul class="space-y-1">
                    <!-- Dashboard -->
                    <li>
                        <a class="flex items-center gap-x-3 py-2 px-2.5 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                           {{ request()->routeIs('dashboard') ? 'bg-gray-100 text-gray-800' : 'text-gray-800' }}"
                           href="{{ route('dashboard') }}">
                            <i data-lucide="home" class="size-4"></i>
                            {{ __('Dashboard') }}
                        </a>
                    </li>

                    <!-- Student Section -->
                    <li>
                        <h3 class="mt-6 mb-2 px-2.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                            Student Portal
                        </h3>
                        <ul class="space-y-1">
                            <li>
                                <a class="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                                   {{ request()->routeIs('itsupport-student') ? 'bg-gray-100 text-gray-800' : 'text-gray-800' }}"
                                   href="{{ route('itsupport-student') }}">
                                    <i data-lucide="hard-drive" class="size-4"></i>
                                    IT Support
                                </a>
                            </li>
                            <li>
                                <a class="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                                   {{ request()->routeIs('course.evaluation') ? 'bg-gray-100 text-gray-800' : 'text-gray-800' }}"
                                   href="{{ route('course.evaluation') }}">
                                    <i data-lucide="clipboard-list" class="size-4"></i>
                                    Course Evaluation
                                </a>
                            </li>
                            <li>
                                <a class="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                                   {{ request()->routeIs('cafeteria-student') ? 'bg-gray-100 text-gray-800' : 'text-gray-800' }}"
                                   href="{{ route('cafeteria-student') }}">
                                    <i data-lucide="utensils" class="size-4"></i>
                                    Cafeteria Feedback
                                </a>
                            </li>
                            <li>
                                <a class="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                                   {{ request()->routeIs('class-student') ? 'bg-gray-100 text-gray-800' : 'text-gray-800' }}"
                                   href="{{ route('class-student') }}">
                                    <i data-lucide="tool" class="size-4"></i>
                                    Maintenance
                                </a>
                            </li>
                        </ul>
                    </li>

                    <!-- Faculty Section -->
                    <li>
                        <h3 class="mt-6 mb-2 px-2.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                            Faculty Portal
                        </h3>
                        <ul class="space-y-1">
                            <li>
                                <a class="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                                   {{ request()->is('faculty/course-evaluations') ? 'bg-gray-100 text-gray-800' : 'text-gray-800' }}"
                                   href="/faculty/course-evaluations">
                                    <i data-lucide="bar-chart-2" class="size-4"></i>
                                    Course Feedback
                                </a>
                            </li>
                            <li>
                                <a class="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                                   {{ request()->is('faculty/it-support') ? 'bg-gray-100 text-gray-800' : 'text-gray-800' }}"
                                   href="/faculty/it-support">
                                    <i data-lucide="cpu" class="size-4"></i>
                                    IT Support
                                </a>
                            </li>
                            <li>
                                <a class="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                                   {{ request()->is('faculty/cafeteria-feedback') ? 'bg-gray-100 text-gray-800' : 'text-gray-800' }}"
                                   href="/faculty/cafeteria-feedback">
                                    <i data-lucide="coffee" class="size-4"></i>
                                    Cafeteria Feedback
                                </a>
                            </li>
                            <li>
                                <a class="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                                   {{ request()->is('faculty/maintenance') ? 'bg-gray-100 text-gray-800' : 'text-gray-800' }}"
                                   href="/faculty/maintenance">
                                    <i data-lucide="wrench" class="size-4"></i>
                                    Maintenance
                                </a>
                            </li>
                        </ul>
                    </li>

                    <!-- Admin Section -->
                    <li>
                        <h3 class="mt-6 mb-2 px-2.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                            Admin Portal
                        </h3>
                        <ul class="space-y-1">
                            <li>
                                <a class="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                                   {{ request()->routeIs('itsupport') ? 'bg-gray-100 text-gray-800' : 'text-gray-800' }}"
                                   href="{{ route('itsupport') }}">
                                    <i data-lucide="clipboard-check" class="size-4"></i>
                                    All Feedback
                                </a>
                            </li>
                            <li>
                                <a class="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                                   {{ request()->is('admin/manage-tickets') ? 'bg-gray-100 text-gray-800' : 'text-gray-800' }}"
                                   href="/admin/manage-tickets">
                                    <i data-lucide="ticket" class="size-4"></i>
                                    Manage Tickets
                                </a>
                            </li>
                            <li>
                                <a class="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                                   {{ request()->is('admin/reports-analytics') ? 'bg-gray-100 text-gray-800' : 'text-gray-800' }}"
                                   href="/admin/reports-analytics">
                                    <i data-lucide="line-chart" class="size-4"></i>
                                    Reports & Analytics
                                </a>
                            </li>
                            <li>
                                <a class="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                                   {{ request()->is('user-management') ? 'bg-gray-100 text-gray-800' : 'text-gray-800' }}"
                                   href="{{route('user-management')}}">
                                    <i data-lucide="users" class="size-4"></i>
                                    User Management
                                </a>
                            </li>
                        </ul>
                    </li>

                    <!-- Staff Section -->
                    <li>
                        <h3 class="mt-6 mb-2 px-2.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                            Staff Portal
                        </h3>
                        <ul class="space-y-1">
                            <li>
                                <a class="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                                   {{ request()->is('staff/assigned-tasks') ? 'bg-gray-100 text-gray-800' : 'text-gray-800' }}"
                                   href="/staff/assigned-tasks">
                                    <i data-lucide="list-checks" class="size-4"></i>
                                    Assigned Tasks
                                </a>
                            </li>
                            <li>
                                <a class="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                                   {{ request()->is('staff/update-status') ? 'bg-gray-100 text-gray-800' : 'text-gray-800' }}"
                                   href="/staff/update-status">
                                    <i data-lucide="check-circle" class="size-4"></i>
                                    Update Status
                                </a>
                            </li>
                            <li>
                                <a class="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                                   {{ request()->is('staff/feedback-review') ? 'bg-gray-100 text-gray-800' : 'text-gray-800' }}"
                                   href="/staff/feedback-review">
                                    <i data-lucide="star" class="size-4"></i>
                                    Performance Feedback
                                </a>
                            </li>
                            <li>
                                <a class="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                                   {{ request()->is('staff/cafeteria-dashboard') ? 'bg-gray-100 text-gray-800' : 'text-gray-800' }}"
                                   href="/staff/cafeteria-dashboard">
                                    <i data-lucide="utensils-crossed" class="size-4"></i>
                                    Cafeteria Dashboard
                                </a>
                            </li>
                        </ul>
                    </li>

                    <!-- General Section -->
                    <li>
                        <h3 class="mt-6 mb-2 px-2.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                            General
                        </h3>
                        <ul class="space-y-1">
                            <li>
                                <a class="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                                   {{ request()->is('notifications') ? 'bg-gray-100 text-gray-800' : 'text-gray-800' }}"
                                   href="{{ url('/notifications') }}">
                                    <i data-lucide="bell" class="size-4"></i>
                                    Notifications
                                </a>
                            </li>
                            <li>
                                <a class="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                                   {{ request()->is('calendar') ? 'bg-gray-100 text-gray-800' : 'text-gray-800' }}"
                                   href="{{ url('/calendar') }}">
                                    <i data-lucide="calendar" class="size-4"></i>
                                    Calendar
                                </a>
                            </li>
                            <li>
                                <a class="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                                   {{ request()->is('documentation') ? 'bg-gray-100 text-gray-800' : 'text-gray-800' }}"
                                   href="{{ url('/documentation') }}">
                                    <i data-lucide="file-text" class="size-4"></i>
                                    Documentation
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>

        <!-- Footer with User Section -->
        <footer class="mt-auto p-2 border-t border-gray-200">
            <div class="px-2 py-4">
                @auth
                    <div class="flex items-center gap-x-3.5 mb-2">
                        <img class="shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1734122415415-88cb1d7d5dc0?q=80&w=320&h=320&auto=format&fit=facearea&facepad=3&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Avatar">
                        <div>
                            <div class="font-medium text-base text-gray-800">{{ Auth::user()->name }}</div>
                        </div>
                    </div>

                    <a class="flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                       href="{{ route('profile.edit') }}">
                        <i data-lucide="user" class="size-4"></i>
                        {{ __('Profile') }}
                    </a>

                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="w-full flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
                            <i data-lucide="log-out" class="size-4"></i>
                            {{ __('Log Out') }}
                        </button>
                    </form>
                @endauth
            </div>
        </footer>
    </div>
</div>

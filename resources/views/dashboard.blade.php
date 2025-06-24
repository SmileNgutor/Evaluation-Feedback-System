<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <!-- Student Dashboard -->
                    <section class="mb-12">
                        <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Student Dashboard</h2>
                        <div class="w-full p-6 card-container">
                            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <a href="{{route("itsupport-student")}}" class="group block rounded-xl bg-white p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-400 transition-all duration-200 overflow-visible">
                                    <div class="mx-auto flex h-16 w-16 -translate-y-8 transform items-center justify-center rounded-full bg-blue-600 shadow-lg shadow-blue-500/30 transition-transform duration-200">
                                        <!-- IT Support Icon -->
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                        </svg>
                                    </div>
                                    <h2 class="mb-3 text-xl font-semibold text-gray-800">IT Support</h2>
                                    <p class="text-sm text-gray-600 mt-2">Get help with your technical issues, from Wi-Fi to software problems.</p>
                                    <span class="mt-4 inline-block text-sm font-medium text-blue-600 group-hover:underline">View Tickets →</span>
                                </a>

                                <a href="{{route('course.evaluation')}}" class="group block rounded-xl bg-white p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl hover:border-green-400 transition-all duration-200 overflow-visible">
                                    <div class="mx-auto flex h-16 w-16 -translate-y-8 transform items-center justify-center rounded-full bg-green-600 shadow-lg shadow-green-500/30 transition-transform duration-200">
                                        <!-- Course Evaluation Icon -->
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h2 class="mb-3 text-xl font-semibold text-gray-800">Course Evaluation</h2>
                                    <p class="text-sm text-gray-600 mt-2">Share your anonymous feedback on courses to help improve learning experiences.</p>
                                    <span class="mt-4 inline-block text-sm font-medium text-green-600 group-hover:underline">Give Feedback →</span>
                                </a>

                                <a href="/cafeteria-feedback" class="group block rounded-xl bg-white p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl hover:border-orange-400 transition-all duration-200 overflow-visible">
                                    <div class="mx-auto flex h-16 w-16 -translate-y-8 transform items-center justify-center rounded-full bg-orange-500 shadow-lg shadow-orange-500/30 transition-transform duration-200">
                                        <!-- Cafeteria Services Icon -->
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 class="mb-3 text-xl font-semibold text-gray-800">Cafeteria Services</h2>
                                    <p class="text-sm text-gray-600 mt-2">Provide feedback on the cafeteria food and service to help us serve you better.</p>
                                    <span class="mt-4 inline-block text-sm font-medium text-orange-600 group-hover:underline">Rate Service →</span>
                                </a>

                                <a href="/maintenance" class="group block rounded-xl bg-white p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl hover:border-purple-400 transition-all duration-200 overflow-visible">
                                    <div class="mx-auto flex h-16 w-16 -translate-y-8 transform items-center justify-center rounded-full bg-purple-600 shadow-lg shadow-purple-500/30 transition-transform duration-200">
                                        <!-- Classroom Maintenance Icon -->
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <h2 class="mb-3 text-xl font-semibold text-gray-800">Classroom Maintenance</h2>
                                    <p class="text-sm text-gray-600 mt-2">Report any issues with classroom facilities, from broken chairs to faulty projectors.</p>
                                    <span class="mt-4 inline-block text-sm font-medium text-purple-600 group-hover:underline">Report Issue →</span>
                                </a>
                            </div>
                        </div>
                    </section>

                    <!-- Faculty Dashboard -->
                    <section class="mb-12">
                        <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Faculty Dashboard</h2>
                        <div class="w-full p-6 card-container">
                            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <a href="/faculty/course-evaluations" class="group block rounded-xl bg-white p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl hover:border-green-400 transition-all duration-200 overflow-visible">
                                    <div class="mx-auto flex h-16 w-16 -translate-y-8 transform items-center justify-center rounded-full bg-green-600 shadow-lg shadow-green-500/30 transition-transform duration-200">
                                        <!-- Course Evaluations Icon -->
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h2 class="mb-3 text-xl font-semibold text-gray-800">Course Evaluations</h2>
                                    <p class="text-sm text-gray-600 mt-2">View aggregated student feedback and trends for your courses.</p>
                                    <span class="mt-4 inline-block text-sm font-medium text-green-600 group-hover:underline">View Reports →</span>
                                </a>

                                <a href="/faculty/it-support" class="group block rounded-xl bg-white p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-400 transition-all duration-200 overflow-visible">
                                    <div class="mx-auto flex h-16 w-16 -translate-y-8 transform items-center justify-center rounded-full bg-blue-600 shadow-lg shadow-blue-500/30 transition-transform duration-200">
                                        <!-- IT Support Icon -->
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                        </svg>
                                    </div>
                                    <h2 class="mb-3 text-xl font-semibold text-gray-800">IT Support</h2>
                                    <p class="text-sm text-gray-600 mt-2">Submit tickets for technical issues and track their resolution status.</p>
                                    <span class="mt-4 inline-block text-sm font-medium text-blue-600 group-hover:underline">Submit Ticket →</span>
                                </a>

                                <a href="/faculty/cafeteria-feedback" class="group block rounded-xl bg-white p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl hover:border-orange-400 transition-all duration-200 overflow-visible">
                                    <div class="mx-auto flex h-16 w-16 -translate-y-8 transform items-center justify-center rounded-full bg-orange-500 shadow-lg shadow-orange-500/30 transition-transform duration-200">
                                        <!-- Cafeteria Services Icon -->
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 class="mb-3 text-xl font-semibold text-gray-800">Cafeteria Feedback</h2>
                                    <p class="text-sm text-gray-600 mt-2">Provide anonymous feedback on cafeteria services.</p>
                                    <span class="mt-4 inline-block text-sm font-medium text-orange-600 group-hover:underline">Give Feedback →</span>
                                </a>

                                <a href="/faculty/maintenance" class="group block rounded-xl bg-white p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl hover:border-purple-400 transition-all duration-200 overflow-visible">
                                    <div class="mx-auto flex h-16 w-16 -translate-y-8 transform items-center justify-center rounded-full bg-purple-600 shadow-lg shadow-purple-500/30 transition-transform duration-200">
                                        <!-- Classroom Maintenance Icon -->
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <h2 class="mb-3 text-xl font-semibold text-gray-800">Classroom Maintenance</h2>
                                    <p class="text-sm text-gray-600 mt-2">Report issues with classroom facilities.</p>
                                    <span class="mt-4 inline-block text-sm font-medium text-purple-600 group-hover:underline">Report Issue →</span>
                                </a>
                            </div>
                        </div>
                    </section>

                    <!-- Admin Dashboard -->
                    <section class="mb-12">
                        <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Admin Dashboard</h2>
                        <div class="w-full p-6 card-container">
                            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <a href="{{route('itsupport')}}" class="group block rounded-xl bg-white p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl hover:border-red-400 transition-all duration-200 overflow-visible">
                                    <div class="mx-auto flex h-16 w-16 -translate-y-8 transform items-center justify-center rounded-full bg-red-600 shadow-lg shadow-red-500/30 transition-transform duration-200">
                                        <!-- All Feedback Icon -->
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    <h2 class="mb-3 text-xl font-semibold text-gray-800">All Feedback Reports</h2>
                                    <p class="text-sm text-gray-600 mt-2">View and manage all feedback across course, IT, cafeteria, and maintenance modules.</p>
                                    <span class="mt-4 inline-block text-sm font-medium text-red-600 group-hover:underline">View All →</span>
                                </a>

                                <a href="/admin/manage-tickets" class="group block rounded-xl bg-white p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl hover:border-teal-400 transition-all duration-200 overflow-visible">
                                    <div class="mx-auto flex h-16 w-16 -translate-y-8 transform items-center justify-center rounded-full bg-teal-600 shadow-lg shadow-teal-500/30 transition-transform duration-200">
                                        <!-- Assign Tickets Icon -->
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2v5.586l-3.293 3.293a1 1 0 01-1.414 0l-3.293-3.293A1 1 0 019 14.586V13a2 2 0 00-2-2h-.001c-1.206 0-2.288.943-2.455 2.242A2 2 0 004 15v2a2 2 0 002 2h12a2 2 0 002-2v-2a2 2 0 00-2-2h-1.001c-1.206 0-2.288.943-2.455 2.242A2 2 0 0015 15.586V15zM7.707 6.293L10 8.586l3.293-3.293a1 1 0 011.414 0l3.293 3.293A1 1 0 0119 11v-1a2 2 0 00-2-2h-3l-.293-.293a1 1 0 00-1.414 0L10 6.293a1 1 0 00-1.414 0L7.707 7.707a1 1 0 000 1.414L10 11.414V13a2 2 0 002 2h1a2 2 0 002-2v-1a1 1 0 00-1.707-.707z" />
                                        </svg>
                                    </div>
                                    <h2 class="mb-3 text-xl font-semibold text-gray-800">Manage Tickets</h2>
                                    <p class="text-sm text-gray-600 mt-2">Assign IT and maintenance tickets to appropriate staff members.</p>
                                    <span class="mt-4 inline-block text-sm font-medium text-teal-600 group-hover:underline">Assign Tickets →</span>
                                </a>

                                <a href="/admin/reports-analytics" class="group block rounded-xl bg-white p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl hover:border-cyan-400 transition-all duration-200 overflow-visible">
                                    <div class="mx-auto flex h-16 w-16 -translate-y-8 transform items-center justify-center rounded-full bg-cyan-600 shadow-lg shadow-cyan-500/30 transition-transform duration-200">
                                        <!-- Reports & Analytics Icon -->
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3m0 0l3 3m-3-3v8m0-9a9 9 0 110 18 9 9 0 010-18z" />
                                        </svg>
                                    </div>
                                    <h2 class="mb-3 text-xl font-semibold text-gray-800">Reports & Analytics</h2>
                                    <p class="text-sm text-gray-600 mt-2">Generate weekly/monthly analytics and trend reports on feedback and performance.</p>
                                    <span class="mt-4 inline-block text-sm font-medium text-cyan-600 group-hover:underline">View Reports →</span>
                                </a>

                                <a href="/admin/user-management" class="group block rounded-xl bg-white p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl hover:border-indigo-400 transition-all duration-200 overflow-visible">
                                    <div class="mx-auto flex h-16 w-16 -translate-y-8 transform items-center justify-center rounded-full bg-indigo-600 shadow-lg shadow-indigo-500/30 transition-transform duration-200">
                                        <!-- User Management Icon -->
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M9 20v-2m3 2v-2m3 2v-2M9 10a6 6 0 016 6v2M9 10a6 6 0 00-6 6v2m12 0h3l1-1h1m-1 0h-1l-1-1h-1m-1 0h-1l-1-1h-1m-1 0h-1l-1-1h-1m-1 0h-1l-1-1h-1" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 1.657-1.594 3-3.5 3S5 12.657 5 11s1.594-3 3.5-3 3.5 1.343 3.5 3z" />
                                        </svg>
                                    </div>
                                    <h2 class="mb-3 text-xl font-semibold text-gray-800">User Management</h2>
                                    <p class="text-sm text-gray-600 mt-2">Manage user roles for students, staff, and faculty.</p>
                                    <span class="mt-4 inline-block text-sm font-medium text-indigo-600 group-hover:underline">Manage Roles →</span>
                                </a>
                            </div>
                        </div>
                    </section>

                    <!-- Staff Dashboard -->
                    <section class="mb-12">
                        <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Staff Dashboard</h2>
                        <div class="w-full p-6 card-container">
                            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <a href="/staff/assigned-tasks" class="group block rounded-xl bg-white p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl hover:border-pink-400 transition-all duration-200 overflow-visible">
                                    <div class="mx-auto flex h-16 w-16 -translate-y-8 transform items-center justify-center rounded-full bg-pink-600 shadow-lg shadow-pink-500/30 transition-transform duration-200">
                                        <!-- View Assigned Tasks Icon -->
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 6l3-3m0 0l-3-3m3 3H9" />
                                        </svg>
                                    </div>
                                    <h2 class="mb-3 text-xl font-semibold text-gray-800">Assigned Tasks</h2>
                                    <p class="text-sm text-gray-600 mt-2">View all IT and maintenance complaints or tickets assigned to you.</p>
                                    <span class="mt-4 inline-block text-sm font-medium text-pink-600 group-hover:underline">View Tasks →</span>
                                </a>

                                <a href="/staff/update-status" class="group block rounded-xl bg-white p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl hover:border-lime-400 transition-all duration-200 overflow-visible">
                                    <div class="mx-auto flex h-16 w-16 -translate-y-8 transform items-center justify-center rounded-full bg-lime-600 shadow-lg shadow-lime-500/30 transition-transform duration-200">
                                        <!-- Update Status Icon -->
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 class="mb-3 text-xl font-semibold text-gray-800">Update Task Status</h2>
                                    <p class="text-sm text-gray-600 mt-2">Mark tasks as in-progress or completed, and add notes.</p>
                                    <span class="mt-4 inline-block text-sm font-medium text-lime-600 group-hover:underline">Update Status →</span>
                                </a>

                                <a href="/staff/feedback-review" class="group block rounded-xl bg-white p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl hover:border-yellow-400 transition-all duration-200 overflow-visible">
                                    <div class="mx-auto flex h-16 w-16 -translate-y-8 transform items-center justify-center rounded-full bg-yellow-600 shadow-lg shadow-yellow-500/30 transition-transform duration-200">
                                        <!-- View Performance Feedback Icon -->
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 class="mb-3 text-xl font-semibold text-gray-800">Performance Feedback</h2>
                                    <p class="text-sm text-gray-600 mt-2">View student/faculty ratings and comments submitted after service completion.</p>
                                    <span class="mt-4 inline-block text-sm font-medium text-yellow-600 group-hover:underline">View Feedback →</span>
                                </a>

                                <!-- For Cafeteria Staff specifically -->
                                <a href="/staff/cafeteria-dashboard" class="group block rounded-xl bg-white p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl hover:border-fuchsia-400 transition-all duration-200 overflow-visible">
                                    <div class="mx-auto flex h-16 w-16 -translate-y-8 transform items-center justify-center rounded-full bg-fuchsia-600 shadow-lg shadow-fuchsia-500/30 transition-transform duration-200">
                                        <!-- Cafeteria Admin Dashboard Icon -->
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h2 class="mb-3 text-xl font-semibold text-gray-800">Cafeteria Dashboard</h2>
                                    <p class="text-sm text-gray-600 mt-2">View aggregated anonymous feedback specifically for cafeteria services.</p>
                                    <span class="mt-4 inline-block text-sm font-medium text-fuchsia-600 group-hover:underline">View Feedback →</span>
                                </a>
                            </div>
                        </div>
                    </section>                </div>
            </div>
        </div>
    </div>

</x-app-layout>

<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            System Dashboard
        </h2>
    </x-slot>

    <div class="py-6">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

            <!-- STUDENT SECTION -->
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 border-b border-gray-200">
                    <h3 class="text-lg font-semibold flex items-center gap-2 text-gray-800">
                        <i data-lucide="graduation-cap"></i>
                        Student Portal
                    </h3>
                </div>
                <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Maintenance Status -->
                    <div class="border rounded-lg p-4">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="p-2 bg-blue-100 rounded-full text-blue-600">
                                <i data-lucide="alert-circle"></i>
                            </div>
                            <h4 class="font-medium">Current Issues</h4>
                        </div>
                        <ul class="space-y-2 text-sm">
                            <li class="flex items-start gap-2">
                                <span class="text-yellow-500 mt-0.5"><i data-lucide="wifi-off"></i></span>
                                <span>WiFi issues in Building A</span>
                            </li>
                            <li class="flex items-start gap-2 text-gray-400">
                                <span class="mt-0.5"><i data-lucide="check"></i></span>
                                <span>Projector in Room 302 fixed</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Recent Activity -->
                    <div class="border rounded-lg p-4">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="p-2 bg-purple-100 rounded-full text-purple-600">
                                <i data-lucide="clock"></i>
                            </div>
                            <h4 class="font-medium">Your Recent Activity</h4>
                        </div>
                        <ul class="space-y-2 text-sm">
                            <li class="flex items-start gap-2">
                                <span class="text-gray-500 mt-0.5">•</span>
                                <span>IT Ticket #4521 (Assigned)</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-gray-500 mt-0.5">•</span>
                                <span>Course Evaluation submitted</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- FACULTY SECTION -->
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 border-b border-gray-200">
                    <h3 class="text-lg font-semibold flex items-center gap-2 text-gray-800">
                        <i data-lucide="user-check"></i>
                        Faculty Portal
                    </h3>
                </div>
                <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- Course Feedback -->
                    <div class="border rounded-lg p-4">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="p-2 bg-green-100 rounded-full text-green-600">
                                <i data-lucide="bar-chart-2"></i>
                            </div>
                            <h4 class="font-medium">Course Feedback</h4>
                        </div>
                        <div class="text-sm">
                            <p class="text-gray-600">CS-101: 4.2/5 (32 evaluations)</p>
                            <p class="text-gray-600 mt-1">MATH-202: 3.8/5 (28 evaluations)</p>
                        </div>
                    </div>

                    <!-- Open Issues -->
                    <div class="border rounded-lg p-4">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="p-2 bg-orange-100 rounded-full text-orange-600">
                                <i data-lucide="alert-triangle"></i>
                            </div>
                            <h4 class="font-medium">Classroom Issues</h4>
                        </div>
                        <ul class="space-y-2 text-sm">
                            <li class="flex items-start gap-2">
                                <span class="text-gray-500 mt-0.5">•</span>
                                <span>Broken chair in Room 415</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Quick Links -->
                    <div class="border rounded-lg p-4">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="p-2 bg-blue-100 rounded-full text-blue-600">
                                <i data-lucide="zap"></i>
                            </div>
                            <h4 class="font-medium">Quick Actions</h4>
                        </div>
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <a href="/faculty/it-support" class="p-2 bg-gray-50 hover:bg-gray-100 rounded text-center">
                                <i data-lucide="cpu" class="mx-auto"></i>
                                IT Help
                            </a>
                            <a href="/faculty/maintenance" class="p-2 bg-gray-50 hover:bg-gray-100 rounded text-center">
                                <i data-lucide="tool" class="mx-auto"></i>
                                Maintenance
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ADMIN SECTION -->
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 border-b border-gray-200">
                    <h3 class="text-lg font-semibold flex items-center gap-2 text-gray-800">
                        <i data-lucide="shield"></i>
                        Admin Portal
                    </h3>
                </div>
                <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- Reported Issues -->
                    <div class="border rounded-lg p-4">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="p-2 bg-red-100 rounded-full text-red-600">
                                <i data-lucide="flag"></i>
                            </div>
                            <h4 class="font-medium">Reported Issues</h4>
                        </div>
                        <div class="space-y-3">
                            <div class="flex items-start gap-3 p-2 bg-red-50 rounded">
                                <div class="flex-none pt-0.5 text-red-500">
                                    <i data-lucide="alert-circle"></i>
                                </div>
                                <div>
                                    <p class="font-medium text-sm">Server Down</p>
                                    <p class="text-xs text-gray-500">IT Department</p>
                                    <p class="text-xs text-gray-400 mt-1">5 min ago</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-3 p-2 bg-yellow-50 rounded">
                                <div class="flex-none pt-0.5 text-yellow-500">
                                    <i data-lucide="clock"></i>
                                </div>
                                <div>
                                    <p class="font-medium text-sm">WiFi Issues</p>
                                    <p class="text-xs text-gray-500">North Campus</p>
                                    <p class="text-xs text-gray-400 mt-1">2 hours ago</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Stats Overview -->
                    <div class="border rounded-lg p-4">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="p-2 bg-purple-100 rounded-full text-purple-600">
                                <i data-lucide="bar-chart"></i>
                            </div>
                            <h4 class="font-medium">System Stats</h4>
                        </div>
                        <div class="space-y-3 text-sm">
                            <div class="flex justify-between">
                                <span>Open Tickets</span>
                                <span class="font-medium">12</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Avg. Response Time</span>
                                <span class="font-medium">3h 42m</span>
                            </div>
                            <div class="flex justify-between">
                                <span>User Satisfaction</span>
                                <span class="font-medium">4.2/5</span>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="border rounded-lg p-4">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="p-2 bg-green-100 rounded-full text-green-600">
                                <i data-lucide="zap"></i>
                            </div>
                            <h4 class="font-medium">Admin Tools</h4>
                        </div>
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <a href="{{ route('itsupport') }}" class="p-2 bg-gray-50 hover:bg-gray-100 rounded text-center">
                                <i data-lucide="clipboard-check" class="mx-auto"></i>
                                All Feedback
                            </a>
                            <a href="/admin/manage-tickets" class="p-2 bg-gray-50 hover:bg-gray-100 rounded text-center">
                                <i data-lucide="ticket" class="mx-auto"></i>
                                Manage Tickets
                            </a>
                            <a href="/admin/user-management" class="p-2 bg-gray-50 hover:bg-gray-100 rounded text-center">
                                <i data-lucide="users" class="mx-auto"></i>
                                Users
                            </a>
                            <a href="/admin/reports-analytics" class="p-2 bg-gray-50 hover:bg-gray-100 rounded text-center">
                                <i data-lucide="line-chart" class="mx-auto"></i>
                                Reports
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- STAFF SECTION -->
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 border-b border-gray-200">
                    <h3 class="text-lg font-semibold flex items-center gap-2 text-gray-800">
                        <i data-lucide="briefcase"></i>
                        Staff Portal
                    </h3>
                </div>
                <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Assigned Tasks -->
                    <div class="border rounded-lg p-4">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="p-2 bg-blue-100 rounded-full text-blue-600">
                                <i data-lucide="list-checks"></i>
                            </div>
                            <h4 class="font-medium">Your Tasks</h4>
                        </div>
                        <ul class="space-y-3 text-sm">
                            <li class="flex items-start gap-3 p-2 bg-gray-50 rounded">
                                <div class="flex-none pt-0.5 text-blue-500">
                                    <i data-lucide="cpu"></i>
                                </div>
                                <div>
                                    <p class="font-medium">Printer Setup</p>
                                    <p class="text-xs text-gray-500">Room 205 • Due today</p>
                                </div>
                            </li>
                            <li class="flex items-start gap-3 p-2 bg-gray-50 rounded">
                                <div class="flex-none pt-0.5 text-orange-500">
                                    <i data-lucide="tool"></i>
                                </div>
                                <div>
                                    <p class="font-medium">Chair Repair</p>
                                    <p class="text-xs text-gray-500">Library • High priority</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <!-- Performance -->
                    <div class="border rounded-lg p-4">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="p-2 bg-green-100 rounded-full text-green-600">
                                <i data-lucide="star"></i>
                            </div>
                            <h4 class="font-medium">Your Performance</h4>
                        </div>
                        <div class="space-y-3 text-sm">
                            <div class="flex justify-between">
                                <span>Completed Tasks</span>
                                <span class="font-medium">24</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Avg. Rating</span>
                                <span class="font-medium">4.5/5</span>
                            </div>
                            <div class="flex justify-between">
                                <span>On Time</span>
                                <span class="font-medium">92%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>

<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="max-w-7xl w-full bg-white shadow-lg rounded-xl p-8 space-y-8">
                <h1 class="text-3xl font-bold text-gray-800 text-center mb-6">IT Support Tickets</h1>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Ticket Card -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                        <div class="flex items-start justify-between mb-4">
                            <h2 class="text-lg font-semibold text-gray-900">#IT001 – Network Down</h2>
                            <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
        High Priority
      </span>
                        </div>

                        <div class="mb-3">
                            <span class="text-sm font-medium text-gray-700">Status:</span>
                            <span class="ml-1 inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
        Pending
      </span>
                        </div>

                        <ul class="text-sm text-gray-600 space-y-1.5">
                            <li><strong class="text-gray-800">Issue By:</strong> John Doe (Student)</li>
                            <li><strong class="text-gray-800">Location:</strong> Main Academic Building, Lab 305</li>
                            <li><strong class="text-gray-800">Description:</strong> No internet connection. Critical for classes.</li>
                            <li><strong class="text-gray-800">Date:</strong> 2025-06-24 10:30 AM</li>
                        </ul>

                        <div class="mt-5 text-right">
                            <a href="#" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                                View Details
                            </a>
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                        <div class="flex items-start justify-between mb-4">
                            <h2 class="text-lg font-semibold text-gray-900">#IT001 – Network Down</h2>
                            <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
        High Priority
      </span>
                        </div>

                        <div class="mb-3">
                            <span class="text-sm font-medium text-gray-700">Status:</span>
                            <span class="ml-1 inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
        Pending
      </span>
                        </div>

                        <ul class="text-sm text-gray-600 space-y-1.5">
                            <li><strong class="text-gray-800">Issue By:</strong> John Doe (Student)</li>
                            <li><strong class="text-gray-800">Location:</strong> Main Academic Building, Lab 305</li>
                            <li><strong class="text-gray-800">Description:</strong> No internet connection. Critical for classes.</li>
                            <li><strong class="text-gray-800">Date:</strong> 2025-06-24 10:30 AM</li>
                        </ul>

                        <div class="mt-5 text-right">
                            <a href="#" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                                View Details
                            </a>
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                        <div class="flex items-start justify-between mb-4">
                            <h2 class="text-lg font-semibold text-gray-900">#IT002 – Projector Malfunction</h2>
                            <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        Assigned
      </span>
                        </div>

                        <div class="mb-3 space-y-1">
                            <div>
                                <span class="text-sm font-medium text-gray-700">Status:</span>
                                <span class="ml-1 inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          In Progress
        </span>
                            </div>
                            <div>
                                <span class="text-sm font-medium text-gray-700">Assigned To:</span>
                                <span class="ml-1 inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          Sarah Chen (Technician)
        </span>
                            </div>
                        </div>

                        <ul class="text-sm text-gray-600 space-y-1.5">
                            <li><strong class="text-gray-800">Issue By:</strong> Dr. Emily White (Faculty)</li>
                            <li><strong class="text-gray-800">Location:</strong> Humanities Block, Lecture Hall B</li>
                            <li><strong class="text-gray-800">Description:</strong> Projector image is flickering/distorted.</li>
                            <li><strong class="text-gray-800">Date:</strong> 2025-06-23 09:00 AM</li>
                        </ul>

                        <div class="mt-5 text-right">
                            <a href="#" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                                View Details
                            </a>
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                        <div class="flex items-start justify-between mb-4">
                            <h2 class="text-lg font-semibold text-gray-900">#IT002 – Projector Malfunction</h2>
                            <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        Assigned
      </span>
                        </div>

                        <div class="mb-3 space-y-1">
                            <div>
                                <span class="text-sm font-medium text-gray-700">Status:</span>
                                <span class="ml-1 inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          In Progress
        </span>
                            </div>
                            <div>
                                <span class="text-sm font-medium text-gray-700">Assigned To:</span>
                                <span class="ml-1 inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          Sarah Chen (Technician)
        </span>
                            </div>
                        </div>

                        <ul class="text-sm text-gray-600 space-y-1.5">
                            <li><strong class="text-gray-800">Issue By:</strong> Dr. Emily White (Faculty)</li>
                            <li><strong class="text-gray-800">Location:</strong> Humanities Block, Lecture Hall B</li>
                            <li><strong class="text-gray-800">Description:</strong> Projector image is flickering/distorted.</li>
                            <li><strong class="text-gray-800">Date:</strong> 2025-06-23 09:00 AM</li>
                        </ul>

                        <div class="mt-5 text-right">
                            <a href="#" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                                View Details
                            </a>
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                        <div class="flex items-start justify-between mb-4">
                            <h2 class="text-lg font-semibold text-gray-900">#IT001 – Network Down</h2>
                            <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
        High Priority
      </span>
                        </div>

                        <div class="mb-3">
                            <span class="text-sm font-medium text-gray-700">Status:</span>
                            <span class="ml-1 inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
        Pending
      </span>
                        </div>

                        <ul class="text-sm text-gray-600 space-y-1.5">
                            <li><strong class="text-gray-800">Issue By:</strong> John Doe (Student)</li>
                            <li><strong class="text-gray-800">Location:</strong> Main Academic Building, Lab 305</li>
                            <li><strong class="text-gray-800">Description:</strong> No internet connection. Critical for classes.</li>
                            <li><strong class="text-gray-800">Date:</strong> 2025-06-24 10:30 AM</li>
                        </ul>

                        <div class="mt-5 text-right">
                            <a href="#" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                                View Details
                            </a>
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                        <div class="flex items-start justify-between mb-4">
                            <h2 class="text-lg font-semibold text-gray-900">#IT001 – Network Down</h2>
                            <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
        High Priority
      </span>
                        </div>

                        <div class="mb-3">
                            <span class="text-sm font-medium text-gray-700">Status:</span>
                            <span class="ml-1 inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
        Pending
      </span>
                        </div>

                        <ul class="text-sm text-gray-600 space-y-1.5">
                            <li><strong class="text-gray-800">Issue By:</strong> John Doe (Student)</li>
                            <li><strong class="text-gray-800">Location:</strong> Main Academic Building, Lab 305</li>
                            <li><strong class="text-gray-800">Description:</strong> No internet connection. Critical for classes.</li>
                            <li><strong class="text-gray-800">Date:</strong> 2025-06-24 10:30 AM</li>
                        </ul>

                        <div class="mt-5 text-right">
                            <a href="#" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                                View Details
                            </a>
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                        <div class="flex items-start justify-between mb-4">
                            <h2 class="text-lg font-semibold text-gray-900">#IT002 – Projector Malfunction</h2>
                            <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        Assigned
      </span>
                        </div>

                        <div class="mb-3 space-y-1">
                            <div>
                                <span class="text-sm font-medium text-gray-700">Status:</span>
                                <span class="ml-1 inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          In Progress
        </span>
                            </div>
                            <div>
                                <span class="text-sm font-medium text-gray-700">Assigned To:</span>
                                <span class="ml-1 inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          Sarah Chen (Technician)
        </span>
                            </div>
                        </div>

                        <ul class="text-sm text-gray-600 space-y-1.5">
                            <li><strong class="text-gray-800">Issue By:</strong> Dr. Emily White (Faculty)</li>
                            <li><strong class="text-gray-800">Location:</strong> Humanities Block, Lecture Hall B</li>
                            <li><strong class="text-gray-800">Description:</strong> Projector image is flickering/distorted.</li>
                            <li><strong class="text-gray-800">Date:</strong> 2025-06-23 09:00 AM</li>
                        </ul>

                        <div class="mt-5 text-right">
                            <a href="#" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                                View Details
                            </a>
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                        <div class="flex items-start justify-between mb-4">
                            <h2 class="text-lg font-semibold text-gray-900">#IT002 – Projector Malfunction</h2>
                            <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        Assigned
      </span>
                        </div>

                        <div class="mb-3 space-y-1">
                            <div>
                                <span class="text-sm font-medium text-gray-700">Status:</span>
                                <span class="ml-1 inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          In Progress
        </span>
                            </div>
                            <div>
                                <span class="text-sm font-medium text-gray-700">Assigned To:</span>
                                <span class="ml-1 inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          Sarah Chen (Technician)
        </span>
                            </div>
                        </div>

                        <ul class="text-sm text-gray-600 space-y-1.5">
                            <li><strong class="text-gray-800">Issue By:</strong> Dr. Emily White (Faculty)</li>
                            <li><strong class="text-gray-800">Location:</strong> Humanities Block, Lecture Hall B</li>
                            <li><strong class="text-gray-800">Description:</strong> Projector image is flickering/distorted.</li>
                            <li><strong class="text-gray-800">Date:</strong> 2025-06-23 09:00 AM</li>
                        </ul>

                        <div class="mt-5 text-right">
                            <a href="#" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                                View Details
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

</x-app-layout>

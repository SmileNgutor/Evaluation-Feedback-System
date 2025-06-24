<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="max-w-7xl w-full bg-white shadow-lg rounded-xl p-8 space-y-8">
                <h1 class="text-3xl font-bold text-gray-800 text-center mb-6"></h1>

                <section class="max-w-7xl mx-auto p-6 space-y-8">
                    <!-- Header + Create Button -->
                    <div class="flex items-center justify-between">
                        <h1 class="text-2xl font-bold text-gray-900">My Tickets</h1>
                        <button class="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
                                 viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M12 4v16m8-8H4" />
                            </svg>
                            Create Ticket
                        </button>
                    </div>

                    <!-- Ticket Cards Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        <!-- Static Ticket Card -->
                        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                            <div class="flex items-start justify-between mb-4">
                                <h2 class="text-lg font-semibold text-gray-900">#IT006 – Wi-Fi Issue</h2>
                                <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
          Pending
        </span>
                            </div>

                            <ul class="text-sm text-gray-600 space-y-1.5">
                                <li><strong class="text-gray-800">Status:</strong> Pending</li>
                                <li><strong class="text-gray-800">Building:</strong> Engineering Block</li>
                                <li><strong class="text-gray-800">Room:</strong> EN-204</li>
                                <li><strong class="text-gray-800">Description:</strong> Weak Wi-Fi signal during online classes.</li>
                                <li><strong class="text-gray-800">Date:</strong> 2025-06-24 08:45 AM</li>
                            </ul>

                            <div class="mt-5 text-right">
                                <a href="#" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                                    View Details
                                </a>
                            </div>
                        </div>

                        <!-- Add more static ticket cards here as needed -->

                        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                            <div class="flex items-start justify-between mb-4">
                                <h2 class="text-lg font-semibold text-gray-900">#IT007 – Software Request</h2>
                                <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          In Progress
        </span>
                            </div>

                            <ul class="text-sm text-gray-600 space-y-1.5">
                                <li><strong class="text-gray-800">Status:</strong> In Progress</li>
                                <li><strong class="text-gray-800">Building:</strong> Computer Lab</li>
                                <li><strong class="text-gray-800">Room:</strong> CL-102</li>
                                <li><strong class="text-gray-800">Description:</strong> Need R Studio installed on PC 4.</li>
                                <li><strong class="text-gray-800">Date:</strong> 2025-06-23 03:10 PM</li>
                            </ul>

                            <div class="mt-5 text-right">
                                <a href="#" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                                    View Details
                                </a>
                            </div>
                        </div>

                    </div>
                </section>
            </div>
        </div>
    </div>

</x-app-layout>

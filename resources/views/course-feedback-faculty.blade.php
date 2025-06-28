<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            Course Feedback Dashboard
        </h2>
    </x-slot>

    <div class="py-6">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
            <!-- Filter Controls -->
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
                        <select class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>All Courses</option>
                            <option selected>CS101 - Introduction to Programming</option>
                            <option>MATH202 - Calculus II</option>
                            <option>ENG105 - Academic Writing</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                        <select class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>All Semesters</option>
                            <option selected>Spring 2023</option>
                            <option>Fall 2022</option>
                            <option>Spring 2022</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Feedback Type</label>
                        <select class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>All Feedback</option>
                            <option selected>Recent (Last 30 days)</option>
                            <option>Negative (1-2 stars)</option>
                            <option>Positive (4-5 stars)</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500">Average Rating</p>
                            <div class="flex items-center mt-1">
                                <div class="text-3xl font-bold text-gray-900">4.2</div>
                                <div class="ml-2 flex items-center text-yellow-400">
                                    <i data-lucide="star" class="w-5 h-5 fill-current"></i>
                                    <i data-lucide="star" class="w-5 h-5 fill-current"></i>
                                    <i data-lucide="star" class="w-5 h-5 fill-current"></i>
                                    <i data-lucide="star" class="w-5 h-5 fill-current"></i>
                                    <i data-lucide="star" class="w-5 h-5 fill-current text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                        <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                            <i data-lucide="bar-chart-2" class="w-6 h-6"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500">Total Responses</p>
                            <div class="mt-1">
                                <div class="text-3xl font-bold text-gray-900">87</div>
                                <p class="text-xs text-green-600 mt-1">
                                    <i data-lucide="trending-up" class="w-3 h-3 inline"></i> 12% from last term
                                </p>
                            </div>
                        </div>
                        <div class="p-3 rounded-full bg-green-100 text-green-600">
                            <i data-lucide="clipboard-list" class="w-6 h-6"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500">Common Themes</p>
                            <div class="mt-1">
                                <div class="text-3xl font-bold text-gray-900">3</div>
                                <p class="text-xs text-gray-500 mt-1">Clear explanations, Engaging, Helpful materials</p>
                            </div>
                        </div>
                        <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                            <i data-lucide="lightbulb" class="w-6 h-6"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Feedback Breakdown -->
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 border-b border-gray-200">
                    <h3 class="text-lg font-semibold flex items-center gap-2 text-gray-800">
                        <i data-lucide="message-square"></i>
                        Feedback Breakdown
                    </h3>
                </div>
                <div class="p-6">
                    <!-- Rating Distribution -->
                    <div class="mb-8">
                        <h4 class="font-medium text-gray-700 mb-3">Rating Distribution</h4>
                        <div class="space-y-3">
                            <!-- 5 Stars -->
                            <div class="flex items-center">
                                <div class="w-10 text-sm text-gray-500 flex items-center">
                                    5 <i data-lucide="star" class="w-4 h-4 ml-1 fill-current text-yellow-400"></i>
                                </div>
                                <div class="flex-1 mx-2">
                                    <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
                                        <div class="h-full bg-green-500" style="width: 65%"></div>
                                    </div>
                                </div>
                                <div class="w-10 text-sm text-gray-500 text-right">65%</div>
                            </div>
                            <!-- 4 Stars -->
                            <div class="flex items-center">
                                <div class="w-10 text-sm text-gray-500 flex items-center">
                                    4 <i data-lucide="star" class="w-4 h-4 ml-1 fill-current text-yellow-400"></i>
                                </div>
                                <div class="flex-1 mx-2">
                                    <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
                                        <div class="h-full bg-blue-500" style="width: 20%"></div>
                                    </div>
                                </div>
                                <div class="w-10 text-sm text-gray-500 text-right">20%</div>
                            </div>
                            <!-- 3 Stars -->
                            <div class="flex items-center">
                                <div class="w-10 text-sm text-gray-500 flex items-center">
                                    3 <i data-lucide="star" class="w-4 h-4 ml-1 fill-current text-yellow-400"></i>
                                </div>
                                <div class="flex-1 mx-2">
                                    <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
                                        <div class="h-full bg-yellow-500" style="width: 10%"></div>
                                    </div>
                                </div>
                                <div class="w-10 text-sm text-gray-500 text-right">10%</div>
                            </div>
                            <!-- 2 Stars -->
                            <div class="flex items-center">
                                <div class="w-10 text-sm text-gray-500 flex items-center">
                                    2 <i data-lucide="star" class="w-4 h-4 ml-1 fill-current text-yellow-400"></i>
                                </div>
                                <div class="flex-1 mx-2">
                                    <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
                                        <div class="h-full bg-orange-500" style="width: 3%"></div>
                                    </div>
                                </div>
                                <div class="w-10 text-sm text-gray-500 text-right">3%</div>
                            </div>
                            <!-- 1 Star -->
                            <div class="flex items-center">
                                <div class="w-10 text-sm text-gray-500 flex items-center">
                                    1 <i data-lucide="star" class="w-4 h-4 ml-1 fill-current text-yellow-400"></i>
                                </div>
                                <div class="flex-1 mx-2">
                                    <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
                                        <div class="h-full bg-red-500" style="width: 2%"></div>
                                    </div>
                                </div>
                                <div class="w-10 text-sm text-gray-500 text-right">2%</div>
                            </div>
                        </div>
                    </div>

                    <!-- Comments Section -->
                    <div>
                        <h4 class="font-medium text-gray-700 mb-3">Student Comments</h4>
                        <div class="space-y-4">
                            <!-- Comment 1 -->
                            <div class="border-l-4 border-blue-500 pl-4 py-2">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center text-sm text-gray-500">
                                        <i data-lucide="star" class="w-4 h-4 mr-1 fill-current text-yellow-400"></i>
                                        <span>5</span>
                                        <span class="mx-1">•</span>
                                        <span>Week 8</span>
                                    </div>
                                    <div class="text-xs text-gray-400">March 15, 2023</div>
                                </div>
                                <p class="mt-1 text-gray-800">"The lectures were very clear and the examples helped me understand the concepts. The instructor was always available for questions."</p>
                            </div>

                            <!-- Comment 2 -->
                            <div class="border-l-4 border-blue-500 pl-4 py-2">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center text-sm text-gray-500">
                                        <i data-lucide="star" class="w-4 h-4 mr-1 fill-current text-yellow-400"></i>
                                        <span>4</span>
                                        <span class="mx-1">•</span>
                                        <span>Week 12</span>
                                    </div>
                                    <div class="text-xs text-gray-400">April 2, 2023</div>
                                </div>
                                <p class="mt-1 text-gray-800">"Great course overall. The assignments were challenging but fair. Would suggest adding more practice problems for the final exam."</p>
                            </div>

                            <!-- Comment 3 -->
                            <div class="border-l-4 border-orange-500 pl-4 py-2">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center text-sm text-gray-500">
                                        <i data-lucide="star" class="w-4 h-4 mr-1 fill-current text-yellow-400"></i>
                                        <span>3</span>
                                        <span class="mx-1">•</span>
                                        <span>Week 5</span>
                                    </div>
                                    <div class="text-xs text-gray-400">February 20, 2023</div>
                                </div>
                                <p class="mt-1 text-gray-800">"Some concepts were explained too quickly. The office hours helped, but maybe slow down a bit in lecture."</p>
                            </div>
                        </div>

                        <div class="mt-6 flex justify-center">
                            <button class="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                                <i data-lucide="list"></i>
                                View All Comments (87)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Improvement Suggestions -->
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 border-b border-gray-200">
                    <h3 class="text-lg font-semibold flex items-center gap-2 text-gray-800">
                        <i data-lucide="trending-up"></i>
                        Improvement Suggestions
                    </h3>
                </div>
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="border rounded-lg p-4">
                            <h4 class="font-medium flex items-center gap-2 text-gray-700 mb-3">
                                <i data-lucide="alert-circle" class="text-orange-500"></i>
                                Areas for Improvement
                            </h4>
                            <ul class="space-y-2 text-sm text-gray-600">
                                <li class="flex items-start gap-2">
                                    <i data-lucide="chevron-right" class="text-gray-400 mt-0.5 flex-shrink-0"></i>
                                    <span>Pacing of lectures in weeks 4-6</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <i data-lucide="chevron-right" class="text-gray-400 mt-0.5 flex-shrink-0"></i>
                                    <span>Clarity of assignment 3 instructions</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <i data-lucide="chevron-right" class="text-gray-400 mt-0.5 flex-shrink-0"></i>
                                    <span>More examples of practical applications</span>
                                </li>
                            </ul>
                        </div>
                        <div class="border rounded-lg p-4">
                            <h4 class="font-medium flex items-center gap-2 text-gray-700 mb-3">
                                <i data-lucide="thumbs-up" class="text-green-500"></i>
                                What's Working Well
                            </h4>
                            <ul class="space-y-2 text-sm text-gray-600">
                                <li class="flex items-start gap-2">
                                    <i data-lucide="chevron-right" class="text-gray-400 mt-0.5 flex-shrink-0"></i>
                                    <span>Clear explanations of complex topics</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <i data-lucide="chevron-right" class="text-gray-400 mt-0.5 flex-shrink-0"></i>
                                    <span>Engaging lecture style</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <i data-lucide="chevron-right" class="text-gray-400 mt-0.5 flex-shrink-0"></i>
                                    <span>Helpful office hours</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>

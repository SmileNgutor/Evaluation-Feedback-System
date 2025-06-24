<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="max-w-4xl mx-auto w-full bg-white shadow-lg rounded-xl p-6 md:p-8 space-y-8 relative">
                <div class="absolute top-4 right-4 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium px-3 py-2 rounded-lg shadow-sm">
                    <p class="font-bold mb-1">Rating Scale:</p>
                    <ul class="list-disc list-inside space-y-0.5">
                        <li>1 - Strongly Disagree</li>
                        <li>2 - Disagree</li>
                        <li>3 - Neutral</li>
                        <li>4 - Agree</li>
                        <li>5 - Strongly Agree</li>
                    </ul>
                </div>
                <h1 class="text-3xl font-bold text-gray-800 text-center mb-2">Course Evaluation</h1>
                <p class="text-center text-gray-600 mb-6">Your anonymous feedback helps us improve the learning experience.</p>

                <form action="#" method="POST" class="space-y-6">

                    <div class="border border-gray-200 rounded-lg p-5 bg-gray-50 shadow-sm">
                        <label class="block text-lg font-medium text-gray-800 mb-4">
                            1. The course objectives were clear and well-defined.
                        </label>
                        <div class="flex flex-wrap gap-x-8 gap-y-4 justify-center">
                            <div class="flex items-center">
                                <input type="radio" name="q1-scale" class="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="q1-sd" value="1">
                                <label for="q1-sd" class="text-sm text-gray-700 ms-2">1 - Strongly Disagree</label>
                            </div>
                            <div class="flex items-center">
                                <input type="radio" name="q1-scale" class="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="q1-d" value="2">
                                <label for="q1-d" class="text-sm text-gray-700 ms-2">2 - Disagree</label>
                            </div>
                            <div class="flex items-center">
                                <input type="radio" name="q1-scale" class="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="q1-n" value="3" checked>
                                <label for="q1-n" class="text-sm text-gray-700 ms-2">3 - Neutral</label>
                            </div>
                            <div class="flex items-center">
                                <input type="radio" name="q1-scale" class="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="q1-a" value="4">
                                <label for="q1-a" class="text-sm text-gray-700 ms-2">4 - Agree</label>
                            </div>
                            <div class="flex items-center">
                                <input type="radio" name="q1-scale" class="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="q1-sa" value="5">
                                <label for="q1-sa" class="text-sm text-gray-700 ms-2">5 - Strongly Agree</label>
                            </div>
                        </div>
                    </div>

                    <div class="border border-gray-200 rounded-lg p-5 bg-gray-50 shadow-sm">
                        <label class="block text-lg font-medium text-gray-800 mb-4">
                            2. The instructor was knowledgeable and effective in teaching the material.
                        </label>
                        <div class="flex flex-wrap gap-x-8 gap-y-4 justify-center">
                            <div class="flex items-center">
                                <input type="radio" name="q2-scale" class="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="q2-sd" value="1">
                                <label for="q2-sd" class="text-sm text-gray-700 ms-2">1 - Strongly Disagree</label>
                            </div>
                            <div class="flex items-center">
                                <input type="radio" name="q2-scale" class="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="q2-d" value="2">
                                <label for="q2-d" class="text-sm text-gray-700 ms-2">2 - Disagree</label>
                            </div>
                            <div class="flex items-center">
                                <input type="radio" name="q2-scale" class="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="q2-n" value="3" checked>
                                <label for="q2-n" class="text-sm text-gray-700 ms-2">3 - Neutral</label>
                            </div>
                            <div class="flex items-center">
                                <input type="radio" name="q2-scale" class="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="q2-a" value="4">
                                <label for="q2-a" class="text-sm text-gray-700 ms-2">4 - Agree</label>
                            </div>
                            <div class="flex items-center">
                                <input type="radio" name="q2-scale" class="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="q2-sa" value="5">
                                <label for="q2-sa" class="text-sm text-gray-700 ms-2">5 - Strongly Agree</label>
                            </div>
                        </div>
                    </div>

                    <div class="border border-gray-200 rounded-lg p-5 bg-gray-50 shadow-sm">
                        <label class="block text-lg font-medium text-gray-800 mb-4">
                            3. The course materials (textbook, readings, resources) were helpful.
                        </label>
                        <div class="flex flex-wrap gap-x-8 gap-y-4 justify-center">
                            <div class="flex items-center">
                                <input type="radio" name="q3-scale" class="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="q3-sd" value="1">
                                <label for="q3-sd" class="text-sm text-gray-700 ms-2">1 - Strongly Disagree</label>
                            </div>
                            <div class="flex items-center">
                                <input type="radio" name="q3-scale" class="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="q3-d" value="2">
                                <label for="q3-d" class="text-sm text-gray-700 ms-2">2 - Disagree</label>
                            </div>
                            <div class="flex items-center">
                                <input type="radio" name="q3-scale" class="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="q3-n" value="3" checked>
                                <label for="q3-n" class="text-sm text-gray-700 ms-2">3 - Neutral</label>
                            </div>
                            <div class="flex items-center">
                                <input type="radio" name="q3-scale" class="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="q3-a" value="4">
                                <label for="q3-a" class="text-sm text-gray-700 ms-2">4 - Agree</label>
                            </div>
                            <div class="flex items-center">
                                <input type="radio" name="q3-scale" class="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="q3-sa" value="5">
                                <label for="q3-sa" class="text-sm text-gray-700 ms-2">5 - Strongly Agree</label>
                            </div>
                        </div>
                    </div>

                    <div class="border border-gray-200 rounded-lg p-5 bg-gray-50 shadow-sm">
                        <label for="comments" class="block text-lg font-medium text-gray-800 mb-2">
                            Additional Comments (Optional):
                        </label>
                        <textarea id="comments" name="comments" rows="6" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="Provide any other feedback or suggestions..."></textarea>
                    </div>

                    <div class="flex justify-end pt-4">
                        <button type="submit" class="py-3 px-6 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200">
                            Submit Evaluation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

</x-app-layout>

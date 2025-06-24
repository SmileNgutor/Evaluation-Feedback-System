<x-app-layout>
    <x-slot name="header">
        <h2 class="text-2xl font-semibold text-gray-800">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto px-6 py-12">
            <div class="bg-white shadow-xl rounded-2xl p-8 space-y-10">
                <h1 class="text-3xl font-bold text-center text-gray-900">Classroom Maintenance Report</h1>
                <p class="text-center text-gray-600 text-base">
                    Report any issues with classroom facilities. This is a <strong>non-anonymous</strong> report to help us address issues promptly.
                </p>

                <form action="#" method="POST" class="space-y-8">

                    {{-- Type of Issue --}}
                    <div class="space-y-2">
                        <label for="issue-category" class="block text-lg font-medium text-gray-800">
                            1. Type of Issue:
                        </label>
                        <select id="issue-category" name="issue-category"
                                class="block w-full px-4 py-3 text-sm border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500">
                            <option selected disabled>Select an issue category</option>
                            <option>Projector Malfunction</option>
                            <option>Lighting Issue (e.g., flickering, dark)</option>
                            <option>Broken Furniture (e.g., chair, desk)</option>
                            <option>Whiteboard/Marker Issues</option>
                            <option>Temperature Control (too hot/cold)</option>
                            <option>Power Outlet Malfunction</option>
                            <option>Cleaning Required</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {{-- Building --}}
                    <div class="space-y-2">
                        <label for="building" class="block text-lg font-medium text-gray-800">
                            2. Building:
                        </label>
                        <input type="text" id="building" name="building"
                               class="block w-full px-4 py-3 text-sm border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                               placeholder="e.g., Main Academic Building">
                    </div>

                    {{-- Room Number --}}
                    <div class="space-y-2">
                        <label for="room-number" class="block text-lg font-medium text-gray-800">
                            3. Room Number:
                        </label>
                        <input type="text" id="room-number" name="room-number"
                               class="block w-full px-4 py-3 text-sm border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                               placeholder="e.g., 305">
                    </div>

                    {{-- Urgency Level --}}
                    <div class="space-y-2">
                        <label class="block text-lg font-medium text-gray-800">
                            4. Urgency Level:
                        </label>
                        <div class="flex flex-wrap gap-4 justify-center">
                            @foreach (['Low', 'Medium', 'High', 'Critical'] as $level)
                                @php
                                    $val = strtolower($level);
                                    $id = "urgency-$val";
                                @endphp
                                <label for="{{ $id }}" class="flex items-center space-x-2 text-sm text-gray-700">
                                    <input
                                        type="radio"
                                        name="urgency-level"
                                        id="{{ $id }}"
                                        value="{{ $val }}"
                                        class="text-blue-600 border-gray-300 focus:ring-blue-500 rounded-full"
                                        {{ $val === 'medium' ? 'checked' : '' }}
                                    >
                                    <span>{{ $level }}</span>
                                </label>
                            @endforeach
                        </div>
                    </div>

                    {{-- Description --}}
                    <div class="space-y-2">
                        <label for="detailed-description" class="block text-lg font-medium text-gray-800">
                            5. Detailed Description of the Issue:
                        </label>
                        <textarea id="detailed-description" name="detailed-description" rows="6"
                                  class="block w-full px-4 py-3 text-sm border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                                  placeholder="Describe the issue in detail, e.g., 'Projector displays green tint and flickers'."></textarea>
                    </div>

                    {{-- Submit --}}
                    <div class="flex justify-end">
                        <button
                            type="submit"
                            class="px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Submit Maintenance Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</x-app-layout>

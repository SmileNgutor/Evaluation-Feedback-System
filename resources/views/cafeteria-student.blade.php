<x-app-layout>
    <x-slot name="header">
        <h2 class="text-2xl font-semibold text-gray-800">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto px-6">
            <div class="bg-white shadow-xl rounded-2xl p-8 space-y-10">
                <h1 class="text-3xl font-bold text-center text-gray-900">
                    Cafeteria Services Feedback
                </h1>
                <p class="text-center text-gray-600 text-base">
                    Your feedback helps us improve. This survey is <strong>completely anonymous</strong>.
                </p>

                <form action="#" method="POST" class="space-y-10">

                    {{-- Question Template --}}
                    @php
                        $questions = [
                            'How would you rate the overall quality of the food?',
                            'How would you rate the variety of food options available?',
                            'How friendly and efficient was the cafeteria staff?',
                            'How would you rate the cleanliness of the cafeteria area?',
                            'How reasonable are the wait times for service?'
                        ];

                        $options = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
                    @endphp

                    @foreach($questions as $index => $question)
                        <div class="space-y-4">
                            <label class="block text-lg font-medium text-gray-800">
                                {{ $index + 1 }}. {{ $question }}
                            </label>
                            <div class="flex flex-wrap justify-center gap-4">
                                @foreach($options as $opt)
                                    @php
                                        $id = 'q' . ($index + 1) . '-' . strtolower(str_replace(' ', '-', $opt));
                                    @endphp
                                    <label class="flex items-center space-x-2 text-sm text-gray-700">
                                        <input
                                            type="radio"
                                            name="q{{ $index + 1 }}"
                                            id="{{ $id }}"
                                            value="{{ strtolower(str_replace(' ', '_', $opt)) }}"
                                            class="text-blue-600 border-gray-300 focus:ring-blue-500 rounded-full"
                                            {{ $opt === 'Good' ? 'checked' : '' }}
                                        >
                                        <span>{{ $opt }}</span>
                                    </label>
                                @endforeach
                            </div>
                        </div>
                    @endforeach

                    {{-- Floating Label Textarea --}}
                    <div class="relative">
                        <textarea
                            id="additional-comments"
                            name="comments"
                            rows="4"
                            placeholder=" "
                            class="peer block w-full px-4 pt-6 pb-2 text-sm border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-transparent"
                        ></textarea>
                        <label for="additional-comments"
                               class="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-500">
                            Additional Comments (Optional)
                        </label>
                    </div>

                    {{-- Submit --}}
                    <div class="flex justify-end">
                        <button
                            type="submit"
                            class="px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Submit Feedback
                        </button>
                    </div>

                </form>
            </div>
        </div>
    </div>
</x-app-layout>

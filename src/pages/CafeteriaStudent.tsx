import { useState } from 'react';
import { Search, Utensils, MapPin, CheckCircle } from 'lucide-react';

const CatererFeedback = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCaterer, setSelectedCaterer] = useState<any>(null);
    const [feedbackData, setFeedbackData] = useState({
        answers: ['', '', '', '', ''],
        additionalComments: ''
    });

    // Dummy caterer data
    const caterers = [
        {
            id: 1,
            name: 'Rich John Foodies',
            location: 'Pizzeria'
        },
        {
            id: 2,
            name: 'Gee Mama Ketch',
            location: 'Main Cafeteria'
        },
        {
            id: 3,
            name: 'Rich John Foodies',
            location: 'North Campus Cafe'
        },
        {
            id: 4,
            name: 'Gee Mama Ketch',
            location: 'Student Center'
        }
    ];

    const questions = [
        {
            id: 1,
            question: 'How would you rate the overall food quality?',
            type: 'likert',
            options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
        },
        {
            id: 2,
            question: 'The food was fresh and properly prepared',
            type: 'likert',
            options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
            id: 3,
            question: 'The portion sizes were adequate and satisfying',
            type: 'likert',
            options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
            id: 4,
            question: 'How would you rate the value for money?',
            type: 'likert',
            options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
        },
        {
            id: 5,
            question: 'The service was prompt and efficient',
            type: 'likert',
            options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        }
    ];

    const filteredCaterers = caterers.filter(caterer =>
        caterer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caterer.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCatererSelect = (caterer: any) => {
        setSelectedCaterer(caterer);
        setFeedbackData({
            answers: ['', '', '', '', ''],
            additionalComments: ''
        });
    };

    const handleAnswerChange = (questionIndex: number, answer: string) => {
        const newAnswers = [...feedbackData.answers];
        newAnswers[questionIndex] = answer;
        setFeedbackData(prev => ({
            ...prev,
            answers: newAnswers
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Caterer feedback submitted:', {
            caterer: selectedCaterer,
            feedback: feedbackData
        });
        alert('Thank you for your feedback!');
    };

    const isFormComplete = feedbackData.answers.every(answer => answer !== '');

    return (
        <div className="py-6">
            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white shadow-sm sm:rounded-lg mb-6">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                            <Utensils />
                            Caterer Feedback
                        </h2>
                    </div>
                </div>

                {!selectedCaterer ? (
                    /* Caterer Search Section */
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Select Caterer to Evaluate</h3>
                        </div>
                        <div className="p-6">
                            {/* Search Bar */}
                            <div className="mb-6">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Search by caterer name or location..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Caterer List */}
                            <div className="space-y-4">
                                {filteredCaterers.map((caterer, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => handleCatererSelect(caterer)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{caterer.name}</h4>
                                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{caterer.location}</span>
                                                </div>
                                            </div>
                                            <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                                                Provide Feedback
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {filteredCaterers.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <Utensils className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-2">No caterers found matching your search.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Feedback Form Section */
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Caterer Feedback</h3>
                                    <div className="mt-2">
                                        <h4 className="font-medium text-gray-900">{selectedCaterer.name}</h4>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                            <MapPin className="h-4 w-4" />
                                            <span>Location: {selectedCaterer.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCaterer(null)}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Change Caterer
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            {/* Feedback Questions */}
                            <div className="space-y-8">
                                {questions.map((question, index) => (
                                    <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                                        <label className="block text-sm font-medium text-gray-700 mb-4">
                                            {index + 1}. {question.question}
                                        </label>
                                        <div className="space-y-3">
                                            {question.options.map((option, optionIndex) => (
                                                <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`question-${question.id}`}
                                                        value={option}
                                                        checked={feedbackData.answers[index] === option}
                                                        onChange={() => handleAnswerChange(index, option)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <span className="text-sm text-gray-700">{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Additional Comments */}
                                <div>
                                    <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
                                        Additional Comments (Optional)
                                    </label>
                                    <textarea
                                        id="comments"
                                        name="comments"
                                        rows={4}
                                        value={feedbackData.additionalComments}
                                        onChange={(e) => setFeedbackData(prev => ({
                                            ...prev,
                                            additionalComments: e.target.value
                                        }))}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Any additional feedback about the food quality, service, or suggestions for improvement..."
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={!isFormComplete}
                                    className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                        isFormComplete
                                            ? 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                            : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <CheckCircle className="h-4 w-4" />
                                    Submit Feedback
                                </button>
                                {!isFormComplete && (
                                    <p className="text-sm text-gray-500 text-center mt-2">
                                        Please answer all questions before submitting
                                    </p>
                                )}
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CatererFeedback;

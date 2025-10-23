import { useState } from 'react';
import { Search, Utensils, MapPin, CheckCircle, CheckCircle2, XCircle } from 'lucide-react';

const CatererFeedback = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCaterer, setSelectedCaterer] = useState<any>(null);
    const [feedbackData, setFeedbackData] = useState({
        answers: ['', '', '', '', ''],
        additionalComments: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [submittedResponse, setSubmittedResponse] = useState<any>(null);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Caterer feedback submitted:', {
                caterer: selectedCaterer,
                feedback: feedbackData
            });

            // Store submitted response for visualization
            setSubmittedResponse({
                caterer: selectedCaterer,
                responses: feedbackData.answers,
                questions: questions
            });

            setSuccess('Thank you for your feedback! Your input helps us improve our food services.');

            // Show results visualization
            setShowResults(true);

        } catch (err) {
            setError('Failed to submit feedback. Please try again.');
        } finally {
            setSubmitting(false);
        }
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
                            {/* Success Message */}
                            {success && (
                                <div className="mb-6 rounded-md bg-green-50 p-4">
                                    <div className="flex">
                                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                                        <div className="ml-3">
                                            <p className="text-sm text-green-800">{success}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 rounded-md bg-red-50 p-4">
                                    <div className="flex">
                                        <XCircle className="h-5 w-5 text-red-400" />
                                        <div className="ml-3">
                                            <p className="text-sm text-red-800">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                    disabled={!isFormComplete || submitting}
                                    className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                        isFormComplete && !submitting
                                            ? 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                            : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <CheckCircle className="h-4 w-4" />
                                    {submitting ? 'Submitting...' : 'Submit Feedback'}
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

                {/* Results Visualization */}
                {showResults && submittedResponse && (
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mt-6">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Your Feedback Summary</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Feedback for: {submittedResponse.caterer.name}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowResults(false);
                                        setSubmittedResponse(null);
                                        setSelectedCaterer(null);
                                        setFeedbackData({
                                            answers: ['', '', '', '', ''],
                                            additionalComments: ''
                                        });
                                        setSuccess('');
                                    }}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Submit Another Feedback
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="space-y-6">
                                {/* Visual Rating Bars */}
                                {submittedResponse.questions.map((question: any, index: number) => {
                                    const response = submittedResponse.responses[index];
                                    const totalOptions = question.options.length;
                                    const responseIndex = question.options.indexOf(response);
                                    const percentage = ((responseIndex + 1) / totalOptions) * 100;

                                    // Determine color based on rating
                                    let barColor = 'bg-red-500';
                                    if (percentage >= 80) barColor = 'bg-green-500';
                                    else if (percentage >= 60) barColor = 'bg-yellow-500';
                                    else if (percentage >= 40) barColor = 'bg-orange-500';

                                    return (
                                        <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                                            <div className="mb-2">
                                                <p className="text-sm font-medium text-gray-700">
                                                    {index + 1}. {question.question}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <div className="relative pt-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-xs font-semibold inline-block text-blue-600">
                                                                Your Rating: {response}
                                                            </span>
                                                            <span className="text-xs font-semibold inline-block text-gray-600">
                                                                {Math.round(percentage)}%
                                                            </span>
                                                        </div>
                                                        <div className="overflow-hidden h-3 text-xs flex rounded bg-gray-200">
                                                            <div
                                                                style={{ width: `${percentage}%` }}
                                                                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${barColor} transition-all duration-500`}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Overall Score Card */}
                                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mt-6">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Overall Satisfaction</h4>
                                    <div className="flex items-center justify-center">
                                        <div className="text-center">
                                            {(() => {
                                                const averagePercentage = submittedResponse.responses.reduce((sum: number, response: string, idx: number) => {
                                                    const question = submittedResponse.questions[idx];
                                                    const responseIndex = question.options.indexOf(response);
                                                    return sum + ((responseIndex + 1) / question.options.length) * 100;
                                                }, 0) / submittedResponse.responses.length;

                                                const roundedScore = Math.round(averagePercentage);
                                                let scoreColor = 'text-red-600';
                                                let scoreLabel = 'Needs Improvement';

                                                if (roundedScore >= 80) {
                                                    scoreColor = 'text-green-600';
                                                    scoreLabel = 'Excellent';
                                                } else if (roundedScore >= 60) {
                                                    scoreColor = 'text-yellow-600';
                                                    scoreLabel = 'Good';
                                                } else if (roundedScore >= 40) {
                                                    scoreColor = 'text-orange-600';
                                                    scoreLabel = 'Fair';
                                                }

                                                return (
                                                    <>
                                                        <div className={`text-6xl font-bold ${scoreColor}`}>
                                                            {roundedScore}%
                                                        </div>
                                                        <div className="text-lg font-medium text-gray-700 mt-2">
                                                            {scoreLabel}
                                                        </div>
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            Based on your ratings
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                {/* Thank You Message */}
                                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <CheckCircle className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-blue-700">
                                                <span className="font-medium">Thank you for your valuable feedback!</span>
                                                <br />
                                                Your responses help {submittedResponse.caterer.name} improve their services and food quality.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CatererFeedback;

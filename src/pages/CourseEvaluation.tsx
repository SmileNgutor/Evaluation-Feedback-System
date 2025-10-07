import { useState } from 'react';
import { Search, GraduationCap, User, Star, CheckCircle } from 'lucide-react';

const CourseEvaluation = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [evaluationData, setEvaluationData] = useState({
        answers: ['', '', '', '', ''],
        additionalComments: ''
    });

    // Dummy course data
    const courses = [
        {
            code: 'AUN 300',
            title: 'Advanced University Studies',
            instructor: 'Dr. Sarah Johnson',
            department: 'General Education'
        },
        {
            code: 'AUN 101',
            title: 'Introduction to University Studies',
            instructor: 'Prof. Michael Chen',
            department: 'General Education'
        }
    ];

    const questions = [
        {
            id: 1,
            question: 'How would you rate the overall quality of this course?',
            type: 'likert',
            options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
        },
        {
            id: 2,
            question: 'The course objectives were clearly stated and met',
            type: 'likert',
            options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
            id: 3,
            question: 'The instructor was well-prepared and organized',
            type: 'likert',
            options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
            id: 4,
            question: 'The course materials were relevant and helpful',
            type: 'likert',
            options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        },
        {
            id: 5,
            question: 'How much did this course contribute to your learning?',
            type: 'likert',
            options: ['Not at all', 'Slightly', 'Moderately', 'Very Much', 'Extremely']
        }
    ];

    const filteredCourses = courses.filter(course =>
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCourseSelect = (course: any) => {
        setSelectedCourse(course);
        setEvaluationData({
            answers: ['', '', '', '', ''],
            additionalComments: ''
        });
    };

    const handleAnswerChange = (questionIndex: number, answer: string) => {
        const newAnswers = [...evaluationData.answers];
        newAnswers[questionIndex] = answer;
        setEvaluationData(prev => ({
            ...prev,
            answers: newAnswers
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Evaluation submitted:', {
            course: selectedCourse,
            evaluation: evaluationData
        });
        alert('Evaluation submitted successfully!');
    };

    const isFormComplete = evaluationData.answers.every(answer => answer !== '');

    return (
        <div className="py-6">
            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white shadow-sm sm:rounded-lg mb-6">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                            <GraduationCap />
                            Course Evaluation
                        </h2>
                    </div>
                </div>

                {!selectedCourse ? (
                    /* Course Search Section */
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Select Course to Evaluate</h3>
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
                                        placeholder="Search by course code or title..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Course List */}
                            <div className="space-y-4">
                                {filteredCourses.map((course, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => handleCourseSelect(course)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{course.code}: {course.title}</h4>
                                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                                    <User className="h-4 w-4" />
                                                    <span>{course.instructor}</span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">{course.department}</p>
                                            </div>
                                            <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                                                Evaluate
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {filteredCourses.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-2">No courses found matching your search.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Evaluation Form Section */
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Course Evaluation</h3>
                                    <div className="mt-2">
                                        <h4 className="font-medium text-gray-900">{selectedCourse.code}: {selectedCourse.title}</h4>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                            <User className="h-4 w-4" />
                                            <span>Instructor: {selectedCourse.instructor}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCourse(null)}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Change Course
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            {/* Evaluation Questions */}
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
                                                        checked={evaluationData.answers[index] === option}
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
                                        value={evaluationData.additionalComments}
                                        onChange={(e) => setEvaluationData(prev => ({
                                            ...prev,
                                            additionalComments: e.target.value
                                        }))}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Any additional feedback about the course or instructor..."
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
                                            ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                            : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <CheckCircle className="h-4 w-4" />
                                    Submit Evaluation
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

export default CourseEvaluation;

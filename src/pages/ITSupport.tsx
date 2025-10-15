import { useState, useEffect } from 'react';
import { Search, GraduationCap, Utensils, Filter, Download, Eye, User, MapPin, Star } from 'lucide-react';

// Mock data structure based on your student forms
interface Evaluation {
    id: string;
    type: 'course' | 'caterer';
    course?: {
        code: string;
        title: string;
        instructor: string;
        department: string;
    };
    caterer?: {
        name: string;
        location: string;
    };
    answers: string[];
    additionalComments: string;
    submittedAt: string;
    studentId: string;
}

const FeedbackAdminView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'course' | 'caterer'>('all');
    const [selectedFeedback, setSelectedFeedback] = useState<Evaluation | null>(null);
    const [feedbackData, setFeedbackData] = useState<Evaluation[]>([]);

    // Mock data - in real app, this would come from your backend
    useEffect(() => {
        // Simulating API call
        const mockFeedback: Evaluation[] = [
            {
                id: '1',
                type: 'course',
                course: {
                    code: 'AUN 300',
                    title: 'Advanced University Studies',
                    instructor: 'Dr. Sarah Johnson',
                    department: 'General Education'
                },
                answers: ['Excellent', 'Strongly Agree', 'Agree', 'Strongly Agree', 'Very Much'],
                additionalComments: 'Great course with engaging content. The instructor was very knowledgeable.',
                submittedAt: '2024-01-15T10:30:00Z',
                studentId: 'STU001'
            },
            {
                id: '2',
                type: 'course',
                course: {
                    code: 'AUN 101',
                    title: 'Introduction to University Studies',
                    instructor: 'Prof. Michael Chen',
                    department: 'General Education'
                },
                answers: ['Good', 'Agree', 'Neutral', 'Agree', 'Moderately'],
                additionalComments: 'Good introductory course, but could use more practical examples.',
                submittedAt: '2024-01-14T14:20:00Z',
                studentId: 'STU002'
            },
            {
                id: '3',
                type: 'caterer',
                caterer: {
                    name: 'Rich John Foodies',
                    location: 'Pizzeria'
                },
                answers: ['Very Good', 'Agree', 'Strongly Agree', 'Good', 'Agree'],
                additionalComments: 'Pizza was delicious but waiting time was a bit long during peak hours.',
                submittedAt: '2024-01-16T12:45:00Z',
                studentId: 'STU003'
            },
            {
                id: '4',
                type: 'caterer',
                caterer: {
                    name: 'Gee Mama Ketch',
                    location: 'Main Cafeteria'
                },
                answers: ['Excellent', 'Strongly Agree', 'Agree', 'Excellent', 'Strongly Agree'],
                additionalComments: 'Best food on campus! Always fresh and tasty.',
                submittedAt: '2024-01-13T09:15:00Z',
                studentId: 'STU004'
            }
        ];
        setFeedbackData(mockFeedback);
    }, []);

    const filteredFeedback = feedbackData.filter(feedback => {
        const matchesSearch =
            (feedback.type === 'course' &&
                (feedback.course?.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    feedback.course?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    feedback.course?.instructor.toLowerCase().includes(searchTerm.toLowerCase()))) ||
            (feedback.type === 'caterer' &&
                (feedback.caterer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    feedback.caterer?.location.toLowerCase().includes(searchTerm.toLowerCase()))) ||
            feedback.additionalComments.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === 'all' || feedback.type === filterType;

        return matchesSearch && matchesType;
    });

    const questions = {
        course: [
            'How would you rate the overall quality of this course?',
            'The course objectives were clearly stated and met',
            'The instructor was well-prepared and organized',
            'The course materials were relevant and helpful',
            'How much did this course contribute to your learning?'
        ],
        caterer: [
            'How would you rate the overall food quality?',
            'The food was fresh and properly prepared',
            'The portion sizes were adequate and satisfying',
            'How would you rate the value for money?',
            'The service was prompt and efficient'
        ]
    };

    const getRatingColor = (rating: string) => {
        if (rating.includes('Excellent') || rating.includes('Strongly Agree') || rating.includes('Extremely'))
            return 'text-green-600 bg-green-100';
        if (rating.includes('Very Good') || rating.includes('Agree') || rating.includes('Very Much'))
            return 'text-blue-600 bg-blue-100';
        if (rating.includes('Good') || rating.includes('Neutral') || rating.includes('Moderately'))
            return 'text-yellow-600 bg-yellow-100';
        if (rating.includes('Fair') || rating.includes('Disagree') || rating.includes('Slightly'))
            return 'text-orange-600 bg-orange-100';
        return 'text-red-600 bg-red-100';
    };

    const exportToCSV = () => {
        // Simple CSV export implementation
        const headers = ['Type', 'Name', 'Instructor/Location', 'Rating 1', 'Rating 2', 'Rating 3', 'Rating 4', 'Rating 5', 'Comments', 'Submitted At'];
        const csvData = filteredFeedback.map(feedback => [
            feedback.type,
            feedback.type === 'course' ? `${feedback.course?.code}: ${feedback.course?.title}` : feedback.caterer?.name,
            feedback.type === 'course' ? feedback.course?.instructor : feedback.caterer?.location,
            ...feedback.answers,
            `"${feedback.additionalComments}"`,
            new Date(feedback.submittedAt).toLocaleDateString()
        ]);

        const csvContent = [headers, ...csvData]
            .map(row => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `feedback-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white shadow-sm sm:rounded-lg mb-6">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                Feedback Administration
                            </h2>
                            <button
                                onClick={exportToCSV}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                <Download className="h-4 w-4" />
                                Export CSV
                            </button>
                        </div>
                    </div>
                </div>

                {!selectedFeedback ? (
                    /* Feedback List View */
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                                <div className="relative flex-1 max-w-md">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Search feedback..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Filter className="h-5 w-5 text-gray-400 mt-2" />
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value as any)}
                                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">All Feedback</option>
                                        <option value="course">Course Evaluations</option>
                                        <option value="caterer">Caterer Feedback</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                {filteredFeedback.map((feedback) => (
                                    <div
                                        key={feedback.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => setSelectedFeedback(feedback)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    {feedback.type === 'course' ? (
                                                        <GraduationCap className="h-5 w-5 text-blue-600" />
                                                    ) : (
                                                        <Utensils className="h-5 w-5 text-green-600" />
                                                    )}
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        feedback.type === 'course' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                            {feedback.type === 'course' ? 'Course Evaluation' : 'Caterer Feedback'}
                          </span>
                                                    <span className="text-sm text-gray-500">
                            {new Date(feedback.submittedAt).toLocaleDateString()}
                          </span>
                                                </div>

                                                <h4 className="font-semibold text-gray-800">
                                                    {feedback.type === 'course'
                                                        ? `${feedback.course?.code}: ${feedback.course?.title}`
                                                        : feedback.caterer?.name
                                                    }
                                                </h4>

                                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                                    {feedback.type === 'course' ? (
                                                        <>
                                                            <User className="h-4 w-4" />
                                                            <span>{feedback.course?.instructor}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <MapPin className="h-4 w-4" />
                                                            <span>{feedback.caterer?.location}</span>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Rating Summary */}
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {feedback.answers.slice(0, 3).map((answer, index) => (
                                                        <span
                                                            key={index}
                                                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getRatingColor(answer)}`}
                                                        >
                              <Star className="h-3 w-3 mr-1 fill-current" />
                                                            {answer}
                            </span>
                                                    ))}
                                                </div>

                                                {feedback.additionalComments && (
                                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                        "{feedback.additionalComments}"
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-blue-600 ml-4">
                                                <Eye className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {filteredFeedback.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        <Eye className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-2 text-lg font-medium">No feedback found</p>
                                        <p className="mt-1">Try adjusting your search or filter criteria</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Feedback Detail View */
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {selectedFeedback.type === 'course' ? 'Course Evaluation Details' : 'Caterer Feedback Details'}
                                    </h3>
                                    <div className="mt-2">
                                        <h4 className="font-medium text-gray-900">
                                            {selectedFeedback.type === 'course'
                                                ? `${selectedFeedback.course?.code}: ${selectedFeedback.course?.title}`
                                                : selectedFeedback.caterer?.name
                                            }
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                            {selectedFeedback.type === 'course' ? (
                                                <>
                                                    <User className="h-4 w-4" />
                                                    <span>Instructor: {selectedFeedback.course?.instructor}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>Department: {selectedFeedback.course?.department}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <MapPin className="h-4 w-4" />
                                                    <span>Location: {selectedFeedback.caterer?.location}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            Submitted on {new Date(selectedFeedback.submittedAt).toLocaleString()} • Student ID: {selectedFeedback.studentId}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedFeedback(null)}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Back to List
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Questions and Answers */}
                            <div className="space-y-6">
                                {selectedFeedback.answers.map((answer, index) => (
                                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                                            {index + 1}. {questions[selectedFeedback.type][index]}
                                        </h4>
                                        <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(answer)}`}>
                        <Star className="h-3 w-3 mr-1 fill-current" />
                          {answer}
                      </span>
                                        </div>
                                    </div>
                                ))}

                                {/* Additional Comments */}
                                {selectedFeedback.additionalComments && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Comments</h4>
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <p className="text-gray-700 whitespace-pre-wrap">{selectedFeedback.additionalComments}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackAdminView;

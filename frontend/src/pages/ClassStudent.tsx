import { useState } from 'react';
import { Search, Building, MapPin, AlertTriangle, AlertCircle, Wrench, Clock, CheckCircle, CheckCircle2, XCircle } from 'lucide-react';

const ClassroomMaintenance = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClassroom, setSelectedClassroom] = useState<any>(null);
    const [ticketData, setTicketData] = useState({
        issueType: '',
        description: '',
        priority: 'medium',
        specificLocation: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showTicketSummary, setShowTicketSummary] = useState(false);
    const [submittedTicket, setSubmittedTicket] = useState<any>(null);

    // Dummy classroom data
    const classrooms = [
        { id: 1, code: 'A-101', building: 'Building A', floor: '1st Floor', capacity: 30 },
        { id: 2, code: 'A-102', building: 'Building A', floor: '1st Floor', capacity: 25 },
        { id: 3, code: 'A-201', building: 'Building A', floor: '2nd Floor', capacity: 40 },
        { id: 4, code: 'B-101', building: 'Building B', floor: '1st Floor', capacity: 35 },
        { id: 5, code: 'B-205', building: 'Building B', floor: '2nd Floor', capacity: 28 },
        { id: 6, code: 'C-301', building: 'Building C', floor: '3rd Floor', capacity: 50 },
        { id: 7, code: 'LIB-001', building: 'Library', floor: 'Ground Floor', capacity: 100 },
        { id: 8, code: 'LAB-101', building: 'Science Building', floor: '1st Floor', capacity: 20 }
    ];

    const issueTypes = [
        'Furniture Damage',
        'Electrical Problem',
        'HVAC Issue',
        'Projector/Screen',
        'Lighting',
        'Cleaning Required',
        'Window/Door',
        'Whiteboard/Markers',
        'Computer/Equipment',
        'Other'
    ];

    const filteredClassrooms = classrooms.filter(classroom =>
        classroom.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classroom.building.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleClassroomSelect = (classroom: any) => {
        setSelectedClassroom(classroom);
        setTicketData({
            issueType: '',
            description: '',
            priority: 'medium',
            specificLocation: ''
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTicketData(prev => ({
            ...prev,
            [name]: value
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

            console.log('Maintenance ticket submitted:', {
                classroom: selectedClassroom,
                ticket: ticketData
            });

            // Generate ticket number
            const ticketNumber = `MNT-${Date.now().toString().slice(-6)}`;

            // Store submitted ticket for visualization
            setSubmittedTicket({
                ticketNumber,
                classroom: selectedClassroom,
                ...ticketData,
                submittedAt: new Date()
            });

            setSuccess('Maintenance ticket submitted successfully! Our team will address the issue soon.');

            // Show ticket summary
            setShowTicketSummary(true);

        } catch (err) {
            setError('Failed to submit maintenance ticket. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const isFormValid = ticketData.issueType && ticketData.description;

    return (
        <div className="py-6">
            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white shadow-sm sm:rounded-lg mb-6">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                            <Wrench />
                            Classroom Maintenance
                        </h2>
                    </div>
                </div>

                {!selectedClassroom ? (
                    /* Classroom Search Section */
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Select Classroom</h3>
                            <p className="text-sm text-gray-600 mt-1">Search and select a classroom to report maintenance issues</p>
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
                                        placeholder="Search by classroom code or building..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Classroom List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredClassrooms.map((classroom) => (
                                    <div
                                        key={classroom.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => handleClassroomSelect(classroom)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-800 text-lg">{classroom.code}</h4>
                                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                                    <Building className="h-4 w-4" />
                                                    <span>{classroom.building}</span>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{classroom.floor}</span>
                                                    </div>
                                                    <span>Capacity: {classroom.capacity}</span>
                                                </div>
                                            </div>
                                            <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                                                Report Issue
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {filteredClassrooms.length === 0 && (
                                    <div className="col-span-2 text-center py-8 text-gray-500">
                                        <Building className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-2">No classrooms found matching your search.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Maintenance Ticket Form */
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Report Maintenance Issue</h3>
                                    <div className="mt-2">
                                        <h4 className="font-medium text-gray-900">{selectedClassroom.code}</h4>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Building className="h-4 w-4" />
                                                <span>{selectedClassroom.building}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                <span>{selectedClassroom.floor}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedClassroom(null)}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Change Classroom
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

                            <div className="space-y-6">
                                {/* Issue Type */}
                                <div>
                                    <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-2">
                                        Issue Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="issueType"
                                        name="issueType"
                                        value={ticketData.issueType}
                                        onChange={handleChange}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                        required
                                    >
                                        <option value="">Select issue type</option>
                                        {issueTypes.map((type, index) => (
                                            <option key={index} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Specific Location in Classroom */}
                                <div>
                                    <label htmlFor="specificLocation" className="block text-sm font-medium text-gray-700 mb-2">
                                        Specific Location in Classroom
                                    </label>
                                    <input
                                        type="text"
                                        id="specificLocation"
                                        name="specificLocation"
                                        value={ticketData.specificLocation}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="e.g., Back row, Front left desk, Teacher's desk, etc."
                                    />
                                </div>

                                {/* Priority */}
                                <div>
                                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                                        Priority Level
                                    </label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={ticketData.priority}
                                        onChange={handleChange}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option value="low">Low - Minor inconvenience</option>
                                        <option value="medium">Medium - Affects learning</option>
                                        <option value="high">High - Safety hazard</option>
                                        <option value="urgent">Urgent - Immediate attention needed</option>
                                    </select>
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Detailed Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        value={ticketData.description}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Please describe the issue in detail. Include what's broken, when you noticed it, and how it affects the classroom..."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={!isFormValid || submitting}
                                    className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                        isFormValid && !submitting
                                            ? 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                                            : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <AlertTriangle className="h-4 w-4" />
                                    {submitting ? 'Submitting...' : 'Submit Maintenance Ticket'}
                                </button>
                                {!isFormValid && (
                                    <p className="text-sm text-gray-500 text-center mt-2">
                                        Please fill in all required fields
                                    </p>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {/* Recent Tickets Preview */}
                {!selectedClassroom && (
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mt-6">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Recent Maintenance Requests
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                                <AlertTriangle className="flex-none mt-0.5 text-yellow-500" />
                                <div>
                                    <p className="font-medium text-sm">Broken Chair - A-101</p>
                                    <p className="text-xs text-gray-500">Back row, left side • 2 hours ago</p>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    In Progress
                  </span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                <CheckCircle className="flex-none mt-0.5 text-green-500" />
                                <div>
                                    <p className="font-medium text-sm">Projector Fixed - B-205</p>
                                    <p className="text-xs text-gray-500">Front of classroom • 1 day ago</p>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Resolved
                  </span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                <Clock className="flex-none mt-0.5 text-blue-500" />
                                <div>
                                    <p className="font-medium text-sm">AC Not Working - C-301</p>
                                    <p className="text-xs text-gray-500">Whole room • 3 days ago</p>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Scheduled
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Ticket Summary Visualization */}
                {showTicketSummary && submittedTicket && (
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mt-6">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-yellow-50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                                        Ticket Submitted Successfully!
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Ticket #{submittedTicket.ticketNumber}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowTicketSummary(false);
                                        setSubmittedTicket(null);
                                        setSelectedClassroom(null);
                                        setSuccess('');
                                    }}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Submit Another Ticket
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Ticket Details Card */}
                                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Building className="h-5 w-5 text-blue-600" />
                                        Location Details
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Classroom</p>
                                            <p className="text-sm font-medium text-gray-900">{submittedTicket.classroom.code}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Building</p>
                                            <p className="text-sm font-medium text-gray-900">{submittedTicket.classroom.building}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Floor</p>
                                            <p className="text-sm font-medium text-gray-900">{submittedTicket.classroom.floor}</p>
                                        </div>
                                        {submittedTicket.specificLocation && (
                                            <div>
                                                <p className="text-xs text-gray-500">Specific Location</p>
                                                <p className="text-sm font-medium text-gray-900">{submittedTicket.specificLocation}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Issue Details Card */}
                                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                                        Issue Details
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Issue Type</p>
                                            <p className="text-sm font-medium text-gray-900">{submittedTicket.issueType}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Priority</p>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                submittedTicket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                                submittedTicket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                                submittedTicket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                                {submittedTicket.priority.charAt(0).toUpperCase() + submittedTicket.priority.slice(1)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Submitted</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {submittedTicket.submittedAt.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description Card */}
                            <div className="border border-gray-200 rounded-lg p-4 bg-white mt-6">
                                <h4 className="font-semibold text-gray-800 mb-2">Issue Description</h4>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">{submittedTicket.description}</p>
                            </div>

                            {/* Status Timeline */}
                            <div className="border border-gray-200 rounded-lg p-4 bg-white mt-6">
                                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                    Expected Timeline
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Ticket Submitted</p>
                                            <p className="text-xs text-gray-500">Just now</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <Clock className="h-5 w-5 text-blue-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Under Review</p>
                                            <p className="text-xs text-gray-500">Within 2 hours</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                <Wrench className="h-5 w-5 text-gray-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">In Progress</p>
                                            <p className="text-xs text-gray-500">
                                                {submittedTicket.priority === 'urgent' ? '2-4 hours' :
                                                 submittedTicket.priority === 'high' ? '4-8 hours' :
                                                 submittedTicket.priority === 'medium' ? '1-2 days' :
                                                 '2-3 days'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                <CheckCircle className="h-5 w-5 text-gray-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Resolved</p>
                                            <p className="text-xs text-gray-500">Estimated completion</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Banner */}
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertCircle className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-blue-700">
                                            <span className="font-medium">Ticket Reference: {submittedTicket.ticketNumber}</span>
                                            <br />
                                            You will receive email updates about your maintenance request. Our team will review and address this issue based on the priority level.
                                        </p>
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

export default ClassroomMaintenance;

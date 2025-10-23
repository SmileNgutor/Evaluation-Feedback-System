import { useState } from 'react';
import { HardDrive, AlertCircle, Clock, CheckCircle, CheckCircle2, XCircle } from 'lucide-react';

const ITSupportStudent = () => {
  const [formData, setFormData] = useState({
    issueType: '',
    description: '',
    priority: 'medium',
    location: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showTicketSummary, setShowTicketSummary] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call - Replace this with actual backend call when ready
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('IT Support ticket submitted:', formData);

      // Generate ticket number
      const ticketNumber = `IT-${Date.now().toString().slice(-6)}`;

      // Store submitted ticket
      setSubmittedTicket({
        ticketNumber,
        ...formData,
        submittedAt: new Date()
      });

      setSuccess('Your IT support ticket has been submitted successfully! Our team will contact you shortly.');

      // Show ticket summary
      setShowTicketSummary(true);

    } catch (err) {
      setError('Failed to submit ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-sm sm:rounded-lg mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
              <HardDrive />
              IT Support - Student Portal
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submit Ticket Form */}
          <div className="lg:col-span-2">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Submit IT Support Ticket</h3>
              </div>
              <div className="p-6">
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

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="issueType" className="block text-sm font-medium text-gray-700">
                      Issue Type
                    </label>
                    <select
                      id="issueType"
                      name="issueType"
                      value={formData.issueType}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      required
                    >
                      <option value="">Select issue type</option>
                      <option value="wifi">WiFi Connection</option>
                      <option value="software">Software Installation</option>
                      <option value="hardware">Hardware Problem</option>
                      <option value="account">Account Access</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g., Room 205, Library, Building A"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Please describe your issue in detail..."
                      required
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        submitting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                      }`}
                    >
                      {submitting ? 'Submitting...' : 'Submit Ticket'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Recent Tickets */}
          <div className="lg:col-span-1">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Recent Tickets</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="flex-none mt-0.5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-sm">WiFi Connection Issue</p>
                    <p className="text-xs text-gray-500">Room 205 • 2 hours ago</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      In Progress
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="flex-none mt-0.5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">Software Installation</p>
                    <p className="text-xs text-gray-500">Computer Lab • 1 day ago</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Resolved
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Clock className="flex-none mt-0.5 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">Account Access Problem</p>
                    <p className="text-xs text-gray-500">Library • 3 days ago</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Summary Visualization */}
        {showTicketSummary && submittedTicket && (
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mt-6">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
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
                    setFormData({
                      issueType: '',
                      description: '',
                      priority: 'medium',
                      location: ''
                    });
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
                {/* Ticket Details */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-blue-600" />
                    Ticket Details
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Issue Type</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {submittedTicket.issueType.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-900">{submittedTicket.location}</p>
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

                {/* Expected Response Time */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    Expected Response Time
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Ticket Created</p>
                        <p className="text-xs text-gray-500">Just now</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Clock className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Initial Response</p>
                        <p className="text-xs text-gray-500">
                          {submittedTicket.priority === 'urgent' ? 'Within 1 hour' :
                           submittedTicket.priority === 'high' ? 'Within 2 hours' :
                           submittedTicket.priority === 'medium' ? 'Within 4 hours' :
                           'Within 8 hours'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-gray-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Resolution</p>
                        <p className="text-xs text-gray-500">
                          {submittedTicket.priority === 'urgent' ? '2-4 hours' :
                           submittedTicket.priority === 'high' ? '4-8 hours' :
                           submittedTicket.priority === 'medium' ? '1-2 business days' :
                           '2-3 business days'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Issue Description */}
              <div className="border border-gray-200 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-gray-800 mb-2">Issue Description</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{submittedTicket.description}</p>
              </div>

              {/* Next Steps */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">What Happens Next?</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Our IT support team has received your ticket and will review it shortly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>You will receive email updates at each stage of the ticket resolution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>If urgent, a technician may contact you directly at the provided location</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>You can track your ticket status using reference number: {submittedTicket.ticketNumber}</span>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <HardDrive className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Need immediate assistance?</span>
                      <br />
                      Contact IT Support directly: support@aun.edu.ng | Ext: 2500
                      <br />
                      Reference your ticket number: {submittedTicket.ticketNumber}
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

export default ITSupportStudent; 
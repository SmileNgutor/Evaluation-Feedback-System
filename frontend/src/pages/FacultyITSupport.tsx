import { useState, useEffect } from 'react';
import {
  HardDrive, Plus, Search, Filter, Clock, CheckCircle,
  AlertCircle, XCircle, Eye, RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Ticket {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  location?: string;
  submitter: {
    full_name: string;
    aun_id: string;
  };
  assigned_to?: {
    full_name: string;
  };
}

const FacultyITSupport = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'hardware',
    priority: 'medium',
    location: ''
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch IT tickets from backend
      // For now, using simulated data
      const simulatedTickets: Ticket[] = [
        {
          id: 1,
          title: 'Projector Not Working',
          description: 'The projector in Room A-101 is not turning on',
          category: 'hardware',
          priority: 'high',
          status: 'in_progress',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 3600000).toISOString(),
          location: 'Room A-101',
          submitter: {
            full_name: user?.full_name || 'John Doe',
            aun_id: user?.aun_id || '123456'
          }
        },
        {
          id: 2,
          title: 'Internet Connection Issues',
          description: 'WiFi keeps disconnecting in Building B',
          category: 'network',
          priority: 'medium',
          status: 'pending',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date(Date.now() - 172800000).toISOString(),
          location: 'Building B',
          submitter: {
            full_name: user?.full_name || 'Jane Smith',
            aun_id: user?.aun_id || '654321'
          }
        }
      ];
      setTickets(simulatedTickets);
    } catch (error: any) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tickets];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    setFilteredTickets(filtered);
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In real implementation, this would POST to backend
      const newTicket: Ticket = {
        id: Math.floor(Math.random() * 10000),
        ...formData,
        priority: formData.priority as Ticket['priority'],
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        submitter: {
          full_name: user?.full_name || 'Unknown',
          aun_id: user?.aun_id || '000000'
        }
      };

      setTickets(prev => [newTicket, ...prev]);
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        category: 'hardware',
        priority: 'medium',
        location: ''
      });
      alert('IT ticket created successfully!');
    } catch (error: any) {
      alert('Failed to create ticket');
    }
  };

  const viewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return badges[priority as keyof typeof badges] || badges.medium;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in_progress':
        return <AlertCircle className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'closed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Statistics
  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === 'pending').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-sm sm:rounded-lg mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                  <HardDrive className="w-6 h-6" />
                  IT Support Tickets
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Submit and track IT support requests
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={fetchTickets}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Ticket
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Tickets</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <HardDrive className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{stats.resolved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-sm sm:rounded-lg mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="inline w-4 h-4 mr-2" />
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tickets..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline w-4 h-4 mr-2" />
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline w-4 h-4 mr-2" />
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white shadow-sm sm:rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Your Tickets</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Loading tickets...</p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <HardDrive className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">No tickets found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => viewTicket(ticket)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(ticket.status)}
                          <h4 className="font-semibold text-gray-900">{ticket.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(ticket.status)}`}>
                            {ticket.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityBadge(ticket.priority)}`}>
                            {ticket.priority.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">{ticket.category}</span>
                          {ticket.location && (
                            <span className="text-xs text-gray-500">📍 {ticket.location}</span>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Eye className="w-5 h-5 text-gray-400 ml-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">Create New IT Ticket</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="hardware">Hardware</option>
                    <option value="software">Software</option>
                    <option value="network">Network</option>
                    <option value="account">Account</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Room A-101, Building B"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedTicket.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Ticket #{selectedTicket.id} • Created {new Date(selectedTicket.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowTicketModal(false);
                    setSelectedTicket(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedTicket.status)}`}>
                  {getStatusIcon(selectedTicket.status)}
                  <span className="ml-2">{selectedTicket.status.replace('_', ' ').toUpperCase()}</span>
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadge(selectedTicket.priority)}`}>
                  {selectedTicket.priority.toUpperCase()} Priority
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {selectedTicket.category}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>

              {selectedTicket.location && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Location</h4>
                  <p className="text-gray-700">{selectedTicket.location}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Submitted By</h4>
                <p className="text-gray-700">
                  {selectedTicket.submitter.full_name} ({selectedTicket.submitter.aun_id})
                </p>
              </div>

              {selectedTicket.assigned_to && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned To</h4>
                  <p className="text-gray-700">{selectedTicket.assigned_to.full_name}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Created</h4>
                  <p className="text-gray-700">{new Date(selectedTicket.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Last Updated</h4>
                  <p className="text-gray-700">{new Date(selectedTicket.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setShowTicketModal(false);
                  setSelectedTicket(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyITSupport;

import { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, MessageSquare, User, Building, MapPin, Clock, AlertTriangle, CheckCircle, XCircle, HardDrive, Wrench } from 'lucide-react';

interface Ticket {
    id: string;
    type: 'it' | 'maintenance';
    status: 'pending' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    title: string;
    description: string;
    location: string;
    specificLocation?: string;
    issueType: string;
    submittedBy: string;
    submittedAt: string;
    assignedTo?: string;
    notes?: string;
    resolvedAt?: string;
}

const TicketManagementAdmin = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'it' | 'maintenance'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in-progress' | 'resolved' | 'closed'>('all');
    const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [adminNotes, setAdminNotes] = useState('');

    // Mock data - in real app, this would come from your backend
    useEffect(() => {
        const mockTickets: Ticket[] = [
            {
                id: 'IT-001',
                type: 'it',
                status: 'in-progress',
                priority: 'high',
                title: 'WiFi Connection Issue',
                description: 'Unable to connect to campus WiFi in Room 205. Multiple devices affected.',
                location: 'Room 205, Building A',
                issueType: 'wifi',
                submittedBy: 'STU001',
                submittedAt: '2024-01-15T10:30:00Z',
                assignedTo: 'IT Support Team',
                notes: 'Router reset performed, monitoring connection stability.'
            },
            {
                id: 'IT-002',
                type: 'it',
                status: 'resolved',
                priority: 'medium',
                title: 'Software Installation Request',
                description: 'Need MATLAB installed on computer lab machines for engineering course.',
                location: 'Computer Lab, Science Building',
                issueType: 'software',
                submittedBy: 'STU002',
                submittedAt: '2024-01-14T14:20:00Z',
                assignedTo: 'IT Support Team',
                resolvedAt: '2024-01-15T09:00:00Z',
                notes: 'Software installed on all lab machines. User confirmed working.'
            },
            {
                id: 'MNT-001',
                type: 'maintenance',
                status: 'pending',
                priority: 'medium',
                title: 'Broken Chair',
                description: 'Chair in back row is broken and unsafe to use. Metal frame is bent.',
                location: 'A-101',
                specificLocation: 'Back row, left side',
                issueType: 'Furniture Damage',
                submittedBy: 'STU003',
                submittedAt: '2024-01-16T08:15:00Z'
            },
            {
                id: 'MNT-002',
                type: 'maintenance',
                status: 'in-progress',
                priority: 'high',
                title: 'AC Not Working',
                description: 'Air conditioning completely stopped working. Room temperature is very uncomfortable.',
                location: 'C-301',
                specificLocation: 'Whole room',
                issueType: 'HVAC Issue',
                submittedBy: 'STU004',
                submittedAt: '2024-01-15T13:45:00Z',
                assignedTo: 'Maintenance Team',
                notes: 'Technician dispatched. Diagnosing compressor issue.'
            },
            {
                id: 'IT-003',
                type: 'it',
                status: 'pending',
                priority: 'urgent',
                title: 'Server Outage',
                description: 'Student portal and email services are down across campus.',
                location: 'Campus-wide',
                issueType: 'other',
                submittedBy: 'STU005',
                submittedAt: '2024-01-16T09:00:00Z'
            },
            {
                id: 'MNT-003',
                type: 'maintenance',
                status: 'resolved',
                priority: 'low',
                title: 'Whiteboard Cleaning',
                description: 'Whiteboard needs deep cleaning as markers are not erasing properly.',
                location: 'B-205',
                specificLocation: 'Front of classroom',
                issueType: 'Cleaning Required',
                submittedBy: 'STU006',
                submittedAt: '2024-01-13T11:20:00Z',
                assignedTo: 'Cleaning Staff',
                resolvedAt: '2024-01-14T08:30:00Z',
                notes: 'Whiteboard cleaned and treated. Working properly now.'
            }
        ];
        setTickets(mockTickets);
    }, []);

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch =
            ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === 'all' || ticket.type === filterType;
        const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
        const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;

        return matchesSearch && matchesType && matchesStatus && matchesPriority;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'resolved':
            case 'closed':
                return <CheckCircle className="h-4 w-4" />;
            case 'in-progress':
                return <Clock className="h-4 w-4" />;
            case 'pending':
                return <AlertTriangle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved':
            case 'closed':
                return 'text-green-600 bg-green-100';
            case 'in-progress':
                return 'text-blue-600 bg-blue-100';
            case 'pending':
                return 'text-yellow-600 bg-yellow-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'text-red-600 bg-red-100';
            case 'high':
                return 'text-orange-600 bg-orange-100';
            case 'medium':
                return 'text-yellow-600 bg-yellow-100';
            case 'low':
                return 'text-green-600 bg-green-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getTypeIcon = (type: string) => {
        return type === 'it' ? <HardDrive className="h-4 w-4" /> : <Wrench className="h-4 w-4" />;
    };

    const updateTicketStatus = (ticketId: string, newStatus: Ticket['status']) => {
        setTickets(prev => prev.map(ticket =>
            ticket.id === ticketId
                ? {
                    ...ticket,
                    status: newStatus,
                    resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : ticket.resolvedAt
                }
                : ticket
        ));
        if (selectedTicket?.id === ticketId) {
            setSelectedTicket(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };

    const assignTicket = (ticketId: string, assignee: string) => {
        setTickets(prev => prev.map(ticket =>
            ticket.id === ticketId ? { ...ticket, assignedTo: assignee } : ticket
        ));
        if (selectedTicket?.id === ticketId) {
            setSelectedTicket(prev => prev ? { ...prev, assignedTo: assignee } : null);
        }
    };

    const addAdminNotes = (ticketId: string) => {
        if (!adminNotes.trim()) return;

        setTickets(prev => prev.map(ticket =>
            ticket.id === ticketId ? {
                ...ticket,
                notes: ticket.notes ? `${ticket.notes}\n${new Date().toLocaleString()}: ${adminNotes}` : `${new Date().toLocaleString()}: ${adminNotes}`
            } : ticket
        ));

        if (selectedTicket?.id === ticketId) {
            setSelectedTicket(prev => prev ? {
                ...prev,
                notes: prev.notes ? `${prev.notes}\n${new Date().toLocaleString()}: ${adminNotes}` : `${new Date().toLocaleString()}: ${adminNotes}`
            } : null);
        }

        setAdminNotes('');
    };

    const exportToCSV = () => {
        const headers = ['ID', 'Type', 'Status', 'Priority', 'Title', 'Description', 'Location', 'Issue Type', 'Submitted By', 'Submitted At', 'Assigned To', 'Resolved At'];
        const csvData = filteredTickets.map(ticket => [
            ticket.id,
            ticket.type.toUpperCase(),
            ticket.status,
            ticket.priority,
            `"${ticket.title}"`,
            `"${ticket.description}"`,
            ticket.location,
            ticket.issueType,
            ticket.submittedBy,
            new Date(ticket.submittedAt).toLocaleDateString(),
            ticket.assignedTo || 'Unassigned',
            ticket.resolvedAt ? new Date(ticket.resolvedAt).toLocaleDateString() : ''
        ]);

        const csvContent = [headers, ...csvData]
            .map(row => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tickets-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const stats = {
        total: tickets.length,
        pending: tickets.filter(t => t.status === 'pending').length,
        inProgress: tickets.filter(t => t.status === 'in-progress').length,
        resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
        urgent: tickets.filter(t => t.priority === 'urgent').length
    };

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white shadow-sm sm:rounded-lg mb-6">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                                <HardDrive className="h-5 w-5" />
                                Ticket Management - Admin
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

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow border">
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        <div className="text-sm text-gray-500">Total Tickets</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border">
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        <div className="text-sm text-gray-500">Pending</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border">
                        <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                        <div className="text-sm text-gray-500">In Progress</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border">
                        <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
                        <div className="text-sm text-gray-500">Resolved</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border">
                        <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
                        <div className="text-sm text-gray-500">Urgent</div>
                    </div>
                </div>

                {!selectedTicket ? (
                    /* Tickets List View */
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-col lg:flex-row gap-4 justify-between">
                                <div className="relative flex-1 max-w-md">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Search tickets..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-4 flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-5 w-5 text-gray-400" />
                                        <select
                                            value={filterType}
                                            onChange={(e) => setFilterType(e.target.value as any)}
                                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="all">All Types</option>
                                            <option value="it">IT Support</option>
                                            <option value="maintenance">Maintenance</option>
                                        </select>
                                    </div>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value as any)}
                                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                    <select
                                        value={filterPriority}
                                        onChange={(e) => setFilterPriority(e.target.value as any)}
                                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">All Priority</option>
                                        <option value="urgent">Urgent</option>
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                {filteredTickets.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => setSelectedTicket(ticket)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    {getTypeIcon(ticket.type)}
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        ticket.type === 'it' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                                                    }`}>
                            {ticket.type === 'it' ? 'IT Support' : 'Maintenance'}
                          </span>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                          </span>
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {getStatusIcon(ticket.status)}
                                                        {ticket.status.replace('-', ' ').charAt(0).toUpperCase() + ticket.status.replace('-', ' ').slice(1)}
                          </span>
                                                </div>

                                                <h4 className="font-semibold text-gray-800 text-lg">
                                                    {ticket.id}: {ticket.title}
                                                </h4>

                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                    {ticket.description}
                                                </p>

                                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{ticket.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <User className="h-4 w-4" />
                                                        <span>By: {ticket.submittedBy}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{new Date(ticket.submittedAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>

                                                {ticket.assignedTo && (
                                                    <div className="mt-2">
                                                        <span className="text-xs text-gray-500">Assigned to: {ticket.assignedTo}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-blue-600 ml-4">
                                                <Eye className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {filteredTickets.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        <HardDrive className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-2 text-lg font-medium">No tickets found</p>
                                        <p className="mt-1">Try adjusting your search or filter criteria</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Ticket Detail View */
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Ticket Details - {selectedTicket.id}
                                    </h3>
                                    <div className="mt-2 flex flex-wrap gap-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedTicket.type === 'it' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {getTypeIcon(selectedTicket.type)}
                        <span className="ml-1">
                        {selectedTicket.type === 'it' ? 'IT Support' : 'Maintenance'}
                      </span>
                    </span>
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTicket.status)}`}>
                      {getStatusIcon(selectedTicket.status)}
                                            {selectedTicket.status.replace('-', ' ').charAt(0).toUpperCase() + selectedTicket.status.replace('-', ' ').slice(1)}
                    </span>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)} Priority
                    </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Back to List
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Ticket Information */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">{selectedTicket.title}</h4>
                                        <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                            <p className="text-gray-900">{selectedTicket.location}</p>
                                            {selectedTicket.specificLocation && (
                                                <p className="text-sm text-gray-600 mt-1">Specific: {selectedTicket.specificLocation}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
                                            <p className="text-gray-900">{selectedTicket.issueType}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Submitted By</label>
                                            <p className="text-gray-900">{selectedTicket.submittedBy}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Submitted At</label>
                                            <p className="text-gray-900">{new Date(selectedTicket.submittedAt).toLocaleString()}</p>
                                        </div>
                                        {selectedTicket.assignedTo && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                                                <p className="text-gray-900">{selectedTicket.assignedTo}</p>
                                            </div>
                                        )}
                                        {selectedTicket.resolvedAt && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Resolved At</label>
                                                <p className="text-gray-900">{new Date(selectedTicket.resolvedAt).toLocaleString()}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Admin Notes */}
                                    {selectedTicket.notes && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.notes}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions Sidebar */}
                                <div className="space-y-6">
                                    {/* Status Update */}
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h5 className="font-medium text-gray-800 mb-3">Update Status</h5>
                                        <div className="space-y-2">
                                            {(['pending', 'in-progress', 'resolved', 'closed'] as const).map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => updateTicketStatus(selectedTicket.id, status)}
                                                    disabled={selectedTicket.status === status}
                                                    className={`w-full text-left px-3 py-2 rounded text-sm ${
                                                        selectedTicket.status === status
                                                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {status.replace('-', ' ').charAt(0).toUpperCase() + status.replace('-', ' ').slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Assignment */}
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h5 className="font-medium text-gray-800 mb-3">Assign To</h5>
                                        <select
                                            value={selectedTicket.assignedTo || ''}
                                            onChange={(e) => assignTicket(selectedTicket.id, e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Unassigned</option>
                                            <option value="IT Support Team">IT Support Team</option>
                                            <option value="Maintenance Team">Maintenance Team</option>
                                            <option value="Cleaning Staff">Cleaning Staff</option>
                                            <option value="Network Team">Network Team</option>
                                        </select>
                                    </div>

                                    {/* Add Notes */}
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h5 className="font-medium text-gray-800 mb-3">Add Notes</h5>
                                        <textarea
                                            value={adminNotes}
                                            onChange={(e) => setAdminNotes(e.target.value)}
                                            rows={3}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Add internal notes or updates..."
                                        />
                                        <button
                                            onClick={() => addAdminNotes(selectedTicket.id)}
                                            disabled={!adminNotes.trim()}
                                            className="mt-2 w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            <MessageSquare className="h-4 w-4 inline mr-1" />
                                            Add Note
                                        </button>
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

export default TicketManagementAdmin;

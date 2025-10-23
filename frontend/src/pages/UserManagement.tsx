import { useState, useEffect } from 'react';
import {
  Users, Search, Upload, Edit,
  CheckCircle, XCircle, Eye, RefreshCw,
  Download, AlertCircle
} from 'lucide-react';
import userManagementService from '../services/userManagementService';
import type { User, UserDetail, Department } from '../services/userManagementService';

// Edit form interface that includes department_id
interface UserEditForm {
  id?: number;
  full_name?: string;
  role?: 'student' | 'staff' | 'department_head' | 'admin';
  department_id?: number;
  year_of_study?: number | null;
  major?: string;
  position?: string;
  is_active?: boolean;
  is_verified?: boolean;
}

const UserManagement = () => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Bulk import
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState<any>(null);
  const [importError, setImportError] = useState<string>('');

  // Edit form
  const [editForm, setEditForm] = useState<UserEditForm>({});

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userManagementService.getUsers({
        page: currentPage,
        page_size: 20,
        search: searchTerm || undefined,
        role: roleFilter || undefined,
        department: departmentFilter || undefined,
      });

      if (response.success && response.data) {
        setUsers(response.data.users);
        setDepartments(response.data.departments);
        setTotalPages(response.data.pagination.total_pages);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      alert(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, departmentFilter]);

  // View user details
  const viewUserDetails = async (userId: number) => {
    try {
      const response = await userManagementService.getUserDetail(userId);
      if (response.success && response.data) {
        setSelectedUser(response.data);
        setShowUserModal(true);
      }
    } catch (error: any) {
      console.error('Error fetching user details:', error);
      alert(error.response?.data?.message || 'Failed to fetch user details');
    }
  };

  // Open edit modal
  const openEditModal = (user: User) => {
    setEditForm({
      id: user.id,
      full_name: user.full_name,
      role: user.role,
      department_id: user.department?.id,
      year_of_study: user.year_of_study,
      major: user.major,
      position: user.position,
      is_active: user.is_active,
      is_verified: user.is_verified,
    });
    setShowEditModal(true);
  };

  // Update user
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.id) return;

    try {
      const response = await userManagementService.updateUser(editForm.id, editForm);
      if (response.success) {
        alert(response.message || 'User updated successfully!');
        setShowEditModal(false);
        fetchUsers();
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      alert(error.response?.data?.message || 'Failed to update user');
    }
  };

  // Deactivate user
  const handleDeactivateUser = async (userId: number, userName: string) => {
    if (!confirm(`Are you sure you want to deactivate ${userName}?`)) return;

    try {
      const response = await userManagementService.deactivateUser(userId);
      if (response.success) {
        alert(response.message || 'User deactivated successfully!');
        fetchUsers();
      }
    } catch (error: any) {
      console.error('Error deactivating user:', error);
      alert(error.response?.data?.message || 'Failed to deactivate user');
    }
  };

  // Activate user
  const handleActivateUser = async (userId: number, userName: string) => {
    if (!confirm(`Are you sure you want to activate ${userName}?`)) return;

    try {
      const response = await userManagementService.activateUser(userId);
      if (response.success) {
        alert(response.message || 'User activated successfully!');
        fetchUsers();
      }
    } catch (error: any) {
      console.error('Error activating user:', error);
      alert(error.response?.data?.message || 'Failed to activate user');
    }
  };

  // Handle bulk import
  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) {
      setImportError('Please select a CSV file');
      return;
    }

    try {
      setImportProgress({ status: 'uploading' });
      const response = await userManagementService.bulkImport(importFile);

      if (response.success && response.data) {
        setImportProgress({
          status: 'complete',
          imported: response.data.imported,
          errors: response.data.errors,
          error_details: response.data.error_details,
        });
        fetchUsers();
      }
    } catch (error: any) {
      console.error('Error importing users:', error);
      setImportError(error.response?.data?.message || 'Failed to import users');
      setImportProgress(null);
    }
  };

  // Download sample CSV
  const downloadSampleCSV = () => {
    const csvContent = `aun_id,email,full_name,role,department_code,year_of_study,major,position
A00012345,john.doe@aun.edu.ng,John Doe,student,CS,3,Computer Science,
A00012346,jane.smith@aun.edu.ng,Jane Smith,staff,CS,,,Associate Professor`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_users.csv';
    a.click();
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-sm sm:rounded-lg mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                <Users className="w-6 h-6" />
                User Management
              </h2>
              <button
                onClick={() => setShowBulkImport(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 gap-2"
              >
                <Upload className="w-4 h-4" />
                Bulk Import
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by ID, name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchUsers()}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Roles</option>
                <option value="student">Student</option>
                <option value="staff">Staff</option>
                <option value="department_head">Department Head</option>
                <option value="admin">Admin</option>
              </select>

              {/* Department Filter */}
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>

              {/* Search Button */}
              <button
                onClick={fetchUsers}
                className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                              <div className="text-sm text-gray-500">{user.aun_id}</div>
                              <div className="text-xs text-gray-400">{user.aun_email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'department_head' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'staff' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.department ? (
                            <div>
                              <div>{user.department.name}</div>
                              <div className="text-xs text-gray-400">{user.department.code}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {user.is_active ? (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full gap-1">
                                <XCircle className="w-3 h-3" />
                                Inactive
                              </span>
                            )}
                            {user.is_verified && (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => viewUserDetails(user.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => openEditModal(user)}
                              className="text-green-600 hover:text-green-900"
                              title="Edit User"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            {user.is_active ? (
                              <button
                                onClick={() => handleDeactivateUser(user.id, user.full_name)}
                                className="text-red-600 hover:text-red-900"
                                title="Deactivate User"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivateUser(user.id, user.full_name)}
                                className="text-green-600 hover:text-green-900"
                                title="Activate User"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedUser.full_name}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.aun_id} • {selectedUser.aun_email}</p>
                </div>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">User Information</h4>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedUser.role.replace('_', ' ')}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Department</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedUser.department ? `${selectedUser.department.name} (${selectedUser.department.code})` : '-'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedUser.phone_number || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedUser.is_active ? 'Active' : 'Inactive'} • {selectedUser.is_verified ? 'Verified' : 'Unverified'}
                    </dd>
                  </div>
                  {selectedUser.year_of_study && (
                    <>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Year of Study</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedUser.year_of_study}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Major</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedUser.major || '-'}</dd>
                      </div>
                    </>
                  )}
                  {selectedUser.position && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Position</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedUser.position}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Recent Sessions */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recent Login Sessions</h4>
                {selectedUser.recent_sessions.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.recent_sessions.map((session, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(session.login_time).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">IP: {session.ip_address}</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          session.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {session.is_active ? 'Active' : 'Ended'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No recent sessions</p>
                )}
              </div>

              {/* Recent Login Attempts */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recent Login Attempts</h4>
                {selectedUser.recent_login_attempts.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.recent_login_attempts.map((attempt, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(attempt.timestamp).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            IP: {attempt.ip_address}
                            {attempt.failure_reason && ` • ${attempt.failure_reason}`}
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          attempt.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {attempt.success ? 'Success' : 'Failed'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No recent login attempts</p>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.full_name || ''}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={editForm.role || ''}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="department_head">Department Head</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={editForm.department_id || ''}
                    onChange={(e) => setEditForm({ ...editForm, department_id: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">None</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {editForm.role === 'student' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
                    <input
                      type="number"
                      value={editForm.year_of_study || ''}
                      onChange={(e) => setEditForm({ ...editForm, year_of_study: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
                    <input
                      type="text"
                      value={editForm.major || ''}
                      onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {(editForm.role === 'staff' || editForm.role === 'department_head') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input
                    type="text"
                    value={editForm.position || ''}
                    onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.is_active || false}
                    onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.is_verified || false}
                    onChange={(e) => setEditForm({ ...editForm, is_verified: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Verified</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Bulk Import Users</h3>
            </div>

            <form onSubmit={handleBulkImport} className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">CSV Format Requirements:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Required columns: aun_id, email, full_name, role</li>
                      <li>Optional columns: department_code, year_of_study, major, position</li>
                      <li>Roles: student, staff, department_head, admin</li>
                      <li>Temporary password will be generated automatically</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    setImportFile(e.target.files?.[0] || null);
                    setImportError('');
                    setImportProgress(null);
                  }}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                {importError && (
                  <p className="mt-2 text-sm text-red-600">{importError}</p>
                )}
              </div>

              <button
                type="button"
                onClick={downloadSampleCSV}
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <Download className="w-4 h-4" />
                Download Sample CSV Template
              </button>

              {importProgress && (
                <div className={`p-4 rounded-md ${
                  importProgress.status === 'complete' && importProgress.errors === 0
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <p className="font-medium text-sm mb-2">
                    Import Complete: {importProgress.imported} users imported
                    {importProgress.errors > 0 && `, ${importProgress.errors} errors`}
                  </p>
                  {importProgress.error_details && importProgress.error_details.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs font-medium">Errors:</p>
                      {importProgress.error_details.map((err: any, idx: number) => (
                        <p key={idx} className="text-xs text-red-600">
                          Row {err.row}: {err.error}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBulkImport(false);
                    setImportFile(null);
                    setImportProgress(null);
                    setImportError('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  {importProgress ? 'Close' : 'Cancel'}
                </button>
                {!importProgress && (
                  <button
                    type="submit"
                    disabled={!importFile}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Import Users
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

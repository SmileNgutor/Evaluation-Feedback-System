import { useState, useEffect } from 'react';
import {
  Key, Plus, Copy, CheckCircle, Clock, XCircle,
  Users, RefreshCw, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
}

interface EvaluationKey {
  id: number;
  key: string;
  department: {
    id: number;
    name: string;
    code: string;
  };
  created_by: string;
  is_active: boolean;
  usage_count: number;
  usage_limit: number;
  valid_from: string;
  valid_until: string;
  is_valid: boolean;
  description?: string;
  created_at: string;
}

interface UserPermissions {
  can_create_keys: boolean;
  can_manage_all_departments: boolean;
  assigned_department: {
    id: number;
    name: string;
    code: string;
  } | null;
}

const EvaluationKeys = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [evaluationKeys, setEvaluationKeys] = useState<EvaluationKey[]>([]);
  const [, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showKeyValues, setShowKeyValues] = useState<{[key: number]: boolean}>({});
  const [copiedKey, setCopiedKey] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    department_id: '',
    description: '',
    usage_limit: '100',
    valid_days: '30'
  });

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/manage-keys/');

      if (response.data.success && response.data.data) {
        setDepartments(response.data.data.departments || []);
        setEvaluationKeys(response.data.data.evaluation_keys || []);
        setPermissions(response.data.data.user_permissions || null);
      }
    } catch (error: any) {
      console.error('Error fetching evaluation keys:', error);
      alert(error.response?.data?.message || 'Failed to load evaluation keys');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post('/auth/manage-keys/', {
        action: 'create_key',
        department_id: parseInt(formData.department_id),
        description: formData.description,
        usage_limit: parseInt(formData.usage_limit),
        valid_days: parseInt(formData.valid_days)
      });

      if (response.data.success) {
        alert(response.data.message);
        setShowCreateModal(false);
        setFormData({
          department_id: '',
          description: '',
          usage_limit: '100',
          valid_days: '30'
        });
        fetchKeys();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create evaluation key');
    }
  };

  const handleDeactivateKey = async (keyId: number, keyValue: string) => {
    if (!confirm(`Are you sure you want to deactivate key "${keyValue}"?`)) return;

    try {
      const response = await api.post('/auth/manage-keys/', {
        action: 'deactivate_key',
        key_id: keyId
      });

      if (response.data.success) {
        alert(response.data.message);
        fetchKeys();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to deactivate key');
    }
  };

  const copyToClipboard = (keyId: number, keyValue: string) => {
    navigator.clipboard.writeText(keyValue);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleKeyVisibility = (keyId: number) => {
    setShowKeyValues(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const getKeyStatus = (key: EvaluationKey) => {
    if (!key.is_active) return { label: 'Inactive', color: 'bg-gray-100 text-gray-800', icon: XCircle };
    if (!key.is_valid) return { label: 'Expired', color: 'bg-red-100 text-red-800', icon: Clock };
    if (key.usage_count >= key.usage_limit) return { label: 'Full', color: 'bg-orange-100 text-orange-800', icon: Users };
    return { label: 'Active', color: 'bg-green-100 text-green-800', icon: CheckCircle };
  };

  const isExpiringSoon = (validUntil: string) => {
    const daysUntilExpiry = (new Date(validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  // Statistics
  const stats = {
    total: evaluationKeys.length,
    active: evaluationKeys.filter(k => k.is_active && k.is_valid && k.usage_count < k.usage_limit).length,
    expired: evaluationKeys.filter(k => !k.is_valid).length,
    full: evaluationKeys.filter(k => k.usage_count >= k.usage_limit).length
  };

  // Check if user has permission to manage keys
  const hasPermission = user?.role === 'admin' || user?.role === 'department_head';

  if (!hasPermission) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm sm:rounded-lg p-12 text-center">
            <Key className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">You do not have permission to manage evaluation keys.</p>
            <p className="text-sm text-gray-500 mt-2">Only administrators and department heads can access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-sm sm:rounded-lg mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                  <Key className="w-6 h-6" />
                  Evaluation Keys Management
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Generate and manage evaluation keys for student access
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={fetchKeys}
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
                  Generate Key
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Keys</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <Key className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Keys</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expired</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{stats.expired}</p>
                </div>
                <Clock className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">At Capacity</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">{stats.full}</p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Keys List */}
        <div className="bg-white shadow-sm sm:rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Evaluation Keys</h3>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Loading keys...</p>
              </div>
            ) : evaluationKeys.length === 0 ? (
              <div className="p-12 text-center">
                <Key className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">No evaluation keys found</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Key
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valid Until
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {evaluationKeys.map((key) => {
                    const status = getKeyStatus(key);
                    const StatusIcon = status.icon;
                    const isExpiring = isExpiringSoon(key.valid_until);

                    return (
                      <tr key={key.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                              {showKeyValues[key.id] ? key.key : '••••••••••'}
                            </code>
                            <button
                              onClick={() => toggleKeyVisibility(key.id)}
                              className="text-gray-400 hover:text-gray-600"
                              title={showKeyValues[key.id] ? 'Hide key' : 'Show key'}
                            >
                              {showKeyValues[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => copyToClipboard(key.id, key.key)}
                              className="text-gray-400 hover:text-gray-600"
                              title="Copy key"
                            >
                              {copiedKey === key.id ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          {key.description && (
                            <p className="text-xs text-gray-500 mt-1">{key.description}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{key.department.name}</div>
                            <div className="text-xs text-gray-500">{key.department.code}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {key.usage_count} / {key.usage_limit}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className={`h-2 rounded-full ${
                                key.usage_count >= key.usage_limit ? 'bg-red-600' :
                                key.usage_count / key.usage_limit > 0.8 ? 'bg-orange-600' :
                                'bg-green-600'
                              }`}
                              style={{ width: `${Math.min((key.usage_count / key.usage_limit) * 100, 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(key.valid_until).toLocaleDateString()}
                          </div>
                          {isExpiring && (
                            <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
                              <AlertCircle className="w-3 h-3" />
                              <span>Expiring soon</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {key.is_active && (
                            <button
                              onClick={() => handleDeactivateKey(key.id, key.key)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Deactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">Generate New Evaluation Key</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateKey} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.department_id}
                  onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Fall 2024 Course Evaluations"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usage Limit <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum number of students who can use this key</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid For (Days) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.valid_days}
                    onChange={(e) => setFormData({ ...formData, valid_days: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Number of days until key expires</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      A unique evaluation key will be automatically generated. Students will use this key to access evaluations for the selected department.
                    </p>
                  </div>
                </div>
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
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationKeys;

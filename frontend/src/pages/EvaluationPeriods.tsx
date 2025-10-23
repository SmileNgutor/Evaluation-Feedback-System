import { useState, useEffect } from 'react';
import {
  Calendar, Plus, Edit, Trash2, CheckCircle, XCircle,
  AlertCircle, RefreshCw
} from 'lucide-react';
import api from '../services/api';

interface EvaluationPeriod {
  id: number;
  name: string;
  semester: 'fall' | 'spring' | 'summer';
  year: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  description: string;
  created_at: string;
}

const EvaluationPeriods = () => {
  const [periods, setPeriods] = useState<EvaluationPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<EvaluationPeriod | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    semester: 'fall' as 'fall' | 'spring' | 'summer',
    year: new Date().getFullYear(),
    start_date: '',
    end_date: '',
    description: '',
    is_active: false,
  });

  // Fetch periods
  const fetchPeriods = async () => {
    try {
      setLoading(true);
      const response = await api.get('/eval/periods/');
      if (response.data.success) {
        setPeriods(response.data.data.periods || []);
      }
    } catch (error: any) {
      console.error('Error fetching periods:', error);
      alert(error.response?.data?.message || 'Failed to fetch evaluation periods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  // Create period
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/eval/periods/', formData);
      if (response.data.success) {
        alert('Evaluation period created successfully!');
        setShowCreateModal(false);
        resetForm();
        fetchPeriods();
      }
    } catch (error: any) {
      console.error('Error creating period:', error);
      alert(error.response?.data?.message || 'Failed to create period');
    }
  };

  // Update period
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPeriod) return;

    try {
      const response = await api.put(`/eval/periods/${selectedPeriod.id}/`, formData);
      if (response.data.success) {
        alert('Evaluation period updated successfully!');
        setShowEditModal(false);
        setSelectedPeriod(null);
        resetForm();
        fetchPeriods();
      }
    } catch (error: any) {
      console.error('Error updating period:', error);
      alert(error.response?.data?.message || 'Failed to update period');
    }
  };

  // Delete period
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await api.delete(`/eval/periods/${id}/`);
      if (response.data.success) {
        alert('Period deleted successfully!');
        fetchPeriods();
      }
    } catch (error: any) {
      console.error('Error deleting period:', error);
      alert(error.response?.data?.message || 'Failed to delete period');
    }
  };

  // Set active period
  const handleSetActive = async (id: number, name: string) => {
    if (!confirm(`Set "${name}" as the active evaluation period?`)) return;

    try {
      const response = await api.post(`/eval/periods/${id}/set-active/`);
      if (response.data.success) {
        alert('Active period updated!');
        fetchPeriods();
      }
    } catch (error: any) {
      console.error('Error setting active period:', error);
      alert(error.response?.data?.message || 'Failed to set active period');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      semester: 'fall',
      year: new Date().getFullYear(),
      start_date: '',
      end_date: '',
      description: '',
      is_active: false,
    });
  };

  // Open edit modal
  const openEditModal = (period: EvaluationPeriod) => {
    setSelectedPeriod(period);
    setFormData({
      name: period.name,
      semester: period.semester,
      year: period.year,
      start_date: period.start_date,
      end_date: period.end_date,
      description: period.description,
      is_active: period.is_active,
    });
    setShowEditModal(true);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-sm sm:rounded-lg mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Evaluation Periods
              </h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Period
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">About Evaluation Periods:</p>
                  <p>Evaluation periods define the timeframes for collecting feedback. Only one period can be active at a time. All analytics and reports are organized by period.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Periods List */}
        <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Loading periods...</p>
            </div>
          ) : periods.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 mb-4">No evaluation periods found</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 gap-2"
              >
                <Plus className="w-4 h-4" />
                Create First Period
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Semester / Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
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
                  {periods.map((period) => (
                    <tr key={period.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{period.name}</div>
                          {period.description && (
                            <div className="text-xs text-gray-500">{period.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize">
                          {period.semester} {period.year}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div>{new Date(period.start_date).toLocaleDateString()}</div>
                          <div className="text-xs">to {new Date(period.end_date).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {period.is_active ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full gap-1">
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          {!period.is_active && (
                            <button
                              onClick={() => handleSetActive(period.id, period.name)}
                              className="text-green-600 hover:text-green-900"
                              title="Set as Active"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => openEditModal(period)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(period.id, period.name)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Create Evaluation Period</h3>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Period Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Fall 2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="fall">Fall</option>
                    <option value="spring">Spring</option>
                    <option value="summer">Summer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Set as active period (only one period can be active)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Period
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedPeriod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Edit Evaluation Period</h3>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Period Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="fall">Fall</option>
                    <option value="spring">Spring</option>
                    <option value="summer">Summer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedPeriod(null);
                    resetForm();
                  }}
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
    </div>
  );
};

export default EvaluationPeriods;

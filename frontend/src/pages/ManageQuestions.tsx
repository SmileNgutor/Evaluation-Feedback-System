import { useState, useEffect } from 'react';
import {
  BookOpen, Plus, Edit2, Trash2, Save, X,
  RefreshCw, AlertCircle, CheckCircle, EyeOff
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Question {
  id: number;
  prompt: string;
  scale_type: string;
  category: {
    id: number;
    name: string;
  } | null;
  order_index: number;
  is_active: boolean;
  department: {
    id: number;
    name: string;
    code: string;
  };
  created_at: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

const ManageQuestions = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    prompt: '',
    scale_type: 'likert_5',
    category_id: '',
    order_index: '0'
  });

  const scaleTypes = [
    { value: 'likert_5', label: 'Likert 5-point (1-5)' },
    { value: 'likert_7', label: 'Likert 7-point (1-7)' },
    { value: 'boolean', label: 'Yes/No' },
    { value: 'text', label: 'Text Response' }
  ];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    if (!user?.department) {
      alert('You are not assigned to a department');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/eval/questions/manage/', {
        params: { department_id: user.department }
      });

      if (response.data.success && response.data.data) {
        setQuestions(response.data.data.questions || []);

        // Extract unique categories from questions
        const uniqueCategories = new Map<number, Category>();
        response.data.data.questions.forEach((q: Question) => {
          if (q.category) {
            uniqueCategories.set(q.category.id, {
              id: q.category.id,
              name: q.category.name
            });
          }
        });
        setCategories(Array.from(uniqueCategories.values()));
      }
    } catch (error: any) {
      console.error('Error fetching questions:', error);
      alert(error.response?.data?.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.department) {
      alert('You are not assigned to a department');
      return;
    }

    try {
      const response = await api.post('/eval/questions/manage/', {
        department_id: user.department,
        prompt: formData.prompt,
        scale_type: formData.scale_type,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        order_index: parseInt(formData.order_index)
      });

      if (response.data.success) {
        alert('Question created successfully!');
        setShowCreateModal(false);
        resetForm();
        fetchQuestions();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create question');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingQuestion) return;

    try {
      const response = await api.put(`/eval/questions/${editingQuestion.id}/`, {
        prompt: formData.prompt,
        scale_type: formData.scale_type,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        order_index: parseInt(formData.order_index),
        is_active: editingQuestion.is_active
      });

      if (response.data.success) {
        alert('Question updated successfully!');
        setEditingQuestion(null);
        resetForm();
        fetchQuestions();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update question');
    }
  };

  const handleDelete = async (question: Question) => {
    if (!confirm(`Are you sure you want to deactivate this question?\n\n"${question.prompt}"`)) return;

    try {
      const response = await api.delete(`/eval/questions/${question.id}/`);

      if (response.data.success) {
        alert('Question deactivated successfully!');
        fetchQuestions();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to deactivate question');
    }
  };

  const startEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      prompt: question.prompt,
      scale_type: question.scale_type,
      category_id: question.category?.id.toString() || '',
      order_index: question.order_index.toString()
    });
  };

  const cancelEdit = () => {
    setEditingQuestion(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      prompt: '',
      scale_type: 'likert_5',
      category_id: '',
      order_index: '0'
    });
  };

  const getScaleTypeLabel = (scaleType: string) => {
    return scaleTypes.find(s => s.value === scaleType)?.label || scaleType;
  };

  // Group questions by category
  const groupedQuestions = questions.reduce((acc, question) => {
    const categoryName = question.category?.name || 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(question);
    return acc;
  }, {} as Record<string, Question[]>);

  // Statistics
  const stats = {
    total: questions.length,
    active: questions.filter(q => q.is_active).length,
    inactive: questions.filter(q => !q.is_active).length,
    byType: questions.reduce((acc, q) => {
      acc[q.scale_type] = (acc[q.scale_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  if (!user?.department) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm sm:rounded-lg p-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">You are not assigned to a department.</p>
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
                  <BookOpen className="w-6 h-6" />
                  Manage Evaluation Questions
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Create and manage questions for your department's evaluations
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={fetchQuestions}
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
                  New Question
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{stats.inactive}</p>
                </div>
                <EyeOff className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white shadow-sm sm:rounded-lg p-12 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="bg-white shadow-sm sm:rounded-lg p-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No questions found. Create your first question to get started!</p>
            </div>
          ) : (
            Object.entries(groupedQuestions).map(([categoryName, categoryQuestions]) => (
              <div key={categoryName} className="bg-white shadow-sm sm:rounded-lg">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800">{categoryName}</h3>
                  <p className="text-sm text-gray-600 mt-1">{categoryQuestions.length} question(s)</p>
                </div>
                <div className="p-6 space-y-4">
                  {categoryQuestions.sort((a, b) => a.order_index - b.order_index).map((question, index) => (
                    <div
                      key={question.id}
                      className={`border rounded-lg p-4 ${
                        question.is_active ? 'border-gray-200' : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                              {index + 1}
                            </span>
                            {!question.is_active && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                <EyeOff className="w-3 h-3 mr-1" />
                                Inactive
                              </span>
                            )}
                          </div>
                          <p className="text-gray-900 font-medium mb-2">{question.prompt}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Type: {getScaleTypeLabel(question.scale_type)}</span>
                            <span>Order: {question.order_index}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(question)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Edit2 className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          {question.is_active && (
                            <button
                              onClick={() => handleDelete(question)}
                              className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-sm text-red-700 bg-white hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Deactivate
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Question Modal */}
      {(showCreateModal || editingQuestion) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingQuestion ? 'Edit Question' : 'Create New Question'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    cancelEdit();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={editingQuestion ? handleUpdate : handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Prompt <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  rows={3}
                  placeholder="e.g., How would you rate the overall quality of this course?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.scale_type}
                    onChange={(e) => setFormData({ ...formData, scale_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {scaleTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Uncategorized</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Index
                </label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first in the evaluation form
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Questions will be shown to students during the evaluation process. Make sure the wording is clear and unbiased.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    cancelEdit();
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingQuestion ? 'Update Question' : 'Create Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuestions;

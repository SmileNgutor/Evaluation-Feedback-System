import { useState, useEffect } from 'react';
import { GraduationCap, CheckCircle, Key, AlertCircle } from 'lucide-react';
import { departmentService } from '../services/departmentService.ts';
import { evaluationService } from '../services/evaluationService.ts';
import type { Department, EvaluationQuestion, EvaluationResponse } from '../types';

const CourseEvaluation = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [questions, setQuestions] = useState<EvaluationQuestion[]>([]);
    const [evaluationKey, setEvaluationKey] = useState('');
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [step, setStep] = useState<'select-department' | 'enter-key' | 'evaluation'>('select-department');
    const [responses, setResponses] = useState<Map<number, EvaluationResponse>>(new Map());

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            const response = await departmentService.getDepartments();
            if (response.success && response.data) {
                setDepartments(response.data.departments);
            }
        } catch (err: any) {
            setError('Failed to load departments');
        }
    };

    const handleDepartmentSelect = async (dept: Department) => {
        setSelectedDepartment(dept);
        setStep('enter-key');
        setError('');
    };

    const handleKeySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDepartment || !evaluationKey.trim()) {
            setError('Please enter an evaluation key');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Start evaluation session
            const startResponse = await evaluationService.startEvaluation(
                selectedDepartment.id,
                evaluationKey.trim().toUpperCase()
            );

            if (startResponse.success && startResponse.data) {
                setSessionId(startResponse.data.session_id);

                // Load questions for the department
                const questionsResponse = await evaluationService.getQuestions(selectedDepartment.id);
                if (questionsResponse.success && questionsResponse.data) {
                    setQuestions(questionsResponse.data.questions);
                    setStep('evaluation');
                } else {
                    setError('Failed to load evaluation questions');
                }
            } else {
                setError(startResponse.message || 'Invalid evaluation key');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to start evaluation');
        } finally {
            setLoading(false);
        }
    };

    const handleResponseChange = (questionId: number, question: EvaluationQuestion, value: any) => {
        const newResponse: EvaluationResponse = { question_id: questionId };

        switch (question.scale_type) {
            case 'likert_5':
            case 'likert_10':
                newResponse.score = parseInt(value);
                break;
            case 'boolean':
                newResponse.boolean_answer = value === 'true';
                break;
            case 'text':
                newResponse.text_answer = value;
                break;
        }

        setResponses(prev => new Map(prev).set(questionId, newResponse));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!sessionId) {
            setError('No active session');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const responsesArray = Array.from(responses.values());
            const submitResponse = await evaluationService.submitEvaluation(sessionId, responsesArray);

            if (submitResponse.success) {
                setSuccess('Evaluation submitted successfully!');
                setTimeout(() => {
                    // Reset to initial state
                    setStep('select-department');
                    setSelectedDepartment(null);
                    setEvaluationKey('');
                    setSessionId(null);
                    setQuestions([]);
                    setResponses(new Map());
                    setSuccess('');
                }, 2000);
            } else {
                setError(submitResponse.message || 'Failed to submit evaluation');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit evaluation');
        } finally {
            setLoading(false);
        }
    };

    const getLikertOptions = (scaleType: string): { value: number; label: string }[] => {
        if (scaleType === 'likert_5') {
            return [
                { value: 1, label: 'Strongly Disagree' },
                { value: 2, label: 'Disagree' },
                { value: 3, label: 'Neutral' },
                { value: 4, label: 'Agree' },
                { value: 5, label: 'Strongly Agree' }
            ];
        } else if (scaleType === 'likert_10') {
            return Array.from({ length: 10 }, (_, i) => ({ value: i + 1, label: `${i + 1}` }));
        }
        return [];
    };

    const isFormComplete = questions.length > 0 && questions.every(q => responses.has(q.id));

    return (
        <div className="py-6">
            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white shadow-sm sm:rounded-lg mb-6">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                            <GraduationCap />
                            Department Evaluation
                        </h2>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                            <div className="ml-3">
                                <div className="text-sm text-red-800">{error}</div>
                            </div>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 rounded-md bg-green-50 p-4">
                        <div className="text-sm text-green-800">{success}</div>
                    </div>
                )}

                {step === 'select-department' && (
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Select Department to Evaluate</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {departments.map((dept) => (
                                    <div
                                        key={dept.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => handleDepartmentSelect(dept)}
                                    >
                                        <h4 className="font-semibold text-gray-800">{dept.name}</h4>
                                        <p className="text-sm text-gray-500 mt-1">{dept.code}</p>
                                        {dept.description && (
                                            <p className="text-sm text-gray-600 mt-2">{dept.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === 'enter-key' && selectedDepartment && (
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Enter Evaluation Key</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Evaluating: <span className="font-medium">{selectedDepartment.name}</span>
                            </p>
                        </div>
                        <form onSubmit={handleKeySubmit} className="p-6">
                            <div className="mb-6">
                                <label htmlFor="evaluationKey" className="block text-sm font-medium text-gray-700 mb-2">
                                    Evaluation Key
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Key className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="evaluationKey"
                                        type="text"
                                        value={evaluationKey}
                                        onChange={(e) => setEvaluationKey(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm uppercase"
                                        placeholder="Enter your evaluation key"
                                        required
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Your instructor should have provided you with an evaluation key
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep('select-department')}
                                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {loading ? 'Validating...' : 'Continue'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {step === 'evaluation' && (
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Evaluation Form</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Department: <span className="font-medium">{selectedDepartment?.name}</span>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-8">
                                {questions.map((question, index) => (
                                    <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                                        <label className="block text-sm font-medium text-gray-700 mb-4">
                                            {index + 1}. {question.prompt}
                                        </label>

                                        {(question.scale_type === 'likert_5' || question.scale_type === 'likert_10') && (
                                            <div className="space-y-2">
                                                {getLikertOptions(question.scale_type).map((option) => (
                                                    <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.id}`}
                                                            value={option.value}
                                                            checked={responses.get(question.id)?.score === option.value}
                                                            onChange={() => handleResponseChange(question.id, question, option.value.toString())}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                        />
                                                        <span className="text-sm text-gray-700">{option.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}

                                        {question.scale_type === 'boolean' && (
                                            <div className="space-y-2">
                                                <label className="flex items-center space-x-3 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`question-${question.id}`}
                                                        value="true"
                                                        checked={responses.get(question.id)?.boolean_answer === true}
                                                        onChange={() => handleResponseChange(question.id, question, 'true')}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <span className="text-sm text-gray-700">Yes</span>
                                                </label>
                                                <label className="flex items-center space-x-3 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`question-${question.id}`}
                                                        value="false"
                                                        checked={responses.get(question.id)?.boolean_answer === false}
                                                        onChange={() => handleResponseChange(question.id, question, 'false')}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <span className="text-sm text-gray-700">No</span>
                                                </label>
                                            </div>
                                        )}

                                        {question.scale_type === 'text' && (
                                            <textarea
                                                value={responses.get(question.id)?.text_answer || ''}
                                                onChange={(e) => handleResponseChange(question.id, question, e.target.value)}
                                                rows={4}
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                placeholder="Enter your response..."
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={!isFormComplete || loading}
                                    className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                        isFormComplete && !loading
                                            ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                            : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <CheckCircle className="h-4 w-4" />
                                    {loading ? 'Submitting...' : 'Submit Evaluation'}
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

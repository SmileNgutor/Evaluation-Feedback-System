import { ClipboardList } from 'lucide-react';

const CourseEvaluation = () => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm sm:rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
              <ClipboardList />
              Course Evaluation
            </h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600">Course evaluation functionality will be implemented here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEvaluation; 
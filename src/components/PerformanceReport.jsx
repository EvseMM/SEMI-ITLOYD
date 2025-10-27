// PerformanceReport.jsx
import React from 'react';

const PerformanceReport = ({ analysis, onClose }) => {
  if (!analysis) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Performance Analysis Report</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Student Information</h3>
                <p><strong>Name:</strong> {analysis.studentName}</p>
                <p><strong>Analysis Date:</strong> {analysis.analysisDate}</p>
                <p><strong>Overall Average:</strong> {analysis.overallAverage}</p>
                <p><strong>Performance Level:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    analysis.performanceLevel === 'Excellent' ? 'bg-green-100 text-green-800' :
                    analysis.performanceLevel === 'Good' ? 'bg-blue-100 text-blue-800' :
                    analysis.performanceLevel === 'Satisfactory' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {analysis.performanceLevel}
                  </span>
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Strengths</h3>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="text-sm">{strength}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Areas for Improvement</h3>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="text-sm">{weakness}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Recommendations</h3>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-sm">{recommendation}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceReport;
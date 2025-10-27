import React, { useState, useEffect } from 'react';

const GradeForm = ({ grade, students, subjects, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    student_id: '',
    subject_id: '',
    prelim: '',
    midterm: '',
    semifinal: '',
    final: ''
  });

  useEffect(() => {
    if (grade) {
      setFormData(grade);
    }
  }, [grade]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const calculateFinalGrade = () => {
    const prelim = parseFloat(formData.prelim) || 0;
    const midterm = parseFloat(formData.midterm) || 0;
    const semifinal = parseFloat(formData.semifinal) || 0;
    const final = parseFloat(formData.final) || 0;
    
    return (prelim * 0.2 + midterm * 0.2 + semifinal * 0.2 + final * 0.4).toFixed(2);
  };

  const finalGrade = calculateFinalGrade();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-96 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {grade ? 'Edit Grade' : 'Add New Grade'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student
              </label>
              <select
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                disabled={!!grade}
              >
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.first_name} {student.last_name} - {student.student_number}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                name="subject_id"
                value={formData.subject_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                disabled={!!grade}
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subject_code} - {subject.subject_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prelim
              </label>
              <input
                type="number"
                name="prelim"
                min="0"
                max="100"
                step="0.1"
                value={formData.prelim}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Midterm
              </label>
              <input
                type="number"
                name="midterm"
                min="0"
                max="100"
                step="0.1"
                value={formData.midterm}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semi-final
              </label>
              <input
                type="number"
                name="semifinal"
                min="0"
                max="100"
                step="0.1"
                value={formData.semifinal}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Final
              </label>
              <input
                type="number"
                name="final"
                min="0"
                max="100"
                step="0.1"
                value={formData.final}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {finalGrade > 0 && (
            <div className="bg-gray-50 p-3 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Computed Final Grade
              </label>
              <div className={`text-lg font-bold ${
                finalGrade >= 90 ? 'text-green-600' :
                finalGrade >= 80 ? 'text-blue-600' :
                finalGrade >= 75 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {finalGrade}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              {grade ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeForm;
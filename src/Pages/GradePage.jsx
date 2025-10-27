import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gradesAPI, studentsAPI, subjectsAPI } from '../services/api';
import { geminiService } from '../services/geminiService';
import GradeForm from '../components/GradeForm';
import PerformanceReport from '../components/PerformanceReport';

const GradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [analyzingStudent, setAnalyzingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allGrades = gradesAPI.getAll();
    const allStudents = studentsAPI.getAll();
    const allSubjects = subjectsAPI.getAll();
    
    setGrades(allGrades);
    setStudents(allStudents);
    setSubjects(allSubjects);
  };

  const handleCreate = () => {
    setEditingGrade(null);
    setShowForm(true);
  };

  const handleEdit = (grade) => {
    setEditingGrade(grade);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this grade record?')) {
      gradesAPI.delete(id);
      loadData();
    }
  };

  const handleSubmit = (gradeData) => {
    if (editingGrade) {
      gradesAPI.update(editingGrade.id, gradeData);
    } else {
      gradesAPI.create(gradeData);
    }
    setShowForm(false);
    setEditingGrade(null);
    loadData();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGrade(null);
  };

  const handleAnalyze = async (student) => {
    setAnalyzingStudent(student.id);
    try {
      const studentGrades = gradesAPI.getByStudentId(student.id);
      const analysis = await geminiService.analyzeStudentPerformance(student, studentGrades, subjects);
      setCurrentAnalysis(analysis);
      setShowAnalysis(true);
    } catch (error) {
      alert('Error generating analysis. Please try again.');
    } finally {
      setAnalyzingStudent(null);
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.first_name} ${student.last_name}` : 'Unknown';
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.subject_name : 'Unknown';
  };

  const getSubjectCode = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.subject_code : 'Unknown';
  };

  const calculateFinalGrade = (grade) => {
    const prelim = parseFloat(grade.prelim) || 0;
    const midterm = parseFloat(grade.midterm) || 0;
    const semifinal = parseFloat(grade.semifinal) || 0;
    const final = parseFloat(grade.final) || 0;
    
    return (prelim * 0.2 + midterm * 0.2 + semifinal * 0.2 + final * 0.4).toFixed(1);
  };

  const getGradeColor = (grade) => {
    const finalGrade = parseFloat(grade);
    if (finalGrade >= 90) return 'text-green-600 bg-green-100';
    if (finalGrade >= 80) return 'text-blue-600 bg-blue-100';
    if (finalGrade >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredGrades = grades.filter(grade => {
    const studentName = getStudentName(grade.student_id).toLowerCase();
    const subjectName = getSubjectName(grade.subject_id).toLowerCase();
    const subjectCode = getSubjectCode(grade.subject_id).toLowerCase();
    
    return studentName.includes(searchTerm.toLowerCase()) ||
           subjectName.includes(searchTerm.toLowerCase()) ||
           subjectCode.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="font-bold text-xl text-indigo-600">Grade Management System</div>
            <div className="flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200">
                Home
              </Link>
              <Link to="/students" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200">
                Students
              </Link>
              <Link to="/subjects" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200">
                Subjects
              </Link>
              <Link to="/grades" className="text-indigo-600 font-medium">
                Grades
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Grades Management</h1>
          <button
            onClick={handleCreate}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Add New Grade
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search grades by student name, subject name, or subject code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Grades Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prelim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Midterm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semi-final
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Final
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Computed Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGrades.map((grade) => {
                const finalGrade = calculateFinalGrade(grade);
                return (
                  <tr key={grade.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getStudentName(grade.student_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getSubjectCode(grade.subject_id)} - {getSubjectName(grade.subject_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.prelim || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.midterm || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.semifinal || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.final || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(finalGrade)}`}>
                        {finalGrade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(grade)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(grade.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredGrades.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No grade records found. {searchTerm && 'Try adjusting your search terms.'}
            </div>
          )}
        </div>

        {/* Student Analysis Section */}
        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Performance Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => {
              const studentGrades = gradesAPI.getByStudentId(student.id);
              const hasGrades = studentGrades.length > 0;
              
              return (
                <div key={student.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {student.first_name} {student.last_name}
                      </h3>
                      <p className="text-sm text-gray-600">{student.course} - Year {student.year_level}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      hasGrades ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {hasGrades ? `${studentGrades.length} subjects` : 'No grades'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAnalyze(student)}
                    disabled={!hasGrades || analyzingStudent === student.id}
                    className={`w-full px-3 py-2 text-sm rounded-md transition-colors ${
                      !hasGrades
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : analyzingStudent === student.id
                        ? 'bg-indigo-400 text-white cursor-wait'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {analyzingStudent === student.id ? (
                      <span className="flex items-center justify-center">
                        <div className="loading-spinner mr-2" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                        Analyzing...
                      </span>
                    ) : (
                      'Generate AI Analysis'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {showForm && (
          <GradeForm
            grade={editingGrade}
            students={students}
            subjects={subjects}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}

        {showAnalysis && currentAnalysis && (
          <PerformanceReport
            analysis={currentAnalysis}
            onClose={() => setShowAnalysis(false)}
          />
        )}
      </div>
    </div>
  );
};

export default GradesPage;
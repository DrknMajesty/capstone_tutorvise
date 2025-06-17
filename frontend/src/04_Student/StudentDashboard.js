import React, { useEffect, useState } from 'react';
import ResponsiveNavbar from '../Components/Navbar';
import {
  CheckCircle,
  BookCheck,
  Star,
  CalendarCheck,
  BookOpen,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiService from '../utils/apiService';

const StudentDashboard = () => {
  const [fullName, setFullName] = useState('Student');
  const role = sessionStorage.getItem('account_type') || 'Student';
  const studentId = sessionStorage.getItem('user_id');
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    approvedApplications: 0,
    upcomingSessions: 0,
    completeSessions: 0,
    pendingBookings: 0
  });

useEffect(() => {
  const fetchSummary = async () => {
    try {
      const res = await apiService.get(`/student/summary/${studentId}`);
      setSummary({
        approvedApplications: res.data.approvedApplications,
        upcomingSessions: res.data.upcomingSessions,
        completeSessions: res.data.completeSessions,
        pendingBookings: res.data.pendingBookings,
      });
      setFullName(res.data.fullName);
    } catch (error) {
      console.error('Failed to fetch summary data:', error);
    }
  };

  if (studentId) fetchSummary();
}, [studentId]);

  const summaryData = [
    {
      label: 'Approved Applications',
      value: summary.approvedApplications,
      icon: <BookCheck className="text-blue-600" size={28} />,
    },
    {
      label: 'Pending Bookings',
      value: summary.pendingBookings,
      icon: <BookOpen className="text-red-500" size={28} />,
    },
    {
      label: 'Upcoming Sessions',
      value: summary.upcomingSessions,
      icon: <CalendarCheck className="text-green-600" size={28} />,
    },
    {
      label: 'Sessions Completed',
      value: summary.completeSessions,
      icon: <CheckCircle className="text-orange-600" size={28} />,
    }
  ];

  const actions = [
    {
      icon: <BookOpen className="text-blue-600" size={32} />,
      title: 'My Applications',
      description: 'Track submitted and approved applications.',
      path: '/student/applications',
    },
    {
      icon: <CalendarCheck className="text-green-600" size={32} />,
      title: 'Session Schedule',
      description: 'View upcoming, ongoing, and completed sessions.',
      path: '/student/sessions',
    },
    {
      icon: <Star className="text-yellow-500" size={32} />,
      title: 'Feedback & Ratings',
      description: 'Rate your tutors and give feedback.',
      path: '/student/sessions',
    },
  ];

  return (
    <div>
      <ResponsiveNavbar />
      <div className="h-24" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Welcome, {fullName}{' '}
          <span className="text-sm text-gray-500">({role})</span>
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {summaryData.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition"
            >
              <div className="shrink-0">{item.icon}</div>
              <div>
                <h3 className="text-xl font-semibold">{item.value}</h3>
                <p className="text-gray-600 text-sm">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action, index) => (
            <div
              key={index}
              onClick={() => navigate(action.path)}
              className="cursor-pointer bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition duration-200"
            >
              <div className="mb-4">{action.icon}</div>
              <h2 className="text-xl font-semibold mb-2">{action.title}</h2>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

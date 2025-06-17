import React, { useEffect, useState } from 'react';
import ResponsiveNavbar from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  BookCheck,
  Clock,
  BookOpen,
  UserCheck,
} from 'lucide-react';
import apiService from '../utils/apiService';

const TutorDashboard = () => {
  const tutorId = sessionStorage.getItem('user_id');
  const role = sessionStorage.getItem('account_type') || 'Tutor';
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('Tutor');
  const [summary, setSummary] = useState({
    assignedSchedules: 0,
    upcomingSessions: 0,
    completedSessions: 0,
    pendingBookings: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await apiService.get(`/tutor/summary/${tutorId}`);
        setSummary({
          assignedSchedules: res.data.assignedSchedules,
          upcomingSessions: res.data.upcomingSessions,
          completedSessions: res.data.completedSessions,
          pendingBookings: res.data.pendingBookings,
        });
        setFullName(res.data.fullName);
      } catch (error) {
        console.error('Failed to fetch tutor summary:', error);
      }
    };

    if (tutorId) fetchSummary();
  }, [tutorId]);

  const summaryCards = [
    {
      label: 'Assigned Schedules',
      value: summary.assignedSchedules,
      icon: <UserCheck className="text-blue-600" size={28} />,
    },
    {
      label: 'Upcoming Sessions',
      value: summary.upcomingSessions,
      icon: <CalendarCheck className="text-green-600" size={28} />,
    },
    {
      label: 'Sessions Completed',
      value: summary.completedSessions,
      icon: <Clock className="text-orange-600" size={28} />,
    },
    {
      label: 'Pending Bookings',
      value: summary.pendingBookings,
      icon: <BookOpen className="text-red-500" size={28} />,
    },
  ];

  const actions = [
    {
      icon: <BookCheck className="text-blue-600" size={32} />,
      title: 'My Schedules',
      description: 'View your assigned schedules.',
      path: '/tutor/schedules',
    },
    {
      icon: <CalendarCheck className="text-green-600" size={32} />,
      title: 'My Sessions',
      description: 'Track session status and history.',
      path: '/tutor/sessions',
    },
    {
      icon: <BookOpen className="text-red-500" size={32} />,
      title: 'Booking Requests',
      description: 'Approve or reject pending bookings.',
      path: '/tutor/bookings',
    },
  ];

  return (
    <div>
      <ResponsiveNavbar username={fullName} />
      <div className="h-24" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Welcome, {fullName} <span className="text-sm text-gray-500">({role})</span>
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {summaryCards.map((item, idx) => (
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

export default TutorDashboard;

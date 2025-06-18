import React, { useEffect, useState } from 'react';
import ResponsiveNavbar from '../Components/Navbar';
import { User, Users, UserCheck, UserCog, BookOpen, FileText } from 'lucide-react';
import apiService from '../utils/apiService';

const StaffDashboard = () => {
  const [summary, setSummary] = useState({
    users: { totalUsers: 0, students: 0, tutors: 0, adminStaff: 0 },
    applications: [],
    bookings: [],
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await apiService.get('/admin/summary');
        setSummary(res.data);
      } catch (error) {
        console.error('Failed to fetch admin summary:', error);
      }
    };
    fetchSummary();
  }, []);

  const userStats = [
    { label: 'Total Users', value: summary.users.totalUsers, icon: <Users className="text-blue-600" size={28} /> },
    { label: 'Students', value: summary.users.students, icon: <User className="text-green-600" size={28} /> },
    { label: 'Tutors', value: summary.users.tutors, icon: <UserCheck className="text-yellow-600" size={28} /> },
    { label: 'Admin Staff', value: summary.users.adminStaff, icon: <UserCog className="text-red-600" size={28} /> },
  ];

  return (
    <div>
      <ResponsiveNavbar username="Admin" />
      <div className="h-24" />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome, Admin</h1>

        {/* User Stats */}
        <h2 className="text-xl font-semibold mb-4">User Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {userStats.map((item, index) => (
            <div key={index} className="bg-white p-5 rounded-2xl shadow-md flex items-center gap-4 hover:shadow-lg transition">
              <div className="shrink-0">{item.icon}</div>
              <div>
                <h3 className="text-xl font-semibold">{item.value}</h3>
                <p className="text-gray-600 text-sm">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Applications Summary */}
        <h2 className="text-xl font-semibold mb-4">Application Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {summary.applications.map((app, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition">
              <div className="flex items-center gap-3">
                <FileText className="text-blue-500" size={28} />
                <div>
                  <h4 className="text-lg font-semibold capitalize">{app.status}</h4>
                  <p className="text-gray-600 text-sm">{app.count} application(s)</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bookings Summary */}
        <h2 className="text-xl font-semibold mb-4">Booking Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {summary.bookings.map((booking, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition">
              <div className="flex items-center gap-3">
                <BookOpen className="text-green-500" size={28} />
                <div>
                  <h4 className="text-lg font-semibold capitalize">{booking.status}</h4>
                  <p className="text-gray-600 text-sm">{booking.count} booking(s)</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;

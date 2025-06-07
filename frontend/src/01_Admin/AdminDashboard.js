import React, { useEffect, useState } from 'react';
import ResponsiveNavbar from '../Components/Navbar';
import apiService from '../utils/apiService'; // ✅ make sure this handles GET /users/all

const AdminDashboard = () => {
  const username = sessionStorage.getItem('username') || 'User';
  const account_type = sessionStorage.getItem('account_type') || 'Admin';

  const [counts, setCounts] = useState({
    student: 0,
    tutor: 0,
    secretary: 0,
    admin: 0,
  });

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const res = await apiService.get('/users/all');
        const roleCounts = { "student": 0, "tutor": 0, "admin staff": 0 };

        res.data.forEach(user => {
          const type = user.account_type;
          if (roleCounts[type] !== undefined) {
            roleCounts[type]++;
          }
        });

        setCounts(roleCounts);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUserCounts();
  }, []);

  return (
    <div>
      <ResponsiveNavbar username={username} />
      <div className="h-24" />

      <div className="items-center justify-center flex flex-col">
      <div className="p-6 font-sans">
        <h1 className="text-2xl font-bold mb-6">
          Welcome {username} ({account_type})
        </h1>
        <p className="text-lg mb-4">
          Here is a summary of the current user counts by role:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
          {Object.entries(counts).map(([role, count]) => (
            <div key={role} className="w-80 h-30 bg-white rounded shadow p-4 text-center border">
              <h2 className="text-lg font-semibold capitalize">{role}</h2>
              <p className="text-3xl font-bold text-blue-600">{count}</p>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

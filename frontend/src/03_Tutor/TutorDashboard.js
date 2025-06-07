import React from 'react';
import ResponsiveNavbar from '../Components/Navbar';

const TutorDashboard = () => {
  // Get user info from sessionStorage
  const username = sessionStorage.getItem('username') || 'User';
  const role = sessionStorage.getItem('account_type') || 'User';

  return (
    <div>
      <ResponsiveNavbar username={username} />
       <div className="h-24" />
        <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
            <h1>
                Welcome {username} ({role})
            </h1>
            {/* Add more student-specific content here */}
        </div>
    </div>
  );
};

export default TutorDashboard;

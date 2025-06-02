import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './utils/protectedRoutes';

//Public Routes
import LandingPage from './Components/LandingPage'; // adjust path if needed
import LoginPage from './Components/LoginPage';
import Unauthorized from './utils/unauthorize';

//Admin Routes
// import AdminUserPage from './01_Admin/AdminUserPage';
import AdminDashboard from './01_Admin/AdminDashboard';
import AdminProfile from './01_Admin/AdminProfile';
import AdminUserManagement from './01_Admin/AdminUserPage';
import AdminPackageManagement from './01_Admin/AdminPackage';
import AdminTimeslotManagement from './01_Admin/AdminTimeslotPage';

//Student Routes
import StudentProfile from './04_Student/StudentProfile';
import StudentDashboard from './04_Student/StudentDashboard';

// Tutor Routes
import TutorDashboard from './03_Tutor/TutorDashboard';
import TutorProfile from './03_Tutor/TutorProfile';


function App() {
  return (
    <>
    <Router>
      <Routes>
        {/* Default route redirects to /login */}
        <Route path="/" element={< LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route 
          element={<ProtectedRoute allowed_type="admin" />}
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/users" element={<AdminUserManagement />} />
          <Route path="/admin/packages" element={<AdminPackageManagement />} />
          <Route path="/admin/timeslots" element={<AdminTimeslotManagement />} />
        </Route>

        {/* Student Routes */}
        <Route
          element={<ProtectedRoute allowed_type="student" />}
          >
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        </Route>

        {/* Tutor Routes */}
        <Route
          element={<ProtectedRoute allowed_type="tutor" />}
        >
        <Route path="/tutor/dashboard" element={<TutorDashboard />} />    
        <Route path="/tutor/profile" element={<TutorProfile />} />
        </Route>
        
        {/* Add other routes here */}
        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>  
    </>
  );
}

export default App;

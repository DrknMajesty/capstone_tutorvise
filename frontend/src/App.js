import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './utils/protectedRoutes';

//Public Routes
import LandingPage from './Components/LandingPage'; // adjust path if needed
import LoginPage from './Components/LoginPage';
import Unauthorized from './utils/unauthorize';
import TestPage from './Components/LearningCenterPage';

//Admin Routes
// import AdminUserPage from './01_Admin/AdminUserPage';
import AdminDashboard from './01_Admin/AdminDashboard';
import AdminProfile from './01_Admin/AdminProfile';
import AdminUserManagement from './01_Admin/AdminUserPage';
import AdminPackageManagement from './01_Admin/AdminPackage';
import AdminTimeslotManagement from './01_Admin/AdminTimeslotPage';
import AdminPaymentManagement from './01_Admin/AdminPayment';
import AdminBookingManagement from './01_Admin/AdminBooking';

//Student Routes
import StudentProfile from './04_Student/StudentProfile';
import StudentDashboard from './04_Student/StudentDashboard';
import StudentBooking from './04_Student/StudentBookingPage';
import StudentBooking2 from './04_Student/StudentBookingPage2';

// Tutor Routes
import TutorDashboard from './03_Tutor/TutorDashboard';
import TutorProfile from './03_Tutor/TutorProfile';
import TutorBooking from './03_Tutor/TutorBooking';


function App() {
  return (
    <>
    <Router>
      <Routes>
        {/* Default route redirects to /login */}
        <Route path="/" element={< LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Test Route */}
        <Route path="/test" element={<TestPage/>}/>

        {/* Admin Routes */}
        <Route 
          element={<ProtectedRoute allowed_type="admin" />}
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/users" element={<AdminUserManagement />} />
          <Route path="/admin/packages" element={<AdminPackageManagement />} />
          <Route path="/admin/timeslots" element={<AdminTimeslotManagement />} />
          <Route path="/admin/payments" element={<AdminPaymentManagement />} />
          <Route path="/admin/bookings" element={<AdminBookingManagement />} />
        </Route>

        {/* Student Routes */}
        <Route
          element={<ProtectedRoute allowed_type="student" />}
          >
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/bookings" element={<StudentBooking />} />
        <Route path="/student/booking-list" element={<StudentBooking2/>} />
        </Route>

        {/* Tutor Routes */}
        <Route
          element={<ProtectedRoute allowed_type="tutor" />}
        >
        <Route path="/tutor/dashboard" element={<TutorDashboard />} />    
        <Route path="/tutor/profile" element={<TutorProfile />} />
        <Route path="/tutor/bookings" element={<TutorBooking /> } />
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

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
import AdminScheduleManagement from './01_Admin/AdminSchedules';
import AdminSessionManagement from './01_Admin/AdminSessions';
import AdminReportsManagement from './01_Admin/AdminReports';

// Admin Staff Routes
import StaffDashboard from './02_Admin Staff/StaffDashboard';
import StaffProfile from './02_Admin Staff/StaffProfile';
import StaffUserPage from './02_Admin Staff/StaffUser';
import StaffPackagePage from './02_Admin Staff/StaffPackage';
import StaffSchedulesPage from './02_Admin Staff/StaffSchedules';
import StaffSessionsPage from './02_Admin Staff/StaffSession';

//Student Routes
import StudentProfile from './04_Student/StudentProfile';
import StudentDashboard from './04_Student/StudentDashboard';
import StudentBooking from './04_Student/StudentBookingPage';
import StudentBooking2 from './04_Student/StudentBookingPage2';
import StudentPaymentPage from './04_Student/StudentPayment';

// Tutor Routes
import TutorDashboard from './03_Tutor/TutorDashboard';
import TutorProfile from './03_Tutor/TutorProfile';
import TutorBooking from './03_Tutor/TutorBooking';
import TutorSessions from './03_Tutor/TutorSessions';
import StudentSessionsPage from './04_Student/StudentSessions';

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
        element={<ProtectedRoute allowed_type={'admin'} />}
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/users" element={<AdminUserManagement />} />
          <Route path="/admin/packages" element={<AdminPackageManagement />} />
          <Route path="/admin/timeslots" element={<AdminTimeslotManagement />} />
          <Route path="/admin/payments" element={<AdminPaymentManagement />} />
          <Route path="/admin/bookings" element={<AdminBookingManagement />} />
          <Route path="/admin/schedules" element={<AdminScheduleManagement />} />
          <Route path="/admin/sessions" element={<AdminSessionManagement />} />
          <Route path="/admin/reports" element={<AdminReportsManagement />} />
        </Route>
        {/* Admin Staff */}
        <Route 
        element={<ProtectedRoute allowed_type={'admin staff'} />}
        >
          <Route path="/admin-staff/dashboard" element={<StaffDashboard />} />
          <Route path="/admin-staff/users" element={<StaffUserPage/>} />
          <Route path="/admin-staff/profile" element={<StaffProfile />} />
          <Route path="/admin-staff/packages" element={<StaffPackagePage />} />
          <Route path="/admin-staff/schedules" element={<StaffSchedulesPage />} />
          <Route path="/admin-staff/sessions" element={<StaffSessionsPage/>} />
        </Route>

        {/* Student Routes */}
        <Route
          element={<ProtectedRoute allowed_type="student" />}
          >
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/bookings" element={<StudentBooking />} />
        <Route path="/student/booking-list" element={<StudentBooking2 />} />
        <Route path="/student/sessions" element={<StudentSessionsPage />} />
        <Route path="/student/payments" element={<StudentPaymentPage />} />
        </Route>

        {/* Tutor Routes */}
        <Route
          element={<ProtectedRoute allowed_type="tutor" />}
        >
        <Route path="/tutor/dashboard" element={<TutorDashboard />} />    
        <Route path="/tutor/bookings" element={<TutorBooking /> } />
        <Route path="/tutor/sessions" element={<TutorSessions />} />
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

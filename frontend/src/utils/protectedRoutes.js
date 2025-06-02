// utils/protectedRoutes.js
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowed_type }) => {
  const userType = localStorage.getItem('account_type');

  return userType === allowed_type
    ? <Outlet />
    : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;

import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowed_type }) => {
  const userType = sessionStorage.getItem('account_type');

  const isAllowed = Array.isArray(allowed_type)
    ? allowed_type.includes(userType)
    : userType === allowed_type;

  return isAllowed ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;

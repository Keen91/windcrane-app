import { useLocation, Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
  const location = useLocation();

  return localStorage.getItem("accessToken") ? <Outlet /> : localStorage.getItem("email") ? <Navigate to="/unauthorized" state={{ from: location }} replace /> : <Navigate to="/signin" state={{ from: location }} replace />;
};

export default RequireAuth;

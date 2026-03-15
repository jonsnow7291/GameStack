import { Navigate } from 'react-router-dom';

function ProtectedRoute({ user, children }) {
  if (!user.token || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;

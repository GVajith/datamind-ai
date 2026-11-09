import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const isLoggedIn = useSelector((state) => state.dataMindReducer.isLoggedIn);
  const location = useLocation();
  return isLoggedIn ? children : <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
}

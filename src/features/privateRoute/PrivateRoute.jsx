import { Navigate } from "react-router";
import { useAuth } from "../authentication/authenticationSlice";

export const PrivateRoute = ({ children }) => {
  const { token, loggedInStatus } = useAuth();
  return (
    <>
      {token && loggedInStatus ? (
         children 
      ) : (
        <Navigate replace to="/login" />
      )}
    </>
  );
};

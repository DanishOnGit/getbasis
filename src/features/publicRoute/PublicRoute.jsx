import { Navigate } from "react-router";
import { useAuth } from "../authentication/authenticationSlice";

export const PublicRoute = ({children }) => {
  const { token,loggedInStatus } = useAuth();
  return (
    <>
      {token && loggedInStatus ? (
        <Navigate replace to="/" />
      ) : (
        children
      )}
    </>
  );
};

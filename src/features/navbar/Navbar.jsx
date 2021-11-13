import { useDispatch } from "react-redux";
import { logoutUser, useAuth } from "../authentication/authenticationSlice";

export const Navbar = () => {
  const { userProfile } = useAuth();
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(logoutUser({ id: userProfile._id, token: userProfile.token }));
  };
  return (
    <>
      <div className="navbar">
        <button className="btn-secondary" onClick={logout}>
          Log out
        </button>
      </div>
    </>
  );
};

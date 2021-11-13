import React from "react";
import { Route, Routes } from "react-router";
import { useAuth } from "./features/authentication/authenticationSlice";
import { Login } from "./features/authentication/Login";
import { Signup } from "./features/authentication/Signup";
import { Navbar } from "./features/navbar/Navbar";
import { PrivateRoute } from "./features/privateRoute/PrivateRoute";
import { Profile } from "./features/profile/Profile";
import { PublicRoute } from "./features/publicRoute/PublicRoute";

function App() {
  const { loggedInStatus } = useAuth();
  return (
    <div className="App">
      <div>
        {loggedInStatus && <Navbar />}
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                {" "}
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;

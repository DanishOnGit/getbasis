import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { requestVerificationMail, useAuth } from "./authenticationSlice";
import { OtpForm } from "./OtpForm";

export const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const dispatch = useDispatch();
  const { token } = useAuth();
  const requestToken = (e) => {
    e.preventDefault();
    dispatch(requestVerificationMail(userEmail));
  };
  return (
    <>
      <div className="login-form">
        <h1 className="text-center">Login</h1>
        <form onSubmit={requestToken}>
          <label htmlFor="userEmail">Email:</label>
          <br />
          <input
            id="userEmail"
            className="input"
            type="email"
            value={userEmail}
            placeholder="abc@xyz.com"
            onChange={(e) => setUserEmail(e.target.value)}
            readOnly={!!token}
            required
          />
          <br />
          {!token && (
            <div className="text-center">
              <button className="btn" type="submit">
                Login
              </button>
            </div>
          )}

          {token && (
            <OtpForm
              verificationCode={verificationCode}
              setVerificationCode={setVerificationCode}
              userEmail={userEmail}
            />
          )}
        </form>
      </div>
    </>
  );
};

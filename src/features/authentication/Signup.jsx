import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { notify } from "../utils/toast";
import { checkReferralCode, signupUser, useAuth } from "./authenticationSlice";

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [referredCodeKey, setReferredCodeKey] = useState("");
  const [agreeToPrivacyPolicy, setAgreeToPrivacyPolicy] = useState(false);
  const { token, email } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signup = async (e) => {
    e.preventDefault();
    if (agreeToPrivacyPolicy) {
      if (referredCodeKey.length >= 1) {
        const result = await dispatch(checkReferralCode(referredCodeKey));
        if (result?.payload?.statusCode === 1100) {
          dispatch(
            signupUser({
              firstName: firstName,
              referredCodeKey,
              email,
              token: JSON.stringify(token),
            })
          );
        }
      } else {
        dispatch(
          signupUser({
            firstName: firstName,
            referredCodeKey,
            email,
            token: JSON.stringify(token),
          })
        );
      }
    } else {
      notify({ message: "You must agree to our privacy policy", type: "info" });
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);
  return (
    <>
      <div>
        <h1 className="text-center">Sign Up</h1>
        <form onSubmit={signup}>
          <label htmlFor="name">Name:</label>
          <br />
          <input
            required
            className="input"
            id="name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <br />
          <label htmlFor="email">Email:</label>
          <br />

          <input
            className="input"
            type="email"
            id="email"
            value={email}
            readOnly
          />

          <br />
          <label htmlFor="referredCodeKey">Referral code (optional):</label>
          <br />

          <input
            className="input"
            id="referredCodeKey"
            value={referredCodeKey}
            onChange={(e) => {
              setReferredCodeKey(e.target.value);
            }}
          />

          <br />
          <input
            id="privacy-policy"
            type="checkbox"
            checked={agreeToPrivacyPolicy}
            onChange={() => setAgreeToPrivacyPolicy(!agreeToPrivacyPolicy)}
          />
          <label htmlFor="privacy-policy">Agree to privacy policy</label>
          <div className="text-center">
            <button className="btn" type="submit">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

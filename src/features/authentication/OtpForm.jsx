import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { resendToken, useAuth, verifyCode } from "./authenticationSlice";

export const OtpForm = ({
  verificationCode,
  setVerificationCode,
  userEmail,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isExistingUser, token } = useAuth();

  const verifyCodeHandler = async () => {
    const { payload } = await dispatch(
      verifyCode({ verificationCode, email: userEmail })
    );
    
    if (payload?.data?.statusCode === 1020 && isExistingUser) {
      navigate("/");
    }
    if (payload?.data?.statusCode === 1020 && !isExistingUser) {
      navigate("/signup");
    }
  };

  const resendTokenHandler = () => {
    
    dispatch(resendToken({ email: userEmail, token: JSON.stringify(token) }));
  };

  return (
    <>
      <label htmlFor="tokenField">Enter Token:</label>
      <br/>
      <input
        id="tokenField"
        className="input"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
      <small className='block'>Token length must be 6 characters</small>
      <div className="text-center">
        <button
          className="btn"
          onClick={verifyCodeHandler}
          disabled={verificationCode.toString().length < 6 ? true : false}
        >
          Verify Token
        </button>
        <br />
        <p className="resend-btn" onClick={resendTokenHandler}>
          Resend Token
        </p>
      </div>
    </>
  );
};

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
  const { isExistingUser,token } = useAuth();

  const verifyCodeHandler = async () => {
    const { payload } = await dispatch(
      verifyCode({ verificationCode, email: userEmail })
    );
    console.log("otp jsx", payload);
    if (payload?.data?.statusCode === 1020 && isExistingUser) {
      navigate("/");
    }
    if (payload?.data?.statusCode === 1020 && !isExistingUser) {
      navigate("/signup");
    }
  };

  const resendTokenHandler=()=>{
      console.log('resending token')
      dispatch(resendToken({email:userEmail,token:JSON.stringify(token)}))
  }

  return (
    <>
      <input
        className="input"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
      <br />
      <div className="text-center">
        <button className="btn" onClick={verifyCodeHandler}>
          Verify Token
        </button>
        <br/>
        <p className='resend-btn' onClick={resendTokenHandler}>
            Resend Token
        </p>
      </div>
    </>
  );
};
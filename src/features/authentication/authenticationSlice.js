import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "../utils/apiUrl";
import { notify } from "../utils/toast";

export const requestVerificationMail = createAsyncThunk(
  "authentication/requestVerificationMail",
  async (userEmail, { rejectWithValue }) => {
    try {
      const {data} = await axios({
        method: "POST",
        url: `${API_URL}/users/email`,
        data: {
          email: userEmail,
        },
        headers: {
          "Content-type": "application/json",
        },
      });

      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const verifyCode = createAsyncThunk(
  "authentication/verifyCode",
  async (verificationDetails, { getState, rejectWithValue }) => {
    try {
      const { email, verificationCode } = verificationDetails;
      const { auth } = getState();

      const response = await axios({
        method: "PUT",
        url: `${API_URL}/users/email/verify`,
        data: {
          email,
          token: auth.token,
          verificationCode,
        },
      });

      return { data: response.data, email };
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const resendToken = createAsyncThunk(
  "authentication/resendToken",
  async (resendTokenDetails, { rejectWithValue }) => {
    try {
      const { data } = await axios({
        method: "PUT",
        url: `${API_URL}/users/token/resendtoken`,
        data: {
          email: resendTokenDetails.email,
          token: resendTokenDetails.token,
        },
      });

      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "authentication/logoutUser",
  async (logoutData) => {
    try {
      const {data} = await axios({
        method: "DELETE",
        url: `${API_URL}/users/logout/${logoutData.id}`,
        headers: {
          Authorization: `Bearer ${logoutData.id},${logoutData.token}`,
        },
      });

      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const signupUser = createAsyncThunk(
  "authentication/signupUser",
  async (signupFormData, { rejectWithValue }) => {
    try {
      const {data} = await axios({
        method: "POST",
        url: `${API_URL}/users`,
        data: {
          ...signupFormData,
          agreeToPrivacyPolicy: true,
          source: "WEB_APP",
        },
      });
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const checkReferralCode = createAsyncThunk(
  "authentication/checkReferralCode",
  async (referralCode, { rejectWithValue }) => {
    try {
      const { data } = await axios({
        method: "GET",
        url: `${API_URL}/users/referral/${referralCode}`,
      });

      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState: {
    status: "idle",
    token: null,
    email: "",
    userProfile: {},
    isExistingUser: false,
    loggedInStatus: false,
  },
  reducers: {
    logoutButtonClicked: (state) => {
      state.status = "idle";
      state.token = null;
    },
  },
  extraReducers: {
    [requestVerificationMail.pending]: (state) => {
      state.status = "pending";
    },
    [requestVerificationMail.fulfilled]: (state, { payload }) => {
      state.status = "fulfilled";

      state.token = payload.results.token;
      state.isExistingUser = payload.results.isLogin;
      notify({
        message: "Verification email sent sucessfully!",
        type: "success",
      });
    },
    [requestVerificationMail.rejected]: (state, { payload }) => {
      state.status = "error";

      notify({ message: payload.message, type: "error" });
    },

    [verifyCode.pending]: (state) => {
      state.status = "pending";
    },
    [verifyCode.fulfilled]: (state, { payload }) => {
      state.status = "fulfilled";

      if (payload.data.statusCode === 1020 && payload.data.results.isLogin) {
        state.userProfile = { ...payload.data.results.user };
        state.loggedInStatus = true;
        notify({ message: "Login successfull", type: "success" });
      }
      if (payload.data.statusCode === 1020 && !payload.data.results.isLogin) {
        state.email = payload.email;
      }
      if (payload.data.statusCode === 1021) {
        notify({ message: "Invalid Token", type: "error" });
      }
      if (
        (payload.data.statusCode === 1022 &&
          payload.data.messageObj.wrongEmailTokenCount >= 3) ||
        payload.data.statusCode === 3003
      ) {
        notify({
          message: "Wrong token entered too many times",
          type: "error",
        });

        state.token = null;
      }
    },
    [verifyCode.rejected]: (state, { payload }) => {
      state.status = "error";
      notify({ message: payload.message, type: "error" });
    },
    [resendToken.pending]: (state) => {
      state.status = "pending";
    },
    [resendToken.fulfilled]: (state, { payload }) => {
      state.status = "fulfilled";
      if (payload?.statusCode === 1031) {
        notify({ message: "Resend token limit reached", type: "info" });
        state.token = null;
      } else {
        notify({ message: "Token resent successfully", type: "success" });
      }
    },
    [resendToken.rejected]: (state, { payload }) => {
      state.status = "rejected";
    },
    [signupUser.pending]: (state) => {
      state.status = "pending";
    },
    [signupUser.fulfilled]: (state, { payload }) => {
      state.status = "fulfilled";

      state.userProfile = { ...payload.results.user };
      state.loggedInStatus = true;
      notify({ message: "Signup successfull", type: "success" });
    },
    [signupUser.rejected]: (state, { payload }) => {
      state.status = "rejected";

      notify({ message: payload?.message, type: "error" });
    },
    [checkReferralCode.pending]: (state) => {
      state.status = "pending";
    },
    [checkReferralCode.fulfilled]: (state, { payload }) => {
      state.status = "fulfilled";
    },
    [checkReferralCode.rejected]: (state, { payload }) => {
      state.status = "rejected";
      notify({
        message: "Please enter valid referral code or remove it!",
        type: "error",
      });
    },
    [logoutUser.pending]: (state) => {
      state.status = "pending";
    },
    [logoutUser.fulfilled]: (state, { payload }) => {
      state.status = "fulfilled";
      if (payload.statusCode === 1015) {
        state.loggedInStatus = false;
        state.token = null;
      }
    },
  },
});

export const { logOutButtonClicked } = authenticationSlice.actions;
export default authenticationSlice.reducer;
export const useAuth = () => {
  return useSelector((state) => state.auth);
};

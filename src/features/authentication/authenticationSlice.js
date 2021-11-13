import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "../utils/apiUrl";
import { notify } from "../utils/toast";

export const requestVerificationMail = createAsyncThunk(
  "authentication/requestVerificationMail",
  async (userEmail, { rejectWithValue }) => {
    try {
      console.log("thunk running..");
      const res = await axios({
        method: "POST",
        url: `${API_URL}/users/email`,
        data: {
          email: userEmail,
        },
        headers: {
          "Content-type": "application/json",
        },
      });
      console.log("requestVerificationMail thunk running...", res.data);
      return res.data;
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
      console.log(auth);
      const res = await axios({
        method: "PUT",
        url: `${API_URL}/users/email/verify`,
        data: {
          email,
          token: auth.token,
          verificationCode,
        },
      });

      return { data: res.data, email };
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
      console.log("resend token", data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const signupUser = createAsyncThunk(
    "authentication/signupUser",
    async (signupFormData, { rejectWithValue }) => {
      try {
        const res = await axios({
          method: "POST",
          url: `${API_URL}/users`,
          data: {
            ...signupFormData,
            agreeToPrivacyPolicy: true,
            source: "WEB_APP",
          },
        });
        return res.data;
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
      console.log("payload", payload);
      state.token = payload.results.token;
      state.isExistingUser = payload.results.isLogin;
    },
    [requestVerificationMail.rejected]: (state, { payload }) => {
      state.status = "error";
      console.log("rejected", payload);
      notify({ message: payload.message, type: "error" });
    },

    [verifyCode.pending]: (state) => {
      state.status = "pending";
    },
    [verifyCode.fulfilled]: (state, { payload }) => {
      state.status = "fulfilled";
      console.log("verofy code fulilled", payload);
      if (payload.data.statusCode === 1020 && payload.data.results.isLogin) {
        state.userProfile = { ...payload.data.results.user };
        state.loggedInStatus = true;
        notify({ message: "Login successfull", type: "success" });
      }
      if (payload.data.statusCode === 1020 && !payload.data.results.isLogin) {
        state.email = payload.email;
      }
      if (
        payload.data.statusCode === 1022 &&
        payload.data.messageObj.wrongEmailTokenCount >= 3
      ) {
        notify({
          message: "Wrong token entered too many times",
          type: "error",
        });
        console.log("Wron otp limit reached");
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
        console.log("signup payload", payload);
        state.userProfile = { ...payload.results.user };
        state.loggedInStatus = true;
        notify({ message: "Signup successfull", type: "success" });
      },
      [signupUser.rejected]: (state, { payload }) => {
        state.status = "rejected";
  
        notify({ message: payload?.message, type: "error" });
      },
  },
});

export const { logOutButtonClicked } = authenticationSlice.actions;
export default authenticationSlice.reducer;
export const useAuth = () => {
  return useSelector((state) => state.auth);
};

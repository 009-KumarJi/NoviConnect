import {createAsyncThunk} from "@reduxjs/toolkit";
import {server} from "../../constants/config.constant.js";
import axios from "axios";

const adminLogin = createAsyncThunk("admin/login", async (secretKey) => {
  try {
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${server}/admin/api/krishna-den/verify`,
      { secret_key: secretKey },
      config
    );

    return data.message;
  } catch (error) {
    throw error.response.data.message;
  }
});

const adminLogout = createAsyncThunk("admin/logout", async () => {
  try {
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.get(`${server}/admin/api/krishna-den/logout`, config);
    return data.message;
  } catch (error) {
    throw error.response.data.message;
  }
});

const verifyAdmin = createAsyncThunk("admin/verify", async () => {
  try {
    const { data } = await axios.get(`${server}/admin/api/krishna-den/`, {withCredentials: true});
    return data;
  } catch (error) {
    throw error.response.data.message;
  }
});

export {adminLogin, adminLogout, verifyAdmin};
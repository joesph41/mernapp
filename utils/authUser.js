import axios from "axios";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";
import Router from "next/router";
import cookie from "js-cookie";
import { jwt } from "jsonwebtoken";

export const registerUser = async (
  user,
  profilePicUrl,
  setError,
  setLoading
) => {
  try {
    const res = await axios.post(`${baseUrl}/api/signup`, {
      user,
      profilePicUrl,
    });
    setToken(res.data);
  } catch (error) {
    const errorMsg = catchErrors(error);
    setError(errorMsg);
  }
  setLoading(false);
};

export const loginUser = async (user, setError, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.post(`${baseUrl}/api/auth`, {
      user,
    });
    setToken(res.data);
  } catch (error) {
    const errorMsg = catchErrors(error);
    setError(errorMsg);
  }
  setLoading(false);
};

export const redirectUser = (ctx, location) => {
  // We check for ctx.res to make sure we're on the server
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    // This else block is for the client side where we don't
    // have ctx available
    Router.push("/location");
  }
};

export const logoutUser = (email) => {
  // This email cookie is set to remember users last used email
  cookie.set("userEmail", email);
  cookie.remove("token");
  Router.push("/login");
};

const setToken = (token) => {
  cookie.set("token", token);
  Router.push("/");
};

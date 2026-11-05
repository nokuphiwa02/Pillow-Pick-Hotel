
import React from "react";
import styles from "./LoginForm.module.css";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";

import {
  LoginThunk,
  GoogleLoginThunk,
  updateEmailAddress,
  updatePassword,
} from "../../redux/LoginSlice";

import type { RootState, AppDispatch } from "../../../store";

export const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const email = useSelector(
    (state: RootState) => state.signIn.emailInput,
  );

  const password = useSelector(
    (state: RootState) => state.signIn.passwordInput,
  );

  const { error, isLoading } = useSelector(
    (state: RootState) => state.signIn,
  );

  const signUp = () => {
    navigate("/register");
  };

  // Redirect according to the user's role
  const redirectUser = (role: string) => {
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "guest") {
      navigate("/Guestdashboard");
    } else {
      alert("User role not recognized. Please contact the administrator.");
    }
  };

  // Normal email and password login
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    const result = await dispatch(LoginThunk({ email, password }));

    if (LoginThunk.fulfilled.match(result)) {
      alert("Login successful");

      redirectUser(result.payload.user.role);
    }
  };

  // Google login
  const handleGoogleLogin = async (credential: string) => {
    const result = await dispatch(GoogleLoginThunk(credential));

    if (GoogleLoginThunk.fulfilled.match(result)) {
      alert("Google login successful");

      redirectUser(result.payload.user.role);
    }
  };

  return (
    <form onSubmit={handleSave} className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.tittle}>LOGIN</h1>

        {error && (
          <p style={{ color: "red", textAlign: "center" }}>
            {error}
          </p>
        )}

        <div className={styles.email}>
          <label>Email Address:</label>

          <input
            type="email"
            className={styles.emailInput}
            onChange={(e) =>
              dispatch(updateEmailAddress(e.target.value))
            }
            value={email}
            required
          />
        </div>

        <div className={styles.password}>
          <label>Password:</label>

          <input
            type="password"
            className={styles.passwordInput}
            onChange={(e) =>
              dispatch(updatePassword(e.target.value))
            }
            value={password}
            required
          />
        </div>

        <button
          className={styles.loginBtn}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>

        <p style={{ textAlign: "center" }}>OR</p>

        {/* Google login button */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "15px 0",
          }}
        >
          <GoogleLogin
            onSuccess={(response) => {
              if (response.credential) {
                handleGoogleLogin(response.credential);
              }
            }}
            onError={() => {
              alert("Google login failed. Please try again.");
            }}
            theme="outline"
            size="large"
            text="continue_with"
            shape="rectangular"
          />
        </div>

        <p className={styles.account}>
          Don't have an account?{" "}
          <span
            onClick={signUp}
            style={{
              color: "#007bff",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Create an Account
          </span>
        </p>
      </div>
    </form>
  );
};

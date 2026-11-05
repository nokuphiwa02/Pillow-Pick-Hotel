
import React, { useEffect, useRef } from "react";
import styles from "./LoginForm.module.css";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import {
  LoginThunk,
  GoogleLoginThunk,
  updateEmailAddress,
  updatePassword,
} from "../../redux/LoginSlice";

import type { RootState, AppDispatch } from "../../../store";

// Google Identity Services types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme: string;
              size: string;
              text: string;
              shape: string;
              width: number;
            },
          ) => void;
        };
      };
    };
  }
}

export const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const googleButtonRef = useRef<HTMLDivElement>(null);

  const email = useSelector(
    (state: RootState) => state.signIn.emailInput,
  );

  const password = useSelector(
    (state: RootState) => state.signIn.passwordInput,
  );

  const { error, isLoading } = useSelector(
    (state: RootState) => state.signIn,
  );

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const signUp = () => {
    navigate("/register");
  };

  // Handle successful login and redirect according to user role
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

  // Load Google Identity Services and display its button
  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) {
      return;
    }

    const initializeGoogle = () => {
      if (!window.google || !googleButtonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response) => {
          if (response.credential) {
            handleGoogleLogin(response.credential);
          }
        },
      });

      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          width: 280,
        },
      );
    };

    const existingScript = document.getElementById(
      "google-identity-script",
    );

    if (window.google) {
      initializeGoogle();
    } else if (!existingScript) {
      const script = document.createElement("script");

      script.id = "google-identity-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;

      script.onload = initializeGoogle;

      document.head.appendChild(script);
    } else {
      existingScript.addEventListener("load", initializeGoogle);
    }

    return () => {
      existingScript?.removeEventListener("load", initializeGoogle);
    };
  }, [googleClientId]);

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

        {/* Google sign-in button */}
        <div
          ref={googleButtonRef}
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "15px 0",
          }}
        />

        {!googleClientId && (
          <p style={{ color: "red", textAlign: "center" }}>
            Google Client ID is not configured.
          </p>
        )}

        {/* <button
          className={styles.registerBtn}
          type="button"
          onClick={signUp}
        >
          Sign up
        </button> */}

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


import React, { useState } from "react";
import styles from "./RegisterForm.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store";

import {
  RegisterThunk,
  RegisterAdminThunk,
  AddName,
  AddPhone,
  AddEmailAddress,
  AddPassword,
} from "../../redux/registerSlice";

export const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminRegistration =
    location.pathname === "/admin/add-admin";

  const [error, setError] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();

  const { name, phone, email, password, isLoading } =
    useSelector((state: RootState) => state.signUp);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (
      !name.trim() ||
      !phone ||
      !email.trim() ||
      !password.trim()
    ) {
      setError("All fields are required.");
      return;
    }

    const registrationData = {
      name,
      phone,
      email,
      password,
    };

    const result = isAdminRegistration
      ? await dispatch(RegisterAdminThunk(registrationData))
      : await dispatch(RegisterThunk(registrationData));

    if (
      (isAdminRegistration &&
        RegisterAdminThunk.fulfilled.match(result)) ||
      (!isAdminRegistration &&
        RegisterThunk.fulfilled.match(result))
    ) {
      alert(
        isAdminRegistration
          ? "Administrator registered successfully!"
          : "Registration successful!"
      );

      if (isAdminRegistration) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      setError(
        String(
          result.payload || "Registration failed. Please try again."
        )
      );
    }
  };

  return (
    <form onSubmit={handleSave} className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <h1 className={styles.tittle}>
          {isAdminRegistration ? "ADD ADMIN" : "REGISTER"}
        </h1>

        {error && <p role="alert">{error}</p>}

        <div className={styles.firstInfo}>
          <div className={styles.userName}>
            <label>Name:</label>

            <input
              type="text"
              className={styles.name}
              value={name}
              onChange={(e) => dispatch(AddName(e.target.value))}
            />
          </div>

          <div className={styles.phone}>
            <label>Phone:</label>

            <input
              type="tel"
              className={styles.phone}
              value={phone || ""}
              onChange={(e) =>
                dispatch(AddPhone(Number(e.target.value)))
              }
            />
          </div>
        </div>

        <div className={styles.secondInfo}>
          <div className={styles.email}>
            <label>Email Address:</label>

            <input
              type="email"
              className={styles.Email}
              value={email}
              onChange={(e) =>
                dispatch(AddEmailAddress(e.target.value))
              }
            />
          </div>
        </div>

        <div className={styles.thirdInfo}>
          <div className={styles.password}>
            <label>Password:</label>

            <input
              type="password"
              className={styles.Password}
              value={password}
              onChange={(e) =>
                dispatch(AddPassword(e.target.value))
              }
            />
          </div>
        </div>

        <button
          className={styles.registerBtn}
          type="submit"
          disabled={isLoading}
        >
          {isLoading
            ? "Registering..."
            : isAdminRegistration
            ? "Create Admin"
            : "Register"}
        </button>

        {!isAdminRegistration && (
          <p className={styles.loginLink}>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        )}

        {isAdminRegistration && (
          <p className={styles.loginLink}>
            <span onClick={() => navigate("/admin")}>
              Back to Dashboard
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Register;

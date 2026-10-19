import React from "react";
import styles from "./LoginForm.module.css";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { LoginThunk,updateEmailAddress, updatePassword} from "../../redux/LoginSlice";
import type { RootState, AppDispatch } from "../../../store";

export const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const email = useSelector((state: RootState) => state.signIn.emailInput);
  const password = useSelector(
    (state: RootState) => state.signIn.passwordInput,
  );
  const { error, isLoading } = useSelector((state: RootState) => state.signIn);

  const signUp = () => {
    navigate("/register");
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email && password) {
      const result = await dispatch(LoginThunk({ email, password }));

      if (LoginThunk.fulfilled.match(result)) {
        alert("Login successful");
        navigate('/admin');
      }
    } else {
      alert("Please enter both email and password.");
    }
  };

  return (
    <form onSubmit={handleSave} className={styles.loginContainer}>
     
      <div className={styles.loginCard}>
       <h1 className={styles.tittle}>LOGIN</h1>
       
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
       
        <div className={styles.email}>
          <label>Email Address:</label>
         
          <input
            type="email"
            className={styles.emailInput}
            onChange={(e) => dispatch(updateEmailAddress(e.target.value))}
            value={email}
            required
          />
        
        </div>
        
        <div className={styles.password}>
        <label>Password:</label>
         
          <input
            type="password"
            className={styles.passwordInput}
            onChange={(e) => dispatch(updatePassword(e.target.value))}
            value={password}
            required
          />
         
        </div>
      
        <button className={styles.loginBtn} type="submit" disabled={isLoading}>
          {isLoading ? "Signing In..." : "Sign In"}
         
        </button>
      
        <button className={styles.registerBtn} type="button" onClick={signUp}>
        Sign up
        </button>
       <p className={styles.account}>create an Account?</p>
       
      </div>
     
    </form>
  );
};
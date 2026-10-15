import React, { useState } from "react";
import styles from "./RegisterForm.module.css";
import { useNavigate } from "react-router";
// import type { User } from "../../redux/features/RegisterSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store";
import { RegisterThunk,  AddName, AddPhone, AddEmailAddress,
    AddPassword} from "../../redux/registerSlice";

export const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const back = () => {
    navigate("/");
  };

  const dispatch = useDispatch<AppDispatch>();

  const { name, phone, email, password} =
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

    const result = await dispatch(
      RegisterThunk({
        name,
        phone,
        email,
        password
      }),
    );

    if (RegisterThunk.fulfilled.match(result)) {
      alert("Registration successful");
      navigate("/");
    }
  };

  return (
    <form onSubmit={handleSave} className={styles.registerContainer}>
      
      <div className={styles.registerCard}>
        <h1 className={styles.tittle}>REGISTER</h1>
        {error && <p role="alert">{error}</p>}
        
        <div className={styles.firstInfo}>
          
          <div className={styles.userName}>
            <label>Name:</label>
            
            <input
              type="userName"
              className={styles.name}
              value={name}
              onChange={(e) => dispatch( AddName(e.target.value))}
            />
            
          </div>
          
          <div className={styles.phone}>
            <label>phone:</label>
            
            <input
              type="phone"
              className={styles.phone}
              value={phone}
              onChange={(e) => dispatch( AddPhone(Number(e.target.value)))}
            />
            
          </div>
          
        </div>
        
        <div className={styles.secondInfo}>
          
        
          
          <div className={styles.email}>
            <label>Email Address:</label>
            
            <input
              type="email Address"
              className={styles.Email}
              value={email}
              onChange={(e) => dispatch( AddEmailAddress(e.target.value))}
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
              onChange={(e) => dispatch( AddPassword(e.target.value))}
            />
            
          </div>
          
          
        </div>
       
        
        <button
          className={styles.registerBtn}
          type="submit"
          onClick={() => handleSave}
        >
         Register 
        </button>
        
        <button className={styles.back} onClick={back}>
          Back 
        </button>
        
      </div>
      
    </form>
  );
};

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../../../store";
import {
  GetProfileByIdThunk,
  UpdateProfileThunk,
} from "../../redux/ProfileSlice";
import styles from "./Profile.module.css";

export const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { profile, isLoading, error } = useSelector(
    (state: RootState) => state.profile
  );

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    address: "",
  });

  const [isFormInitialized, setIsFormInitialized] = useState(false);

  // Load the currently logged-in user's information
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      console.error("No logged-in user found.");
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      // Fill fields immediately from the logged-in user
      setFormData((prev) => ({
        ...prev,
        name: user.name ?? "",
        phone: user.phone != null ? String(user.phone) : "",
        email: user.email ?? "",
        address: user.address ?? "",
      }));

      setIsFormInitialized(true);

      // Load the additional profile record if one exists
      const userId = Number(user.id);

      if (Number.isInteger(userId) && userId > 0) {
        dispatch(GetProfileByIdThunk(userId));
      } else {
        console.error("Invalid logged-in user ID:", user.id);
      }
    } catch (err) {
      console.error("Could not read logged-in user:", err);
    }
  }, [dispatch, navigate]);

  // Merge profile information without erasing login information
  useEffect(() => {
    if (!profile) return;

    setFormData((prev) => ({
      ...prev,
      name: profile.name || prev.name,
      phone:
        profile.phone != null && profile.phone !== ""
          ? String(profile.phone)
          : prev.phone,
      email: profile.email || prev.email,
      address: profile.address || prev.address,
      password: "",
    }));

    setIsFormInitialized(true);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const back = () => {
    navigate("/Guestdashboard");
  };

  const handleLogOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("Token");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!profile?.id) {
      alert(
        "Your profile record was not found. Your details may be displayed, but updating requires a profile record."
      );
      return;
    }

    const profileData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      ...(formData.password
        ? { password: formData.password }
        : {}),
    };

    const result = await dispatch(
      UpdateProfileThunk({
        id: profile.id,
        profileData,
      })
    );

    if (UpdateProfileThunk.fulfilled.match(result)) {
      alert("Your profile has been updated.");
      setFormData((prev) => ({ ...prev, password: "" }));
    } else {
      alert("Failed to update your profile. Please try again.");
    }
  };

  if (isLoading && !isFormInitialized) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  return (
    <form onSubmit={handleSave} className={styles.profileContainer}>
      <div className={styles.profileContent}>
        <h1>Profile</h1>

        {error && <p className={styles.errorField}>{error}</p>}

        <div className={styles.first}>
          <div className={styles.Name}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name..."
              className={styles.Name}
              required
            />
          </div>

          <div className={styles.surname}>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address..."
              className={styles.Surname}
            />
          </div>
        </div>

        <div className={styles.second}>
          <div className={styles.email}>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Contact..."
              className={styles.Contact}
              required
            />
          </div>

          <div className={styles.email}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address..."
              className={styles.Email}
              required
            />
          </div>
        </div>

        <div className={styles.third}>
          <div className={styles.email}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New password (optional)"
              className={styles.Password}
              autoComplete="new-password"
            />
          </div>

          <div className={styles.btns}>
            <button
              type="button"
              className={styles.logoutbtn}
              onClick={handleLogOut}
            >
              LogOut
            </button>

            <button
              type="submit"
              className={styles.updatebtn}
              disabled={isLoading || !profile?.id}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>

            <button
              type="button"
              className={styles.backBtn}
              onClick={back}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Profile;

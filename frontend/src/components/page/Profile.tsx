
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../../../store";
import {GetProfileByIdThunk,UpdateProfileThunk,} from "../../redux/ProfileSlice";
import { fetchBookings } from "../../redux/BookingSlice";
import { fetchHotels } from "../../redux/HotelSlice";
import { getAllImages } from "../../redux/ImageSlice";
import { fetchRooms } from "../../redux/RoomSlice";
import {fetchFavourites, removeFavourite,} from "../../redux/FavourateSlice";

import styles from "./Profile.module.css";

export const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { profile, isLoading, error } = useSelector(
    (state: RootState) => state.profile
  );

  const bookings = useSelector(
    (state: RootState) => state.bookings.bookings
  );

  const hotels = useSelector(
    (state: RootState) => state.hotels.hotels
  );

  const images = useSelector(
    (state: RootState) => state.images.images
  );

  const rooms = useSelector(
    (state: RootState) => state.rooms.rooms
  );

  const favourites = useSelector(
    (state: RootState) => state.favourates.favourites
  );

  const [userId, setUserId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const [isFormInitialized, setIsFormInitialized] = useState(false);

  // Load the logged-in user and required profile information.
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      const id = Number(user.id);

      if (!Number.isInteger(id) || id <= 0) {
        console.error("Invalid logged-in user ID:", user.id);
        navigate("/login");
        return;
      }

      setUserId(id);

      setFormData((prev) => ({
        ...prev,
        name: user.name ?? "",
        phone: user.phone != null ? String(user.phone) : "",
        email: user.email ?? "",
      }));

      setIsFormInitialized(true);

      dispatch(GetProfileByIdThunk(id));
      dispatch(fetchBookings());
      dispatch(fetchHotels());
      dispatch(getAllImages());
      dispatch(fetchRooms());
      dispatch(fetchFavourites());
    } catch (err) {
      console.error("Could not read logged-in user:", err);
      navigate("/login");
    }
  }, [dispatch, navigate]);

  // Populate the form when profile information is returned.
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

  // Save profile changes.
  const handleSave = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const id = userId;

if (!id) {
  alert("User ID not found. Please log in again.");
  return;
}

    const profileData = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      ...(formData.password.trim()
        ? { password: formData.password }
        : {}),
    };

    try {
      const result = await dispatch(
        UpdateProfileThunk({
          id,
          profileData,
        })
      );

      if (UpdateProfileThunk.fulfilled.match(result)) {
        alert("Profile updated successfully!");

        setFormData((prev) => ({
          ...prev,
          password: "",
        }));
      } else {
        const message =
          typeof result.payload === "string"
            ? result.payload
            : result.error.message ?? "Please try again.";

        alert(`Update failed: ${message}`);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Something went wrong while updating your profile.");
    }
  };

  // Log out the current user.
  const handleLogOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("Token");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Only show bookings belonging to the logged-in user.
  const myBookings = bookings.filter(
    (booking) => Number(booking.user_id) === userId
  );

  // Show this user's favourite hotels and remove duplicate hotels.
  const myFavouriteHotels = favourites
    .filter((favourite) => Number(favourite.user_id) === userId)
    .map((favourite) => ({
      favourite,
      hotel: hotels.find(
        (hotel) => Number(hotel.id) === Number(favourite.hotel_id)
      ),
    }))
    .filter(
      (
        item
      ): item is {
        favourite: (typeof favourites)[number];
        hotel: (typeof hotels)[number];
      } => item.hotel !== undefined
    )
    .filter(
      (item, index, array) =>
        array.findIndex(
          (entry) => entry.hotel.id === item.hotel.id
        ) === index
    );

  // Get a hotel's image from the hotel image collection.
  const getHotelImage = (hotelId: number, fallback?: string) => {
    const hotelImages = images.filter(
      (image) => Number(image.hotel_id) === Number(hotelId)
    );

    const primaryImage = hotelImages.find((image) => image.is_primary);
    const selectedImage = primaryImage ?? hotelImages[0];

    return (
      selectedImage?.img_url ||
      fallback ||
      "/assets/fallback-hotel.jpg"
    );
  };

  // Remove the correct favourite record, not the hotel record.
  const handleRemoveFavourite = async (hotelId: number) => {
    const favourite = favourites.find(
      (item) =>
        Number(item.hotel_id) === Number(hotelId) &&
        Number(item.user_id) === userId
    );

    if (!favourite) {
      alert("Favourite record not found. Please refresh the page.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to remove this hotel from your favourites?"
    );

    if (!confirmed) return;

    try {
      const result = await dispatch(removeFavourite(favourite.id));

      if (removeFavourite.fulfilled.match(result)) {
        alert("Hotel removed from your favourites successfully.");
      } else {
        alert(
          typeof result.payload === "string"
            ? result.payload
            : "Failed to remove the hotel. Please try again."
        );
      }
    } catch (err) {
      console.error("Remove favourite error:", err);
      alert("Something went wrong while removing this favourite.");
    }
  };

  if (isLoading && !isFormInitialized) {
    return (
      <div className={styles.loading}>
        Loading profile...
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      {/* PROFILE DETAILS */}
      <form
        onSubmit={handleSave}
        className={styles.profileContainer}
      >
        <div className={styles.profileContent}>
          <h1>My Profile</h1>

          {error && (
            <p className={styles.errorField}>
              {typeof error === "string"
                ? error
                : "Unable to load profile information."}
            </p>
          )}

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
                Log Out
              </button>

              <button
                type="submit"
                className={styles.updatebtn}
                disabled={isLoading || !(profile?.id ?? userId)}
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </button>

              <button
            type="button"
            className={styles.backBtn}
            onClick={() => {
              const savedUser = localStorage.getItem("user");

              if (!savedUser) {
                navigate("/login");
                return;
              }

              const loggedInUser = JSON.parse(savedUser);

              if (loggedInUser.role === "admin") {
                navigate("/admin");
              } else {
                navigate("/Guestdashboard");
              }
            }}
          >
            Back
          </button>
            </div>
          </div>
        </div>
      </form>

      {/* MY BOOKINGS */}
      <section className={styles.section}>
        <h2>My Bookings</h2>

        {myBookings.length === 0 ? (
          <p className={styles.emptyMessage}>
            You have no bookings yet.
          </p>
        ) : (
          <div className={styles.bookingList}>
            {myBookings.map((booking) => {
              const room = rooms.find(
                (item) => Number(item.id) === Number(booking.room_id)
              );

              const hotel = room
                ? hotels.find(
                    (item) => Number(item.id) === Number(room.hotel_id)
                  )
                : undefined;

              return (
                <article
                  className={styles.bookingCard}
                  key={booking.id}
                >
                  {hotel && (
                    <img
                      className={styles.bookingImage}
                      src={getHotelImage(hotel.id, hotel.image_url)}
                      alt={hotel.hotel_name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "/assets/fallback-hotel.jpg";
                      }}
                    />
                  )}

                  <div className={styles.bookingDetails}>
                    <h3>
                      {hotel?.hotel_name ?? "Hotel details unavailable"}
                    </h3>

                    <p>
                      <strong>City:</strong>{" "}
                      {hotel?.city ?? "Not available"}
                    </p>

                    <p>
                      <strong>Room:</strong>{" "}
                      {room?.room_type ?? "Not available"}
                    </p>

                    <p>
                      <strong>Check-in:</strong> {booking.check_in}
                    </p>

                    <p>
                      <strong>Check-out:</strong> {booking.check_out}
                    </p>

                    <p>
                      <strong>Guests:</strong> {booking.guest_number}
                    </p>

                    <p>
                      <strong>Total:</strong>{" "}
                      R{Number(booking.total_price).toFixed(2)}
                    </p>

                    <span className={styles.bookingStatus}>
                      {booking.booking_status}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* MY FAVOURITE HOTELS */}
      <section className={styles.section}>
        <h2>My Favourite Hotels</h2>

        {myFavouriteHotels.length === 0 ? (
          <p className={styles.emptyMessage}>
            You have not added any favourite hotels yet.
          </p>
        ) : (
          <div className={styles.favouriteGrid}>
            {myFavouriteHotels.map(({ favourite, hotel }) => (
              <article
                className={styles.favouriteCard}
                key={favourite.id}
              >
                <img
                  className={styles.favouriteImage}
                  src={getHotelImage(hotel.id, hotel.image_url)}
                  alt={`${hotel.hotel_name} hotel`}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "/assets/fallback-hotel.jpg";
                  }}
                />

                <div className={styles.favouriteDetails}>
                  <h3>{hotel.hotel_name}</h3>
                  <p>{hotel.city}</p>
                  <p>Rating: {hotel.rating}/5</p>

                  <div className={styles.profileActions}>
                    <button
                      type="button"
                      className={styles.viewHotelButton}
                      onClick={() =>
                        navigate(`/hotels/${hotel.id}`)
                      }
                    >
                      View Hotel
                    </button>

                    <button
                      type="button"
                      className={styles.removeFavouriteButton}
                      onClick={() =>
                        handleRemoveFavourite(hotel.id)
                      }
                    >
                      Remove Favourite
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;

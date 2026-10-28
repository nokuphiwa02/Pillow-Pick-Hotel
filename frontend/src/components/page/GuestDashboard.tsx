
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../store";

import { fetchHotels } from "../../redux/HotelSlice";
import { getAllImages } from "../../redux/ImageSlice";

import styles from "./GuetsDashboard.module.css";
import Hero from "../Hero/Hero";
import HotelCard from "../HotelCard/HotelCard";

const API_BASE_URL = "http://localhost:5000";

const getImageUrl = (imagePath?: string): string => {
  if (!imagePath) return "/assets/fallback-hotel.jpg";

  if (/^(https?:\/\/|data:|blob:)/i.test(imagePath)) {
    return imagePath;
  }

  const path = imagePath.replace(/\\/g, "/");
  return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
};

const GuestDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { hotels, loading: hotelsLoading, error: hotelsError } =
    useSelector((state: RootState) => state.hotels);

  const { images, loading: imagesLoading, error: imagesError } =
    useSelector((state: RootState) => state.images);

  useEffect(() => {
    dispatch(fetchHotels());
    dispatch(getAllImages());
  }, [dispatch]);

  const loading = hotelsLoading || imagesLoading;
  const error = hotelsError || imagesError;

  return (
    <div className={styles.dashboard}>
      <nav className={styles.navbar}>
        <h2
          className={styles.logo}
          onClick={() => navigate("/user-dashboard")}
        >
          HavenStay
        </h2>

        
    <button
      type="button"
      className={styles.profileButton}
      onClick={() => navigate("/profile")}
      aria-label="Go to profile"
    >
      <span>Profile</span>
      <span className={styles.profileIcon} aria-hidden="true">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
        </svg>
      </span>
    </button>

      </nav>

      <Hero />

      <main className={styles.cardGrid}>
        {loading && <p>Loading hotels and images...</p>}

        {error && (
          <p className={styles.errorText}>
            Unable to load hotels or images: {error}
          </p>
        )}

        {!loading && !error && hotels.length === 0 && (
          <p>No hotels available at the moment.</p>
        )}

        {!loading &&
          !error &&
          hotels.map((hotel) => {
            const hotelImages = images.filter(
              (image) => image.hotel_id === hotel.id
            );

            const selectedImage =
              hotelImages.find((image) => image.is_primary) ??
              hotelImages[0];

            const imagePath = selectedImage?.img_url || hotel.image_url;

            return (
              <HotelCard
                key={hotel.id}
                imgSrc={getImageUrl(imagePath)}
                imgAlt={`${hotel.hotel_name} hotel`}
                hotel_name={hotel.hotel_name}
                Province={hotel.city}
                buttonText="View More"
                onClick={() => navigate(`/hotels/${hotel.id}`)}
              />
            );
          })}
      </main>
    </div>
  );
};

export default GuestDashboard;

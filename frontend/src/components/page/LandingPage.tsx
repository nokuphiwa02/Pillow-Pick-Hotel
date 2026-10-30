
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../store";

import { fetchHotels } from "../../redux/HotelSlice";
import { getAllImages } from "../../redux/ImageSlice";

import styles from "../page/LandingPage.module.css";
import Navbar from "../navbar/navbar";
import Hero from "../Hero/Hero";
import HotelCard from "../HotelCard/HotelCard";

const API_BASE_URL = "http://localhost:5000";

const getImageUrl = (imagePath?: string): string => {
  if (!imagePath) {
    return "/assets/fallback-hotel.jpg";
  }

  if (/^(https?:\/\/|data:|blob:)/i.test(imagePath)) {
    return imagePath;
  }

  const path = imagePath.replace(/\\/g, "/");

  return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
};

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    hotels,
    loading: hotelsLoading,
    error: hotelsError,
  } = useSelector((state: RootState) => state.hotels);

  const {
    images,
    loading: imagesLoading,
    error: imagesError,
  } = useSelector((state: RootState) => state.images);

  useEffect(() => {
    dispatch(fetchHotels());
    dispatch(getAllImages());
  }, [dispatch]);

  const loading = hotelsLoading || imagesLoading;
  const error = hotelsError || imagesError;

  return (
    <div>
      <Navbar />
      <Hero />

      <main className={styles.cardGrid}>
        {loading && (
          <p className={styles.statusText}>
            Loading hotels and images...
          </p>
        )}

        {error && (
          <p className={styles.errorText}>
            Unable to load hotels or images: {String(error)}
          </p>
        )}

        {!loading && !error && hotels.length === 0 && (
          <p className={styles.statusText}>
            No hotels available at the moment.
          </p>
        )}

        {!loading &&
          !error &&
          hotels.map((hotel) => {
            const hotelImages = images.filter(
              (image) =>
                Number(image.hotel_id) === Number(hotel.id)
            );

            const selectedImage =
              hotelImages.find(
                (image) =>
                  image.is_primary === true ||
                  String(image.is_primary) === "1"
              ) ?? hotelImages[0];

            const imagePath =
              selectedImage?.img_url || hotel.image_url;

            return (
              <HotelCard
            key={hotel.id}
            hotelId={Number(hotel.id)}
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

export default LandingPage;

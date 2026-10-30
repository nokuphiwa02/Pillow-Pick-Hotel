
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
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
  if (!imagePath) {
    return "/assets/fallback-hotel.jpg";
  }

  if (/^(https?:\/\/|data:|blob:)/i.test(imagePath)) {
    return imagePath;
  }

  const path = imagePath.replace(/\\/g, "/");

  return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
};

const GuestDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [searchCity, setSearchCity] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

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

  const filteredHotels = hotels.filter((hotel) =>
    String(hotel.city ?? "")
      .toLowerCase()
      .includes(activeSearch.trim().toLowerCase())
  );

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActiveSearch(searchCity.trim());
  };

  const clearSearch = () => {
    setSearchCity("");
    setActiveSearch("");
  };

  return (
    <div className={styles.dashboard}>
      <nav className={styles.navbar}>
        <h2
          className={styles.logo}
          onClick={() => navigate("/user-dashboard")}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              navigate("/user-dashboard");
            }
          }}
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

      <section className={styles.searchSection}>
        <div className={styles.searchContent}>
          <h2>Find Your Perfect Stay</h2>
          <p>Search for hotels in your preferred city.</p>

          <form className={styles.searchForm} onSubmit={handleSearch}>
            <input
              type="search"
              value={searchCity}
              onChange={(event) => setSearchCity(event.target.value)}
              placeholder="Enter a city, e.g. Durban"
              aria-label="Search hotels by city"
            />

            <button type="submit" className={styles.searchButton}>
              Search
            </button>

            {(searchCity || activeSearch) && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={clearSearch}
              >
                Clear
              </button>
            )}
          </form>
        </div>
      </section>

      <main className={styles.cardGrid}>
        <div className={styles.resultsHeading}>
          <h2>
            {activeSearch
              ? `Hotels in ${activeSearch}`
              : "Explore Hotels"}
          </h2>

          {!loading && !error && (
            <span className={styles.resultsCount}>
              {filteredHotels.length}{" "}
              {filteredHotels.length === 1 ? "hotel" : "hotels"} found
            </span>
          )}
        </div>

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
          hotels.length > 0 &&
          filteredHotels.length === 0 && (
            <div className={styles.noResults}>
              <h3>No hotels found</h3>
              <p>
                We couldn't find hotels in "{activeSearch}". Try another city.
              </p>

              <button
                type="button"
                className={styles.searchButton}
                onClick={clearSearch}
              >
                Show All Hotels
              </button>
            </div>
          )}

        {!loading &&
          !error &&
          filteredHotels.map((hotel) => {
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
              showGuestActions={true}
              onClick={() => navigate(`/hotels/${hotel.id}`)}
            />
            );
          })}
      </main>
    </div>
  );
};

export default GuestDashboard;

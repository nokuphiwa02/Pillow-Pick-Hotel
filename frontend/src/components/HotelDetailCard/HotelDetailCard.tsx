
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store";
import { fetchHotels } from "../../redux/HotelSlice";
import { fetchRooms, type Room } from "../../redux/RoomSlice";
import { getAllImages } from "../../redux/ImageSlice";
import {BookingModal} from "../page/BookingModal";

import styles from "./HotelDetailCard.module.css";

const API_BASE_URL = "http://localhost:5000";

const getImageUrl = (imagePath?: string | null): string => {
  if (!imagePath || !imagePath.trim()) {
    return "";
  }

  const path = imagePath.trim().replace(/\\/g, "/");

  if (/^(https?:\/\/|data:|blob:)/i.test(path)) {
    return path;
  }

  return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
};

const HotelDetailCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const {
    hotels,
    loading: hotelsLoading,
    error: hotelsError,
  } = useSelector((state: RootState) => state.hotels);

  const {
    rooms,
    loading: roomsLoading,
    error: roomsError,
  } = useSelector((state: RootState) => state.rooms);

  const { images } = useSelector(
    (state: RootState) => state.images
  );

  useEffect(() => {
    dispatch(fetchHotels());
    dispatch(fetchRooms());
    dispatch(getAllImages());
  }, [dispatch, id]);

  const hotel = hotels.find(
    (item) => String(item.id) === String(id)
  );

  const hotelRooms = rooms.filter(
    (room) => String(room.hotel_id) === String(id)
  );

  const hotelImages = images.filter(
    (image) => String(image.hotel_id) === String(id)
  );

  const primaryImage =
    hotelImages.find(
      (image) =>
        image.is_primary === true ||
        String(image.is_primary) === "1"
    ) ?? hotelImages[0];

  const hotelImagePath =
    primaryImage?.img_url || hotel?.image_url;

  const hotelImageUrl = getImageUrl(hotelImagePath);

  const handleBookNow = () => {
    document.getElementById("rooms")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (hotelsLoading && hotels.length === 0) {
    return (
      <main className={styles.statusContainer}>
        <p>Loading hotel details...</p>
      </main>
    );
  }

  if (hotelsError && !hotel) {
    return (
      <main className={styles.statusContainer}>
        <p className={styles.errorMessage}>
          Unable to load hotel details: {hotelsError}
        </p>
      </main>
    );
  }

  if (!hotel) {
    return (
      <main className={styles.statusContainer}>
        <h2>Hotel not found</h2>
        <p>
          The requested hotel could not be found.
          Please check the hotel ID and try again.
        </p>
      </main>
    );
  }

  const mapQuery = encodeURIComponent(
    `${hotel.address}, ${hotel.city}`
  );

  return (
    <main className={styles.detailsPage}>
      <section className={styles.hotelSection}>
        <div className={styles.imageContainer}>
          {hotelImageUrl ? (
            <img
              src={hotelImageUrl}
              alt={hotel.hotel_name}
              className={styles.hotelImage}
              onError={() => {
                console.error(
                  "Hotel image failed to load:",
                  hotelImageUrl
                );
              }}
            />
          ) : (
            <p>No hotel image available.</p>
          )}
        </div>

        <div className={styles.hotelInfo}>
          <span className={styles.eyebrow}>
            HOTEL DETAILS
          </span>

          <h1 className={styles.hotelName}>
            {hotel.hotel_name}
          </h1>

          <p className={styles.location}>
            <span aria-hidden="true">📍</span>{" "}
            {hotel.address}, {hotel.city}
          </p>

          <div className={styles.rating}>
            <span aria-hidden="true">★</span>
            <span>{hotel.rating} / 5</span>
          </div>

          <p className={styles.description}>
            {hotel.description}
          </p>

          <button
            type="button"
            className={styles.bookButton}
            onClick={handleBookNow}
          >
            Book Now
          </button>
        </div>
      </section>

      {/* // ROOMS  */}
      <section
        id="rooms"
        className={styles.roomsSection}
      >
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.eyebrow}>
              ACCOMMODATION
            </span>

            <h2>Rooms at {hotel.hotel_name}</h2>

            <p>
              Explore the available room options and prices.
            </p>
          </div>

          <span className={styles.roomCount}>
            {hotelRooms.length}{" "}
            {hotelRooms.length === 1
              ? "room type"
              : "room types"}
          </span>
        </div>

        {roomsLoading && rooms.length === 0 && (
          <p className={styles.statusMessage}>
            Loading rooms...
          </p>
        )}

        {roomsError && (
          <p className={styles.errorMessage}>
            Unable to load rooms: {roomsError}
          </p>
        )}

        {!roomsLoading &&
          !roomsError &&
          hotelRooms.length === 0 && (
            <div className={styles.emptyState}>
              <h3>No rooms listed yet</h3>
              <p>
                There are currently no rooms listed for
                this hotel.
              </p>
            </div>
          )}

        <div className={styles.roomsGrid}>
          {hotelRooms.map((room) => {
            const roomImagePath = Array.isArray(room.image)
              ? room.image[0]
              : "";

            const roomImageUrl = getImageUrl(roomImagePath);

            const isUnavailable =
              Number(room.quantity) < 1;

            return (
              <article
                key={room.id}
                className={styles.roomCard}
              >
                {/* // ROOM IMAGE  */}
                <div className={styles.roomImageContainer}>
                  {roomImageUrl ? (
                    <img
                      src={roomImageUrl}
                      alt={room.room_type}
                      className={styles.roomImage}
                      onError={() => {
                        console.error(
                          "Room image failed to load:",
                          roomImageUrl
                        );
                      }}
                    />
                  ) : (
                    <p>No room image available.</p>
                  )}
                </div>

                <div className={styles.roomHeader}>
                  <div>
                    <span className={styles.roomLabel}>
                      ROOM TYPE
                    </span>

                    <h3>{room.room_type}</h3>
                  </div>

                  <span className={styles.capacity}>
                    {room.capacity}{" "}
                    {Number(room.capacity) === 1
                      ? "guest"
                      : "guests"}
                  </span>
                </div>

                <p className={styles.roomDescription}>
                  {room.description}
                </p>

                <div className={styles.roomFacilities}>
                  <h4>Facilities</h4>
                  <p>
                    {room.facilities ||
                      "No facilities listed"}
                  </p>
                </div>

                <div className={styles.roomFooter}>
                  <div>
                    <span className={styles.priceLabel}>
                      Price per night
                    </span>

                    <p className={styles.price}>
                      R
                      {Number(
                        room.price_per_night
                      ).toFixed(2)}
                    </p>
                  </div>

                  <div className={styles.quantity}>
                    <span>Quantity</span>
                    <strong>{room.quantity}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.bookButton}
                  disabled={isUnavailable}
                  onClick={() => setSelectedRoom(room)}
                >
                  {isUnavailable
                    ? "Unavailable"
                    : "Book This Room"}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* HOTEL LOCATION */}
      <section className={styles.locationSection}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.eyebrow}>
              FIND US
            </span>

            <h2>Hotel location</h2>

            <p>
              {hotel.address}, {hotel.city}
            </p>
          </div>
        </div>

        <div className={styles.mapContainer}>
          <iframe
            title={`Map showing ${hotel.hotel_name}`}
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <a
          className={styles.directionsLink}
          href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
          target="_blank"
          rel="noreferrer"
        >
          Get directions ↗
        </a>
      </section>

      {/* BOOKING MODAL */}
      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          hotelName={hotel.hotel_name}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </main>
  );
};

export default HotelDetailCard;

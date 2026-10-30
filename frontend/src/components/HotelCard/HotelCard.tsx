
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store";

import {
  addFavourite,
  removeFavourite,
} from "../../redux/FavourateSlice";

import styles from "../HotelCard/HotelCard.module.css";

type HotelCardProps = {
  hotelId: number;
  imgSrc: string;
  imgAlt: string;
  hotel_name: string;
  buttonText: string;
  Province: string;
  onClick: () => void;
  showGuestActions?: boolean;
};

const FALLBACK_IMAGE = "/assets/fallback-hotel.jpg";

const HotelCard = ({
  hotelId,
  imgSrc,
  imgAlt,
  hotel_name,
  buttonText,
  Province,
  onClick,
  showGuestActions = false,
}: HotelCardProps) => {
  const [imageSrc, setImageSrc] = useState(imgSrc);
  const [shareMessage, setShareMessage] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const isLoggedIn = Boolean(localStorage.getItem("Token"));

  const favourites = useSelector(
    (state: RootState) => state.favourates.favourites
  );

  const isFavourite = favourites.some(
    (favourite) => Number(favourite.hotel_id) === Number(hotelId)
  );

  useEffect(() => {
    setImageSrc(imgSrc);
  }, [imgSrc]);

  const handleFavouriteClick = () => {
    const token = localStorage.getItem("Token");

    if (!token) return;

    if (isFavourite) {
      dispatch(removeFavourite(hotelId));
    } else {
      dispatch(addFavourite(hotelId));
    }
  };

  const handleShare = async () => {
    setShareMessage("");

    const hotelUrl = `${window.location.origin}/hotels/${hotelId}`;

    const shareData = {
      title: hotel_name,
      text: `Check out ${hotel_name} in ${Province} on HavenStay!`,
      url: hotelUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.text}\n${hotelUrl}`
        );

        setShareMessage("Hotel link copied! You can now share it.");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      setShareMessage("Unable to share automatically. Please try again.");
    }
  };

  return (
    <article className={styles.cardContainer}>
      <div className={styles.imageContainer}>
        <img
          src={imageSrc}
          alt={imgAlt}
          className={styles.htlImg}
          onError={() => {
            if (imageSrc !== FALLBACK_IMAGE) {
              setImageSrc(FALLBACK_IMAGE);
            }
          }}
        />

        {showGuestActions && isLoggedIn && (
          <button
            type="button"
            className={styles.favouriteBtn}
            onClick={handleFavouriteClick}
            aria-label={
              isFavourite
                ? `Remove ${hotel_name} from favourites`
                : `Add ${hotel_name} to favourites`
            }
            title={
              isFavourite
                ? "Remove from favourites"
                : "Add to favourites"
            }
          >
            {isFavourite ? "❤️" : "♡"}
          </button>
        )}
      </div>

      <h2 className={styles.topic}>{hotel_name}</h2>

      <p className={styles.province}>{Province}</p>

      <div className={styles.cardActions}>
        <button
          type="button"
          className={styles.cardBtn}
          onClick={onClick}
        >
          {buttonText}
        </button>

        {showGuestActions && isLoggedIn && (
          <button
            type="button"
            className={styles.shareBtn}
            onClick={handleShare}
            aria-label={`Share ${hotel_name}`}
            title="Share hotel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="m8.7 10.7 6.6-4.4" />
              <path d="m8.7 13.3 6.6 4.4" />
            </svg>
          </button>
        )}
      </div>

      {shareMessage && (
        <p className={styles.shareMessage} role="status">
          {shareMessage}
        </p>
      )}
    </article>
  );
};

export default HotelCard;

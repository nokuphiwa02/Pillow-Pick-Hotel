
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store";
import {addFavourite,removeFavourite,} from "../../redux/FavourateSlice";
import styles from "../HotelCard/HotelCard.module.css";

type HotelCardProps = {
  hotelId: number;
  imgSrc: string;
  imgAlt: string;
  hotel_name: string;
  buttonText: string;
  Province: string;
  onClick: () => void;
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
}: HotelCardProps) => {
  const [imageSrc, setImageSrc] = useState(imgSrc);
  const dispatch = useDispatch<AppDispatch>();

  const favourites = useSelector(
  (state: RootState) => state.favourates.favourites
);

  const isFavourite = favourites.some(
    (favourite) => favourite.hotel_id === hotelId
  );

  useEffect(() => {
    setImageSrc(imgSrc);
  }, [imgSrc]);

 const handleFavouriteClick = () => {
  console.log("Hotel ID in HotelCard:", hotelId);
  dispatch(addFavourite(hotelId));
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

        <button
          type="button"
          className={styles.favouriteBtn}
          onClick={handleFavouriteClick}
          aria-label={
            isFavourite
              ? `Remove ${hotel_name} from favourites`
              : `Add ${hotel_name} to favourites`
          }
          title={isFavourite ? "Remove from favourites" : "Add to favourites"}
        >
          {isFavourite ? "❤️" : "♡"}
        </button>
      </div>

      <h2 className={styles.topic}>{hotel_name}</h2>

      <p className={styles.province}>{Province}</p>

      <button
        type="button"
        className={styles.cardBtn}
        onClick={onClick}
      >
        {buttonText}
      </button>
    </article>
  );
};

export default HotelCard;

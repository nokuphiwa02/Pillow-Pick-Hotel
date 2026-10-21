
import { useState } from "react";
import styles from "../HotelCard/HotelCard.module.css";

type HotelCardProps = {
  imgSrc: string;
  imgAlt: string;
  hotel_name: string;
  buttonText: string;
  Province: string;
  onClick: () => void;
};

const FALLBACK_IMAGE = "/assets/fallback-hotel.jpg";

const HotelCard = ({
  imgSrc,
  imgAlt,
  hotel_name,
  buttonText,
  Province,
  onClick,
}: HotelCardProps) => {
  const [imageSrc, setImageSrc] = useState(imgSrc);

  return (
    <article className={styles.cardContainer}>
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

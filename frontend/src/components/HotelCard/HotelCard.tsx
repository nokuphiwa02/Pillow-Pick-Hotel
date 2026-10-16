import React from 'react'
import styles from '../HotelCard/HotelCard.module.css'

type HotelCardProps = {
  imgSrc: string
  imgAlt: string
  city: string
  buttonText: string 
}

export const HotelCard = ({ imgSrc, imgAlt, city, buttonText }: HotelCardProps) => {
  return (
    <div className={styles.cardsGrid}>
    <div className={styles.cardContainer}>
      <img src={imgSrc} alt={imgAlt} className={styles.htlImg}/>
      <h2 className={styles.topic}>{city}</h2>
      <button className={styles.cardBtn}>{buttonText}</button>
      </div>
      </div>
  )
}

export default HotelCard

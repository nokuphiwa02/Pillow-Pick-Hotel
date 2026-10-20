import React from 'react'
import styles from '../HotelCard/HotelCard.module.css'
import { useNavigate } from 'react-router-dom'

type HotelCardProps = {
  imgSrc: string
  imgAlt: string
  hotel_name: string
  buttonText: string 
  Province: string
  onClick : () => void
}

export const HotelCard = ({ imgSrc, imgAlt, hotel_name, buttonText,Province,onClick }: HotelCardProps) => {
  
  

  return (
    <div className={styles.cardContainer}>
      <img src={imgSrc} alt={imgAlt} className={styles.htlImg}/>
      <h2 className={styles.topic}>{hotel_name}</h2>
      <p>{Province}</p>
      <button className={styles.cardBtn} onClick={onClick}>{buttonText}</button>
     </div>
     
  )
}

export default HotelCard;

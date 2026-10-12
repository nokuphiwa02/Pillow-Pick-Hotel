import React from 'react'
import styles from "../Hero/Hero.module.css"
import hero from "../../assets/heroPhoto.jpg"

const Hero = () => {
  return (
    <div className={styles.heroContainer}>
      <img src={hero} alt="hero" />
  <div className={styles.heroContent}>
    {/* <h2>The perfect choice.The plush sleep. </h2>
    <h2>  Welcome to PILLOW PICK Hotel your curated boutique escape</h2> */}
  </div>
    </div>
  )
}

export default Hero;

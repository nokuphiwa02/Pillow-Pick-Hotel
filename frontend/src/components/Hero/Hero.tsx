
import React from 'react';
import styles from '../Hero/Hero.module.css';
import hero from '../../assets/heroPhoto.jpg';

const Hero: React.FC = () => {
  return (
    <section className={styles.heroContainer}>
      <div className={styles.heroImageWrapper}>
        <img
          src={hero}
          alt="Beautiful hotel accommodation"
          className={styles.heroImage}
        />
      </div>

      <div className={styles.heroContent}>
        <span className={styles.eyebrow}>
          WELCOME TO HAVENSTAY
        </span>

        <h1>
          Find Your Perfect <span>Stay.</span>
        </h1>

        <p>
          Discover beautiful hotels, enjoy exceptional comfort,
          and find the perfect place to relax on your next journey.
        </p>

        <a href="/hotels" className={styles.heroButton}>
          Explore Hotels <span aria-hidden="true">→</span>
        </a>

        <div className={styles.heroNote}>
          <span className={styles.goldLine}></span>
          <span>Comfort, elegance, and memorable stays.</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import React from 'react'
import styles from "../page/LandingPage.module.css";
import   Navbar  from '../navbar/navbar';
import Hero from '../Hero/Hero';
import HotelCard from '../HotelCard/HotelCard';
import hotelP from '../../assets/hotelpP.jpg'
import hotelpP from '../../assets/hotelpP.jpg'
import Bon from '../../assets/Bon.jpg'
import Boutique from '../../assets/Boutique.jpg'
import Luxuries from '../../assets/Luxuries.jpg'
import images from '../../assets/images.jpg'


const LandingPage = () => {
  const hotelData = [
    { id: 1, imgSrc: hotelP, imgAlt: 'Durban Hotel', city: 'Durban', buttonText: 'View More' },
    { id: 2, imgSrc: hotelpP, imgAlt: 'Cape Town Hotel', city: 'Cape Town', buttonText: 'View More' },
    { id: 3, imgSrc: Bon, imgAlt: 'Johannesburg Hotel', city: 'Johannesburg', buttonText: 'View More' },
    { id: 4, imgSrc: Boutique, imgAlt: 'Pretoria Hotel', city: 'Pretoria', buttonText: 'View More' },
    { id: 5, imgSrc: Luxuries, imgAlt: 'Gqeberha Hotel', city: 'Gqeberha', buttonText: 'View More' },
    { id: 6, imgSrc: images, imgAlt: 'Bloemfontein Hotel', city: 'Bloemfontein', buttonText: 'View More' },
  ];
  return (
    <div>
      <Navbar/>
      <Hero/>
      <div className={styles.cardGrid}> 
        {hotelData.map((hotel) => (
          <HotelCard 
            key={hotel.id} 
            imgSrc={hotel.imgSrc} 
            imgAlt={hotel.imgAlt} 
            city={hotel.city} 
            buttonText={hotel.buttonText} 
          />
        ))}
      </div>
    </div>
  )
}

export default LandingPage;






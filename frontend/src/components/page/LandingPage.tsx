
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
import { useNavigate } from "react-router-dom";


const LandingPage = () => {
const navigate = useNavigate()

  const hotelData = [
    { id: 1, imgSrc: hotelP, imgAlt: 'Durban Hotel', hotel_name: 'Boutique hotel', buttonText: 'View More' },
    { id: 2, imgSrc: hotelpP, imgAlt: 'Cape Town Hotel', hotel_name: 'Bon hotel', buttonText: 'View More' },
    { id: 3, imgSrc: Bon, imgAlt: 'Johannesburg Hotel', hotel_name: 'Luxuries hotel', buttonText: 'View More' },
    { id: 4, imgSrc: Boutique, imgAlt: 'Pretoria Hotel', hotel_name: 'Orchid hotel', buttonText: 'View More' },
    { id: 5, imgSrc: Luxuries, imgAlt: 'Gqeberha Hotel', hotel_name: 'Brittanica hotel', buttonText: 'View More' },
    { id: 6, imgSrc: images, imgAlt: 'Bloemfontein Hotel', hotel_name: 'Bayside hotel', buttonText: 'View More' },
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
            hotel_name={hotel.hotel_name} 
            buttonText={hotel.buttonText}
            onClick={() => navigate('/guest')}  
          />
        ))}
      </div>
    </div>
  )
}

export default LandingPage;






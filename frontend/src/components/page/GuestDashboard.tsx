// import React, { useState, useEffect } from 'react';
// import styles from './GuetsDashboard.module.css';

// export interface Hotels {
//   id: number;
//   hotel_name: string;
//   address: string;
//   city: string;
//   rating: number;
//   description: string;
//   createdAt_at: Date;
// }

// export type NewHotels = Omit<Hotels, "id">;


//  interface GuestPageProps {
//   hotel: Hotels;
//   mainImage: string;
//   roomImage: string;
//   kitchenImage: string;
// }

// export function GuestDashboard({ hotel, mainImage, roomImage, kitchenImage }: GuestPageProps) {
 
//   const [activeImage, setActiveImage] = useState<string>(mainImage);

 
//   useEffect(() => {
//     setActiveImage(mainImage);
//   }, [hotel.id, mainImage]);

//   return (
//     <div className={styles.detailContainer}>
      
//       <div className={styles.gallerySection}>
//         <div className={styles.mainImageWrapper}>
//           <img src={activeImage} alt={`${hotel.hotel_name} View`} className={styles.mainImg} />
//         </div>
        
       
//         <div className={styles.thumbnailRow}>
//           <img 
//             src={mainImage} 
//             alt="Main View" 
//             className={`${styles.thumbnail} ${activeImage === mainImage ? styles.activeThumb : ''}`}
//             onClick={() => setActiveImage(mainImage)}
//           />
//           <img 
//             src={roomImage} 
//             alt="Room View" 
//             className={`${styles.thumbnail} ${activeImage === roomImage ? styles.activeThumb : ''}`}
//             onClick={() => setActiveImage(roomImage)}
//           />
//           <img 
//             src={kitchenImage} 
//             alt="Kitchen View" 
//             className={`${styles.thumbnail} ${activeImage === kitchenImage ? styles.activeThumb : ''}`}
//             onClick={() => setActiveImage(kitchenImage)}
//           />
//         </div>
//       </div>

   
//       <div className={styles.infoSection}>
//         <h1 className={styles.hotelTitle}>{hotel.hotel_name}</h1>
//         <p className={styles.hotelLocation}>📍 {hotel.address}, {hotel.city}</p>
        
//         <div className={styles.ratingSection}>
//           <span>⭐ {hotel.rating} / 5</span>
//         </div>
        
//         <hr className={styles.divider} />
        
//         <h3 className={styles.sectionTitle}>About the Hotel</h3>
//         <p className={styles.hotelDescription}>{hotel.description}</p>
        
//         <hr className={styles.divider} />
        
//         <h3 className={styles.sectionTitle}>Facilities & Amenities</h3>
//         <ul className={styles.facilitiesGrid}>
//           <li className={styles.facilityItem}><span className={styles.facilityIcon}>✔</span> Free Wi-Fi</li>
//           <li className={styles.facilityItem}><span className={styles.facilityIcon}>✔</span> Swimming Pool</li>
//           <li className={styles.facilityItem}><span className={styles.facilityIcon}>✔</span> Air Conditioning</li>
//           <li className={styles.facilityItem}><span className={styles.facilityIcon}>✔</span> Fully Equipped Kitchen</li>
//         </ul>

//         <div className={styles.bookingFooter}>
//           <div className={styles.priceTag}>
//             <span className={styles.priceAmount}>R1 500</span> / night
//           </div>
//           <button className={styles.bookBtn} type="button">
//             Book Room Now
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// export default GuestDashboard;

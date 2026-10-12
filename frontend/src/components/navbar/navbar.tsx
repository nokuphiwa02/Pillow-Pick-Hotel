import styles from '../navbar/navbar.module.css'
import pillow from '../../assets/pillowPick.png'

const Navbar = () => {
  return (
        <div className={styles.container}>
      <div className={styles.navbarContent}>
     <img src={pillow} alt="pillow" className={styles.icon}/>
      <span className={styles.tittle}>PillowPick </span>
      <a href ="Register" className={styles.regBtn}>Register</a>
        
      <a href="Login" className={styles.lgnbtn}>Login</a>

      </div>
    </div>

  )
};

export default Navbar;

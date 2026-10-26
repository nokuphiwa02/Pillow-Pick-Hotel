import styles from '../navbar/navbar.module.css'
import haven from '../../assets/haven.png'

const Navbar = () => {
  return (
        <div className={styles.container}>
      <div className={styles.navbarContent}>
     <img src={haven} alt="haven" className={styles.icon}/>
      <span className={styles.tittle}>HavenStay </span>
      <a href ="Register" className={styles.regBtn}>Register</a>
        
      <a href="Login" className={styles.lgnbtn}>Login</a>

      </div>
    </div>

  )
};

export default Navbar;

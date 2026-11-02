import styles from '../navbar/navbar.module.css'
import haven from '../../assets/haven.png'
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.navbarContent}>
        <img src={haven} alt="haven" className={styles.icon} />
        <span className={styles.tittle}>HavenStay </span>
        <NavLink to="/register" className={styles.regBtn}>Register </NavLink>
        <NavLink to="/login" className={styles.lgnbtn}>Login </NavLink>


      </div>
    </div>

  )
};

export default Navbar;

// import React from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import styles from "./AdminLayout.module.css";

// const AdminLayout: React.FC = () => {
//   return (
//     <div className={styles.adminLayout}>
//       <aside className={styles.sidebar}>
//         <h2 className={styles.logo}>HavenStay</h2>

//         <p className={styles.sidebarTitle}>ADMIN MENU</p>

//         <nav className={styles.navigation}>
//           <NavLink
//             to="/admin"
//             end
//             className={({ isActive }) =>
//               isActive ? styles.activeLink : styles.navLink
//             }
//           >
//             Dashboard
//           </NavLink>

//           <NavLink
//             to="/admin/accommodation"
//             className={({ isActive }) =>
//               isActive ? styles.activeLink : styles.navLink
//             }
//           >
//             Accommodations
//           </NavLink>

//           <NavLink
//             to="/admin/rooms"
//             className={({ isActive }) =>
//               isActive ? styles.activeLink : styles.navLink
//             }
//           >
//             Rooms
//           </NavLink>

//           <NavLink
//             to="/admin/users"
//             className={({ isActive }) =>
//               isActive ? styles.activeLink : styles.navLink
//             }
//           >
//             Users
//           </NavLink>
//         </nav>

//         <NavLink to="/" className={styles.backLink}>
//           Back to Website
//         </NavLink>
//       </aside>

//       <main className={styles.mainContent}>
//         <header className={styles.topBar}>
//           <h1>Admin Panel</h1>
//           <span>HavenStay Management</span>
//         </header>

//         <section className={styles.pageContent}>
//           <Outlet />
//         </section>
//       </main>
//     </div>
//   );
// };

// export default AdminLayout;
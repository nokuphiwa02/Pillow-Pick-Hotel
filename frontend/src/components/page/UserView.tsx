
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store";
import { fetchUsers, deleteUser } from "../../redux/UserSlice";
import styles from "./UserView.module.css";

const UsersView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [deletingUserId, setDeletingUserId] = useState<number | null>(
    null
  );

  const { users, loading, error } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDeleteUser = async (userId: number, userName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${userName}?`
    );

    if (!confirmed) return;

    try {
      setDeletingUserId(userId);
      await dispatch(deleteUser(userId)).unwrap();
    } catch (err) {
      console.error("Failed to delete user:", err);
      window.alert("Unable to delete this user. Please try again.");
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className={styles.usersPage}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>HAVENSTAY MANAGEMENT</p>
          <h2>Users</h2>
          <p className={styles.subtitle}>
            View and manage registered users on HavenStay.
          </p>
        </div>

        <button
          type="button"
          className={styles.refreshButton}
          onClick={() => dispatch(fetchUsers())}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh Users"}
        </button>
      </div>

      <div className={styles.statsCard}>
        <div className={styles.statsIcon}>♙</div>
        <div>
          <p>Total Users</p>
          <h3>{users.length}</h3>
        </div>
      </div>

      {error && (
        <p className={styles.errorMessage} role="alert">
          {String(error)}
        </p>
      )}

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3>Registered Users</h3>
          <span>{users.length} users</span>
        </div>

        {loading && users.length === 0 ? (
          <p className={styles.statusMessage}>Loading users...</p>
        ) : users.length === 0 ? (
          <p className={styles.statusMessage}>
            No users found.
          </p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.usersTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Date Registered</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td className={styles.userName}>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`${styles.roleBadge} ${
                          user.role === "admin"
                            ? styles.adminRole
                            : styles.guestRole
                        }`}
                      >
                        {user.role || "guest"}
                      </span>
                    </td>
                    <td>
                      {user.createdat
                        ? new Date(user.createdat).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() =>
                          handleDeleteUser(user.id, user.name)
                        }
                        disabled={deletingUserId === user.id}
                      >
                        {deletingUserId === user.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersView;

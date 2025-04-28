import React, { useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import useUserStore from '../../store/userStore';
import './UserList.css';

const UserList = () => {
  const { users, loadUsers, isLoading, error } = useUserStore();

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <Layout>
      <div className="user-list">
        <div className="user-list-header">
          <h1>Users</h1>
        </div>

        {error && (
          <div className="user-list-error">
            Error: {error}
          </div>
        )}

        {isLoading ? (
          <div className="user-list-loading">Loading users...</div>
        ) : users.length > 0 ? (
          <div className="user-list-table-container">
            <table className="user-list-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Borrowed Books</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.borrowedBooks?.length || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="user-list-empty">
            <p>No users found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserList; 
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Pagination, Alert, Spinner, Form, Card } from 'react-bootstrap';
import { getUsers, deleteUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/users.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getUsers(currentPage);
        setUsers(response.data.data);
        setTotalPages(response.data.total_pages);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage, token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
        setSuccess('User deleted');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Delete failed');
      }
    }
  };

  const filteredUsers = users.filter(user => 
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="users-container">
      <div className="users-header">
        <h2>User Management</h2>
        <Button variant="outline-danger" onClick={logout}>Logout</Button>
      </div>

      <div className="search-box">
        <Form.Control
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <div className="users-grid">
            {filteredUsers.map(user => (
              <Card key={user.id} className="user-card">
                <Card.Body className="text-center">
                  <div className="user-avatar">
                    <div className="initials">
                      {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                    </div>
                  </div>
                  <Card.Title className="mt-3">{user.first_name} {user.last_name}</Card.Title>
                  <Card.Text className="text-muted">{user.email}</Card.Text>
                  <div className="user-actions mt-3">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => navigate(`/users/edit/${user.id}`)}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-4 justify-content-center">
              <Pagination.Prev 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)} 
              />
              {[...Array(totalPages).keys()].map(page => (
                <Pagination.Item
                  key={page + 1}
                  active={page + 1 === currentPage}
                  onClick={() => setCurrentPage(page + 1)}
                >
                  {page + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(p => p + 1)} 
              />
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default UserList;
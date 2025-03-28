import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { getUser, updateUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/edit.css';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [user, setUser] = useState({ first_name: '', last_name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    const fetchUser = async () => {
      try {
        const response = await getUser(id);
        setUser(response.data.data);
      } catch (err) {
        setError('Failed to load user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateUser(id, user);
      navigate('/users');
    } catch (err) {
      setError('Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (!token) return null;

  return (
    <div className="edit-user-container">
      <Card className="edit-user-card">
        <Card.Body>
          <Card.Title className="text-center mb-4">Edit User</Card.Title>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={user.first_name}
                  onChange={(e) => setUser({...user, first_name: e.target.value})}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={user.last_name}
                  onChange={(e) => setUser({...user, last_name: e.target.value})}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-between">
                <Button variant="outline-secondary" onClick={() => navigate('/users')}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={updating}>
                  {updating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditUser;
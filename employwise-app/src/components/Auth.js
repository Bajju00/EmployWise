import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import '../styles/auth.css';

const Auth = () => {
  const [email, setEmail] = useState('eve.holt@reqres.in');
  const [password, setPassword] = useState('cityslicka');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (!result.success) setError(result.message);
    setLoading(false);
  };

  

  return (
    <div 
      className="auth-container" 

    >
      <div className="auth-overlay"></div>
      <Container className="auth-box">
        <div className="text-center mb-4">
          
          <h2 className="auth-title">Welcome to EmployWise</h2>
          <p className="auth-subtitle">Sign in to continue</p>
        </div>
        
        {error && <Alert variant="danger" className="auth-alert">{error}</Alert>}
        
        <Form onSubmit={handleSubmit} className="auth-form">
          <Form.Group className="mb-3">
            <Form.Label className="auth-label">Email Address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
              placeholder="eve.holt@reqres.in"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="auth-label">Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
              placeholder="cityslicka"
            />
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading} 
            className="w-100 auth-btn py-2"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Authenticating...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Sign In
              </>
            )}
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default Auth;
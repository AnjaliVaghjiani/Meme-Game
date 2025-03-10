import React, { useState, useContext } from 'react';
import {Alert, Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../API.js';

const LoginPage = ({login}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.login(username, password);
      if (response.success) {
        login(response.user);
        navigate('/profile', {state: {user: response.user}}); 
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Error logging in');
      console.error('Login error:', err);
    }
  };

  return (
    <Container className="login-page">
      <Row className="login-form">
        <Col xs={12} md={8} lg={5} className="login-container p-4 rounded">
          <h2 className="text-center mb-4">Login</h2>
          {error && <p className="text-danger text-center">{error}</p>}
          <Form onSubmit={handleLogin}>
          <Alert
                dismissible
                show={show}
                onClose={() => setShow(false)}
                variant="danger">
                {error}
          </Alert>
            <Form.Group controlId="formUsername">
              <Form.Label className="form-label">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={true}
              />
            </Form.Group>
            <Form.Group controlId="formPassword"  className="form-label">
              <Form.Label  className="form-control">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={true}
                
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="login-button">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  MenuItem,
  Link,
} from '@mui/material';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User'); // Default role
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password,
        role,
      });
      // Handle successful signup
      setSuccess('Signup successful! You can now log in.');
      setError('');
      console.log('Signup successful:', response.data);
      
      // Redirect to login page after successful signup
      navigate('/login'); // Redirect to /login
    } catch (err) {
      // Check if there's a specific error message from the backend
      const errorMessage = err.response?.data?.message || 'Signup failed, please try again.';
      setError(errorMessage);
      console.error('Signup error:', err);
      setSuccess('');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url('https://plus.unsplash.com/premium_photo-1670168251480-e1ad193d7f94?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cm9hZHxlbnwwfHwwfHx8MA==')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white background
          }}
        >
          <Typography variant="h5" component="h1" align="center" gutterBottom>
            Signup
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSignup}>
            <TextField
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
              required
              variant="outlined"
            />

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
              variant="outlined"
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              variant="outlined"
            />

            <TextField
              label="Role"
              select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
            >
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Driver">Driver</MenuItem>
            </TextField>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                mt: 3,
                mb: 2,
                padding: '10px 0',
                fontWeight: 'bold',
              }}
            >
              Signup
            </Button>
          </form>

          {/* Link to Login */}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link href="/login" underline="hover">
              Log in
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup;

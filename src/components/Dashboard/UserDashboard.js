import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Map from '../Layout/Map';
import { FormControl, InputLabel, Select, MenuItem, Button, Typography } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserDashboard = () => {
  const [user, setUser] = useState({});
  const [vehicleType, setVehicleType] = useState('Bike');
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropOffLocation, setDropOffLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setPickupLocation(response.data.location); // Example: { coordinates: [longitude, latitude] }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const handlePickupLocationSelect = (location) => {
    setPickupLocation(location);
    console.log('Selected Pickup Location:', location);
  };

  const handleDropOffLocationSelect = (location) => {
    setDropOffLocation(location);
    console.log('Selected Drop-off Location:', location);
  };

  const handleBookNow = () => {
    if (!pickupLocation || !dropOffLocation) {
      toast.error('Please select both pickup and drop-off locations.');
      return;
    }

    // Validate coordinates are in array format and contain two numeric values
    if (
      !pickupLocation.coordinates || 
      pickupLocation.coordinates.length !== 2 || 
      typeof pickupLocation.coordinates[0] !== 'number' || 
      typeof pickupLocation.coordinates[1] !== 'number' || 
      !dropOffLocation.coordinates || 
      dropOffLocation.coordinates.length !== 2 || 
      typeof dropOffLocation.coordinates[0] !== 'number' || 
      typeof dropOffLocation.coordinates[1] !== 'number'
    ) {
      toast.error('Invalid pickup or drop-off location coordinates.');
      return;
    }

    navigate('/booking', {
      state: {
        vehicleType,
        pickupLocation,
        dropOffLocation,
        userName: user.name,
        userId: user._id,  // Pass userId here
      },
    });
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <nav className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md">
        <Typography variant="h5" className="text-white">
          Welcome, {user.name}
        </Typography>
      </nav>

      <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
        <Typography variant="h6" className="mb-4">Book a Ride</Typography>

        <FormControl variant="outlined" fullWidth className="mb-4">
          <InputLabel>Select Vehicle Type</InputLabel>
          <Select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            label="Select Vehicle Type"
          >
            <MenuItem value="Bike">Bike</MenuItem>
            <MenuItem value="Taxi">Taxi</MenuItem>
            <MenuItem value="Truck">Truck</MenuItem>
          </Select>
        </FormControl>

        <div className="mt-6">
          <Map
            pickupLocation={pickupLocation}
            dropOffLocation={dropOffLocation}
            onSelectPickupLocation={handlePickupLocationSelect}
            onSelectDropOffLocation={handleDropOffLocationSelect}
          />
        </div>

        <Button
          onClick={handleBookNow}
          variant="contained"
          color="primary"
          className="w-full mt-4"
        >
          Book Now
        </Button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default UserDashboard;

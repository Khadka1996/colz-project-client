import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Typography, List, ListItem, ListItemText, Box, Card, CardContent, CircularProgress } from '@mui/material';
import { FaCar } from 'react-icons/fa';
import { RiMotorbikeFill } from 'react-icons/ri';

// Haversine formula to calculate distance between two coordinates
const haversineDistance = (coord1, coord2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (coord2.coordinates[1] - coord1.coordinates[1]) * (Math.PI / 180);
  const dLon = (coord2.coordinates[0] - coord1.coordinates[0]) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.coordinates[1] * (Math.PI / 180)) *
    Math.cos(coord2.coordinates[1] * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Function to calculate the total cost based on distance
const calculateCost = (distance) => {
  const baseFare = 65; // Base fare in NPR
  const costPerKm = 100; // Cost per km in NPR
  return baseFare + costPerKm * distance; // Total cost
};

const Booking = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [costInfo, setCostInfo] = useState({ travelDistance: 0, distanceToDriver: 0 });
  const [isNotifying, setIsNotifying] = useState(false);
  const [acceptanceStatus, setAcceptanceStatus] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const navigate = useNavigate();

  const { state } = useLocation();
  const { vehicleType, pickupLocation, dropOffLocation, userId } = state || {};

  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/drivers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDrivers(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error('Failed to fetch drivers. Please try again.');
      }
    };

    fetchDrivers();
  }, [token]);

  const notifyDriver = async (driverId, bookingData) => {
    const bookingPayload = {
      user: userId,
      driver: driverId,
      fare: bookingData.fare,
      pickupLocation: {
        type: 'Point',
        coordinates: bookingData.pickupLocation.coordinates,
      },
      dropOffLocation: {
        type: 'Point',
        coordinates: bookingData.dropOffLocation.coordinates,
      },
      message: 'A ride has been requested. Please accept the ride.',
    };

    try {
      const response = await fetch(`http://localhost:5000/api/users/book-ride/${driverId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error notifying driver: ${response.statusText}, Response: ${errorText}`);
      }

      setIsNotifying(true);
      checkAcceptanceStatus(driverId); // Check if the driver accepts the ride
    } catch (error) {
      toast.error('Failed to notify driver. Please try again.');
    }
  };

  const handleDriverClick = async (driver) => {
    const travelDistance = haversineDistance(pickupLocation, dropOffLocation);
    const driverLocation = { coordinates: driver.location.coordinates };
    const distanceToDriver = haversineDistance(pickupLocation, driverLocation);

    setCostInfo({ travelDistance, distanceToDriver });
    setSelectedDriver(driver);

    const totalCost = calculateCost(travelDistance);
    toast.info(`Total Cost: NPR ${totalCost.toFixed(2)}`);

    await notifyDriver(driver._id, {
      fare: totalCost,
      pickupLocation,
      dropOffLocation,
    });
  };

  const checkAcceptanceStatus = async (driverId) => {
    setIsAccepting(true);
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/drivers/check-ride-status/${driverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status === 'accepted') {
          setAcceptanceStatus('Accepted by driver');
          clearInterval(interval);
          setIsAccepting(false);
        }
      } catch (error) {
        toast.error('waiting for diver to accept.');
      }
    }, 3000); // Check every 3 seconds
  };

  if (loading) {
    return (
      <div className="text-center mt-8">
        <CircularProgress />
        <p>Loading drivers...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Typography variant="h5" className="mb-4 text-center">Select a Driver</Typography>

      {drivers.length === 0 ? (
        <Typography>No drivers found. Please try again later.</Typography>
      ) : (
        <List>
          {drivers.map((driver) => (
            <ListItem
              key={driver._id}
              onClick={() => !isNotifying && handleDriverClick(driver)}
              className={`mb-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer ${isNotifying ? 'opacity-50' : ''}`}
            >
              <Box className="flex items-center">
                {driver.vehicleType === 'Bike' ? <RiMotorbikeFill className="text-2xl mr-2" /> : <FaCar className="text-2xl mr-2" />}
                <ListItemText
                  primary={`${driver.name} (${driver.vehicleType})`}
                  secondary={`Available: ${driver.isAvailable ? 'Yes' : 'No'}`}
                />
              </Box>
              <Box className="ml-auto">
                <Card variant="outlined" className="bg-gray-100 p-2">
                  <CardContent>
                    <Typography variant="body2" color="textSecondary">
                      Distance to Driver: {costInfo.distanceToDriver.toFixed(2)} km
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Travel Distance: {costInfo.travelDistance.toFixed(2)} km
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Cost: NPR {calculateCost(costInfo.travelDistance).toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </ListItem>
          ))}
        </List>
      )}

      {isAccepting && (
        <div className="text-center mt-4">
          <CircularProgress />
          <p>Waiting for driver acceptance...</p>
        </div>
      )}

      {acceptanceStatus && (
        <Typography variant="h6" color="success.main" className="text-center mt-4">
          {acceptanceStatus}
        </Typography>
      )}

      <ToastContainer />
    </div>
  );
};

export default Booking;

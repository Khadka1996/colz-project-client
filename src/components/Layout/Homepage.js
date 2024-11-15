import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Card, CardContent } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import sampleImage from '../../assets/Manish.jpg'; // Replace with your actual image path
import L from 'leaflet';

// Custom marker icon for leaflet
const customMarker = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [40, 40],
});

const HomePage = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState({ lat: 27.7172, lng: 85.3240 }); // Default location (Kathmandu)
  const [position, setPosition] = useState(null); // Track user position

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (error) => console.error(error)
      );
    }
  }, []);

  // To navigate to login when clicking inputs or buttons
  const handleNavigation = () => {
    navigate('/login');
  };

  // Component to update the map's view based on location
  const UpdateMapView = ({ center }) => {
    const map = useMap();
    map.setView(center, 13);
    return null;
  };

  return (
    <div className="h-[500px] bg-gray-100 text-gray-800">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-gradient-to-r from-[#0C2A50] to-blue-800 text-[#0C2A50] flex items-center justify-center">
        <img
          src="https://plus.unsplash.com/premium_photo-1670168251480-e1ad193d7f94?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cm9hZHxlbnwwfHwwfHx8MA=="
          alt="hero-background"
          className="absolute top-0 left-0 w-full h-full object-cover "
        />
        <div className="relative z-10 text-center space-y-4">
          <img src={sampleImage} alt="Logo" className="h-40 mx-auto mb-4 rounded-full" />
          <Typography variant="h2" className="font-bold mb-2">
            Go Anywhere with Book My Ride
          </Typography>
          <Typography
  variant="body1"
  className=" p-2 rounded-lg"
  sx={{
    color: '#0C2A50',
    backgroundColor: 'rgba(255, 255, 225, 0.5)', // Light blue background for contrast
    boxShadow: 5, // Add some shadow for depth
    fontWeight: 200, // Make the text slightly bolder
    textAlign: 'center', // Center the text
  }}
>
  Request a ride, hop in, and go.
</Typography>


          <Button variant="contained" className="bg-green-500 hover:bg-green-600 text-white" onClick={handleNavigation}>
            See Prices
          </Button>
        </div>
      </div>

      {/* Booking Section with Map inside a Card */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg border border-gray-200">
          <CardContent>
            <Typography variant="h5" className="font-bold text-gray-900 mb-4 text-center">
              Book a Ride
            </Typography>

            <TextField
              label="Pickup Location"
              fullWidth
              InputProps={{
                startAdornment: <LocationOnIcon className="mr-2 text-blue-500" />,
              }}
              onClick={handleNavigation} // Navigate to login when clicked
            />
            <TextField
              label="Dropoff Location"
              fullWidth
              InputProps={{
                startAdornment: <LocationOnIcon className="mr-2 text-blue-500" />,
              }}
              className="mt-4"
              onClick={handleNavigation} // Navigate to login when clicked
            />
            <div className="flex space-x-3 mt-4">
              <TextField
                label="Today"
                fullWidth
                InputProps={{
                  startAdornment: <AccessTimeIcon className="mr-2 text-blue-500" />,
                }}
                onClick={handleNavigation} // Navigate to login when clicked
              />
              <TextField
                label="Now"
                fullWidth
                InputProps={{
                  startAdornment: <AccessTimeIcon className="mr-2 text-blue-500" />,
                }}
                onClick={handleNavigation} // Navigate to login when clicked
              />
            </div>

            {/* Show user's location next to pickup location */}
            {position && (
              <Typography className="mt-4 text-gray-700">
                <LocationOnIcon /> Your Location: {position[0].toFixed(3)}, {position[1].toFixed(3)}
              </Typography>
            )}

            <Button
              variant="contained"
              fullWidth
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 mt-6"
              onClick={handleNavigation}
            >
              See Prices
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg border border-gray-200">
          <CardContent>
            <Typography variant="h5" className="font-bold text-gray-900 mb-4 text-center">
              Your Current Location on Map
            </Typography>
            {/* Map Container */}
            <div className="h-72 w-full">
              <MapContainer center={[location.lat, location.lng]} zoom={13} className="w-full h-full rounded-lg">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {position && <Marker position={position} icon={customMarker} />}
                <UpdateMapView center={location} />
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promotion Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Typography variant="h5" className="font-bold mb-6">
            Drive When You Want, Make What You Need
          </Typography>
          <Typography variant="body1" className="mb-6">
            Make money on your schedule with deliveries or rides—or both.
          </Typography>
          <Button
            variant="contained"
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={handleNavigation} // Navigate to login when clicked
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto text-center">
          <Typography variant="body1">© 2024 Book My Ride. All Rights Reserved.</Typography>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

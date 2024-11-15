import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { MdMyLocation } from 'react-icons/md';
import { Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// Fix for missing marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Map = ({ onSelectPickupLocation, onSelectDropOffLocation, pickupLocation, dropOffLocation }) => {
  const mapRef = useRef();
  const [userLocation, setUserLocation] = useState(null);
  const [isPickupSelected, setIsPickupSelected] = useState(true);
  const routingControlRef = useRef(null); // Reference for the routing control

  // Get user's live location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ coordinates: [longitude, latitude], name: 'Your Location' });
        mapRef.current.setView([latitude, longitude], 13);
      });
    }
  }, []);

  // Update routing when pickup or drop-off location changes
  useEffect(() => {
    if (pickupLocation && dropOffLocation) {
      const start = L.latLng(pickupLocation.coordinates[1], pickupLocation.coordinates[0]);
      const end = L.latLng(dropOffLocation.coordinates[1], dropOffLocation.coordinates[0]);

      // Remove the previous routing control if it exists
      if (routingControlRef.current) {
        routingControlRef.current.remove();
      }

      // Create a new routing control
      routingControlRef.current = L.Routing.control({
        waypoints: [start, end],
        routeWhileDragging: true,
      }).addTo(mapRef.current);
    }
  }, [pickupLocation, dropOffLocation]);

  const handleClick = (e) => {
    const { lat, lng } = e.latlng;
    const location = { coordinates: [lng, lat], name: isPickupSelected ? 'Pickup' : 'Drop-off' };
    if (isPickupSelected) {
      onSelectPickupLocation(location);
    } else {
      onSelectDropOffLocation(location);
    }
    setIsPickupSelected(!isPickupSelected);
  };

  const handleMarkerDragEnd = (event, type) => {
    const { lat, lng } = event.target.getLatLng();
    const location = { coordinates: [lng, lat], name: type };
    if (type === 'Pickup') {
      onSelectPickupLocation(location);
    } else {
      onSelectDropOffLocation(location);
    }
  };

  const LocationMarkers = () => {
    useMapEvents({
      click: handleClick,
    });

    return (
      <>
        {pickupLocation && (
          <Marker
            position={[pickupLocation.coordinates[1], pickupLocation.coordinates[0]]}
            draggable={true}
            eventHandlers={{
              dragend: (e) => handleMarkerDragEnd(e, 'Pickup'),
            }}
            icon={getCustomIcon('blue')}
          >
            <Popup>{pickupLocation.name}</Popup>
          </Marker>
        )}
        {dropOffLocation && (
          <Marker
            position={[dropOffLocation.coordinates[1], dropOffLocation.coordinates[0]]}
            draggable={true}
            eventHandlers={{
              dragend: (e) => handleMarkerDragEnd(e, 'Drop-off'),
            }}
            icon={getCustomIcon('red')}
          >
            <Popup>{dropOffLocation.name}</Popup>
          </Marker>
        )}
        {userLocation && (
          <Marker
            position={[userLocation.coordinates[1], userLocation.coordinates[0]]}
            icon={getCustomIcon('green')}
          >
            <Popup>{userLocation.name}</Popup>
          </Marker>
        )}
      </>
    );
  };

  const getCustomIcon = (color) => {
    return L.divIcon({
      html: `<div style="color:${color}; font-size:24px;"><i class="fas fa-map-marker-alt"></i></div>`,
      iconSize: [24, 24],
      className: 'custom-icon',
    });
  };

  return (
    <div className="relative w-full">
      <MapContainer
        ref={mapRef}
        center={pickupLocation ? [pickupLocation.coordinates[1], pickupLocation.coordinates[0]] : [27.7172, 85.324]} // Default to Kathmandu
        zoom={13}
        style={{ height: '400px', width: '100%' }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarkers />
      </MapContainer>

      {/* Vehicle Type Selection */}
      <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg">
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Vehicle Type</InputLabel>
          <Select
            value={'Bike'}
            onChange={() => {}}
            label="Vehicle Type"
          >
            <MenuItem value="Bike">Bike</MenuItem>
            <MenuItem value="Taxi">Taxi</MenuItem>
            <MenuItem value="Truck">Truck</MenuItem>
          </Select>
        </FormControl>

        {/* Locate Me Button */}
        <Button
          startIcon={<MdMyLocation />}
          variant="contained"
          color="primary"
          onClick={() => {
            if (userLocation) {
              mapRef.current.setView([userLocation.coordinates[1], userLocation.coordinates[0]], 13);
            }
          }}
          className="mt-4"
        >
          Locate Me
        </Button>
      </div>
    </div>
  );
};

export default Map;

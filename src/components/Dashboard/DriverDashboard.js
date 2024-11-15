// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { MapContainer, Marker, TileLayer, Polyline } from 'react-leaflet';
// import L from 'leaflet';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import 'leaflet/dist/leaflet.css';

// const DriverDashboard = () => {
//   const [driver, setDriver] = useState({});
//   const [assignedRides, setAssignedRides] = useState([]);
//   const [earnings, setEarnings] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState('');
//   const [rideTimers, setRideTimers] = useState({});

//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');
//     setToken(storedToken);
//   }, []);

//   useEffect(() => {
//     const fetchDriverProfile = async () => {
//       if (!token) return;

//       try {
//         const response = await axios.get('http://localhost:5000/api/users/profile', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setDriver(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching driver profile:', error.response ? error.response.data : error.message);
//         setLoading(false);
//       }
//     };

//     const fetchAssignedRides = async () => {
//       if (!token) return;

//       try {
//         const response = await axios.get('http://localhost:5000/api/drivers/ride-requests', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAssignedRides(response.data);
//         setRideTimers(response.data.reduce((acc, ride) => {
//           acc[ride._id] = new Date(ride.createdAt);
//           return acc;
//         }, {}));
//       } catch (error) {
//         console.error('Error fetching assigned rides:', error.response ? error.response.data : error.message);
//       }
//     };

//     const fetchEarnings = async () => {
//       if (!token) return;

//       try {
//         const response = await axios.get('http://localhost:5000/api/drivers/earnings', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setEarnings(response.data.totalEarnings);
//       } catch (error) {
//         console.error('Error fetching earnings:', error.response ? error.response.data : error.message);
//       }
//     };

//     fetchDriverProfile();
//     fetchAssignedRides();
//     fetchEarnings();
//   }, [token]);

//   const handleAcceptRide = async (rideId) => {
//     try {
//       await axios.put(`http://localhost:5000/api/drivers/ride-requests/${rideId}/accept`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success('Ride accepted successfully');
//       setAssignedRides((prevRides) =>
//         prevRides.map((ride) => (ride._id === rideId ? { ...ride, status: 'accepted' } : ride))
//       );
//     } catch (error) {
//       toast.error('Failed to accept the ride');
//     }
//   };

//   const handleCancelRide = async (rideId) => {
//     try {
//       await axios.put(`http://localhost:5000/api/drivers/ride-requests/${rideId}/cancel`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success('Ride canceled successfully');
//       setAssignedRides((prevRides) =>
//         prevRides.filter((ride) => ride._id !== rideId)
//       );
//     } catch (error) {
//       toast.error('Failed to cancel the ride');
//     }
//   };

//   const calculateDistance = (pickupLocation, dropOffLocation) => {
//     const latlng1 = L.latLng(pickupLocation.coordinates[1], pickupLocation.coordinates[0]);
//     const latlng2 = L.latLng(dropOffLocation.coordinates[1], dropOffLocation.coordinates[0]);
//     return latlng1.distanceTo(latlng2) / 1000; // in kilometers
//   };

//   const formatTimeElapsed = (startTime) => {
//     const elapsed = Math.floor((Date.now() - startTime) / 1000); // seconds
//     const minutes = Math.floor(elapsed / 60);
//     const seconds = elapsed % 60;
//     return `${minutes}m ${seconds}s`;
//   };

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setRideTimers((prevTimers) => ({
//         ...prevTimers,
//       }));
//     }, 1000); // Update every second

//     return () => clearInterval(timer);
//   }, []);

//   if (loading) {
//     return <div className="text-center mt-8">Loading...</div>;
//   }

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Driver Dashboard</h1>
//       <div className="mb-4">
//         <h2 className="text-xl">Welcome, {driver.name}</h2>
//         <p>Driver ID: {driver._id}</p>
//       </div>
//       <div className="mb-4">
//         <h2 className="text-xl">Total Earnings: ${earnings.toFixed(2)}</h2>
//       </div>
//       <div>
//         <h2 className="text-xl mb-4">Assigned Rides</h2>
//         {assignedRides.length === 0 ? (
//           <p>No assigned rides.</p>
//         ) : (
//           assignedRides.map((ride) => (
//             <div key={ride._id} className="border p-4 mb-4 rounded shadow-lg">
//               <h3 className="font-semibold">Ride ID: {ride._id}</h3>
//               <p>Status: {ride.status}</p>
//               <p>Fare: NRS.{ride.fare?.toFixed(2)}</p>
//               <p>User: {ride.user.name}</p>
//               <p>Distance: {calculateDistance(ride.pickupLocation, ride.dropOffLocation).toFixed(2)} km</p>
//               <p>Time Elapsed: {formatTimeElapsed(rideTimers[ride._id])}</p>
//               <MapContainer
//                 center={[ride.pickupLocation.coordinates[1], ride.pickupLocation.coordinates[0]]}
//                 zoom={13}
//                 className="h-48"
//               >
//                 <TileLayer
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//                 />
//                 <Marker position={[ride.pickupLocation.coordinates[1], ride.pickupLocation.coordinates[0]]} />
//                 <Marker position={[ride.dropOffLocation.coordinates[1], ride.dropOffLocation.coordinates[0]]} />
//                 <Polyline
//                   positions={[
//                     [ride.pickupLocation.coordinates[1], ride.pickupLocation.coordinates[0]],
//                     [ride.dropOffLocation.coordinates[1], ride.dropOffLocation.coordinates[0]],
//                   ]}
//                   color="blue"
//                 />
//               </MapContainer>
//               {ride.status === 'pending' && (
//                 <div className="mt-4 flex space-x-2">
//                   <button
//                     onClick={() => handleAcceptRide(ride._id)}
//                     className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//                   >
//                     Accept Ride
//                   </button>
//                   <button
//                     onClick={() => handleCancelRide(ride._id)}
//                     className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                   >
//                     Cancel Ride
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default DriverDashboard;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, Marker, TileLayer, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';

const DriverDashboard = () => {
  const [driver, setDriver] = useState({});
  const [assignedRides, setAssignedRides] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [rideTimers, setRideTimers] = useState({});

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchDriverProfile = async () => {
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDriver(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching driver profile:', error.response ? error.response.data : error.message);
        setLoading(false);
      }
    };

    const fetchAssignedRides = async () => {
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:5000/api/drivers/ride-requests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter only pending rides and sort them by creation time (newest first)
        const pendingRides = response.data
          .filter(ride => ride.status === 'pending')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setAssignedRides(pendingRides);
        setRideTimers(
          pendingRides.reduce((acc, ride) => {
            acc[ride._id] = new Date(ride.createdAt);
            return acc;
          }, {})
        );
      } catch (error) {
        console.error('Error fetching assigned rides:', error.response ? error.response.data : error.message);
      }
    };

    const fetchEarnings = async () => {
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:5000/api/drivers/earnings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEarnings(response.data.totalEarnings);
      } catch (error) {
        console.error('Error fetching earnings:', error.response ? error.response.data : error.message);
      }
    };

    fetchDriverProfile();
    fetchAssignedRides();
    fetchEarnings();
  }, [token]);

  const handleAcceptRide = async (rideId) => {
    try {
      await axios.put(`http://localhost:5000/api/drivers/ride-requests/${rideId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Ride accepted successfully');
      setAssignedRides((prevRides) =>
        prevRides.filter((ride) => ride._id !== rideId)
      );
    } catch (error) {
      toast.error('Failed to accept the ride');
    }
  };

  const handleCancelRide = async (rideId) => {
    try {
      await axios.put(`http://localhost:5000/api/drivers/ride-requests/${rideId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Ride canceled successfully');
      setAssignedRides((prevRides) =>
        prevRides.filter((ride) => ride._id !== rideId)
      );
    } catch (error) {
      toast.error('Failed to cancel the ride');
    }
  };

  const calculateDistance = (pickupLocation, dropOffLocation) => {
    const latlng1 = L.latLng(pickupLocation.coordinates[1], pickupLocation.coordinates[0]);
    const latlng2 = L.latLng(dropOffLocation.coordinates[1], dropOffLocation.coordinates[0]);
    return latlng1.distanceTo(latlng2) / 1000; // in kilometers
  };

  const formatTimeElapsed = (startTime) => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000); // seconds
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setRideTimers((prevTimers) => ({
        ...prevTimers,
      }));
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Driver Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-xl">Welcome, {driver.name}</h2>
        <p>Driver ID: {driver._id}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl">Total Earnings: ${earnings.toFixed(2)}</h2>
      </div>
      <div>
        <h2 className="text-xl mb-4">Assigned Rides</h2>
        {assignedRides.length === 0 ? (
          <p>No pending rides.</p>
        ) : (
          assignedRides.map((ride) => (
            <div key={ride._id} className="border p-4 mb-4 rounded shadow-lg">
              <h3 className="font-semibold">Ride ID: {ride._id}</h3>
              <p>Status: {ride.status}</p>
              <p>Fare: NRS.{ride.fare?.toFixed(2)}</p>
              <p>User: {ride.user.name}</p>
              <p>Distance: {calculateDistance(ride.pickupLocation, ride.dropOffLocation).toFixed(2)} km</p>
              <p>Time Elapsed: {formatTimeElapsed(rideTimers[ride._id])}</p>
              <MapContainer
                center={[ride.pickupLocation.coordinates[1], ride.pickupLocation.coordinates[0]]}
                zoom={13}
                className="h-48"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[ride.pickupLocation.coordinates[1], ride.pickupLocation.coordinates[0]]} />
                <Marker position={[ride.dropOffLocation.coordinates[1], ride.dropOffLocation.coordinates[0]]} />
                <Polyline
                  positions={[
                    [ride.pickupLocation.coordinates[1], ride.pickupLocation.coordinates[0]],
                    [ride.dropOffLocation.coordinates[1], ride.dropOffLocation.coordinates[0]],
                  ]}
                  color="blue"
                />
              </MapContainer>
              {ride.status === 'pending' && (
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleAcceptRide(ride._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Accept Ride
                  </button>
                  <button
                    onClick={() => handleCancelRide(ride._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Cancel Ride
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;

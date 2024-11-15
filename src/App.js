import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login'; // Adjust the import path if necessary
import Signup from './components/Auth/Signup'; // Adjust the import path if necessary
import DriverDashboard from './components/Dashboard/DriverDashboard';
import UserDashboard from './components/Dashboard/UserDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageDrivers from './pages/Admin/ManageDrivers';
import ViewReports from './pages/Admin/ViewReports';
import ManageVehicles from './pages/Admin/ManageVehicles';
import ViewEarnings from './pages/Admin/ViewEarnings';
import Booking from './components/Dashboard/Booking';
import HomePage from './components/Layout/Homepage';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
        <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/driver/dashboard/" element={<DriverDashboard />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
         <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/drivers" element={<ManageDrivers />} />
        <Route path="/admin/reports" element={<ViewReports />} />
        <Route path="/admin/vehicles" element={<ManageVehicles />} />
        <Route path="/admin/earnings" element={<ViewEarnings />} />
        <Route path="/booking" element={<Booking />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

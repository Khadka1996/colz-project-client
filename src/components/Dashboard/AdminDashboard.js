import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const adminName = "Admin"; // You might replace this with actual admin name from user data

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white min-h-screen">
        <div className="p-4 text-center">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="mt-2">{adminName}</p>
        </div>
        <nav className="mt-6">
          <ul>
            <li className="px-4 py-2 hover:bg-gray-700">
              <Link to="/admin/users">Manage Users</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <Link to="/admin/drivers">Manage Drivers</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <Link to="/admin/reports">View Reports</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <Link to="/admin/vehicles">Manage Vehicles</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <Link to="/admin/earnings">View Earnings</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Welcome to the Admin Dashboard</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <p className="mb-4">
            Here you can manage users, drivers, vehicles, and view reports and earnings.
          </p>
          <ul className="list-disc pl-5">
            <li>
              <Link to="/admin/users" className="text-blue-600 hover:underline">
                Manage Users
              </Link>
            </li>
            <li>
              <Link to="/admin/drivers" className="text-blue-600 hover:underline">
                Manage Drivers
              </Link>
            </li>
            <li>
              <Link to="/admin/reports" className="text-blue-600 hover:underline">
                View Reports
              </Link>
            </li>
            <li>
              <Link to="/admin/vehicles" className="text-blue-600 hover:underline">
                Manage Vehicles
              </Link>
            </li>
            <li>
              <Link to="/admin/earnings" className="text-blue-600 hover:underline">
                View Earnings
              </Link>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

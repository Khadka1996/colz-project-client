import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const ViewAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 0,
    totalDrivers: 0,
    totalRides: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch analytics data from the backend
  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/analytics', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAnalyticsData(response.data);
      setSuccessMessage('Analytics data fetched successfully!');
    } catch (err) {
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Prepare data for the pie chart
  const pieData = [
    { name: 'Total Users', value: analyticsData.totalUsers },
    { name: 'Total Drivers', value: analyticsData.totalDrivers },
    { name: 'Total Rides', value: analyticsData.totalRides },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Typography variant="h4" gutterBottom align="center">Analytics Overview</Typography>

      {loading ? (
        <Typography variant="h6" align="center">Loading...</Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">Total Users</Typography>
                <Typography variant="h4">{analyticsData.totalUsers}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">Total Drivers</Typography>
                <Typography variant="h4">{analyticsData.totalDrivers}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">Total Rides</Typography>
                <Typography variant="h4">{analyticsData.totalRides}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">Total Earnings</Typography>
                <Typography variant="h4">Nrs.{analyticsData.totalEarnings.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" align="center">User Role Distribution</Typography>
          <PieChart width={300} height={300}>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28'][index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" align="center">Analytics Overview</Typography>
          <BarChart width={500} height={300} data={pieData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </Grid>
      </Grid>

      {/* Success Snackbar */}
      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage('')}>
        <Alert onClose={() => setSuccessMessage('')} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ViewAnalytics;

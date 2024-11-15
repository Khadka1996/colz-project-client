import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Button,
  Alert,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ManageDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [newRole, setNewRole] = useState('Driver');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch drivers from the backend
  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/drivers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDrivers(response.data);
    } catch (err) {
      setError('Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  // Handle driver deletion
  const handleDeleteDriver = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/drivers/${selectedDriver._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchDrivers();
      setOpenDeleteDialog(false);
      setSuccessMessage('Driver deleted successfully!');
    } catch (err) {
      setError('Failed to delete driver');
    }
  };

  // Handle driver update
  const handleUpdateDriver = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/drivers/${selectedDriver._id}`, { role: newRole }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchDrivers();
      setOpenUpdateDialog(false);
      setSuccessMessage('Driver updated successfully!');
    } catch (err) {
      setError('Failed to update driver');
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Typography variant="h4" gutterBottom align="center">Manage Drivers</Typography>

      {loading ? (
        <Typography variant="h6" align="center">Loading...</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell><strong>Vehicle</strong></TableCell>
                <TableCell><strong>Vehicle Type</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drivers.map(driver => (
                <TableRow key={driver._id}>
                  <TableCell>{driver.name}</TableCell>
                  <TableCell>{driver.email}</TableCell>
                  <TableCell>{driver.role}</TableCell>
                  <TableCell>{driver.vehicle}</TableCell>
                  <TableCell>{driver.vehicleType}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setSelectedDriver(driver);
                        setNewRole(driver.role);
                        setOpenUpdateDialog(true);
                      }}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedDriver(driver);
                        setOpenDeleteDialog(true);
                      }}
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this driver?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleDeleteDriver} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Update Driver Dialog */}
      <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)}>
        <DialogTitle>Update Driver Role</DialogTitle>
        <DialogContent>
          <Select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            fullWidth
            variant="outlined"
          >
            <MenuItem value="Driver">Driver</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="User">User</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleUpdateDriver} color="primary">Update</Button>
        </DialogActions>
      </Dialog>

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

export default ManageDrivers;

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
  Alert,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('User');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Unauthorized. Please log in again.');
        localStorage.removeItem('token'); // Clear token on 401
      } else {
        setError('Failed to fetch users');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${selectedUser._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
      setOpenDeleteDialog(false);
      setSuccessMessage('User deleted successfully!');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Unauthorized. Please log in again.');
        localStorage.removeItem('token'); // Clear token on 401
      } else {
        setError('Failed to delete user');
      }
    }
  };

  // Handle user update
  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const updateData = { role: newRole };

      // Handle role conversion to Driver
      if (newRole === 'Driver') {
        await axios.put(`http://localhost:5000/api/admin/users/${selectedUser._id}/convert-to-driver`, {
          vehicle: 'Bike', // Default vehicle type
          vehicleType: 'Bike', // Set to "Bike"
          location: 'Kathmandu', // Default location
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.put(`http://localhost:5000/api/admin/users/${selectedUser._id}`, updateData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      fetchUsers();
      setOpenUpdateDialog(false);
      setSuccessMessage('User updated successfully!');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Unauthorized. Please log in again.');
        localStorage.removeItem('token'); // Clear token on 401
      } else {
        setError('Failed to update user');
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        Manage Users
      </Typography>

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
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setSelectedUser(user);
                        setNewRole(user.role);
                        setOpenUpdateDialog(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => {
                        setSelectedUser(user);
                        setOpenDeleteDialog(true);
                      }}
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
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </IconButton>
          <IconButton onClick={handleDeleteUser} color="secondary">
            Delete
          </IconButton>
        </DialogActions>
      </Dialog>

      {/* Update User Dialog */}
      <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)}>
        <DialogTitle>Update User Role</DialogTitle>
        <DialogContent>
          <Select
            label="Role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            fullWidth
            variant="outlined"
          >
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Driver">Driver</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={() => setOpenUpdateDialog(false)} color="primary">
            Cancel
          </IconButton>
          <IconButton onClick={handleUpdateUser} color="primary">
            Update
          </IconButton>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage('')}>
        <Alert onClose={() => setSuccessMessage('')} severity="success" iconMapping={{ success: <CheckCircleIcon /> }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error" iconMapping={{ error: <ErrorIcon /> }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ManageUsers;

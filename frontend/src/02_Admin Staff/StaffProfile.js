// AdminProfile.js
import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import apiClient from '../utils/apiService';
import ResponsiveNavbar from '../Components/Navbar';
import '../Styles/Profile.css'; // Assuming you have a CSS file for styling

const StaffProfile = () => {
  const [userData, setUserData] = useState({
    id: '',
    username: '',
    lname: '',
    fname: '',
    mname: '',
    suffix: '',
    email: '',
    contact_no: '',
    birthdate: '',
  });
  const [passwordData, setPasswordData] = useState({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

  const [loading, setLoading] = useState(true);
  const userId = sessionStorage.getItem('user_id');
  const username = sessionStorage.getItem('username');
  const [alert, setAlert] = useState({ message: '', severity: '', show: false });
  const [fadeOut, setFadeOut] = useState(false);

  // Convert middle name to abbreviated form
  const abbreviateMiddleName = (middleName) => {
  if (!middleName || middleName.trim() === '') return '';
  const trimmed = middleName.trim();
  return `${trimmed.charAt(0).toUpperCase()}.`;
};
  // Password change handler
  const handlePasswordChange = (e) => {
  setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
};
  // Function to handle password update
  const handlePasswordUpdate = async () => {
  const { oldPassword, newPassword, confirmPassword } = passwordData;

  if (!oldPassword || !newPassword || !confirmPassword) {
    setAlert({ message: 'Please fill in all fields.', severity: 'error', show: true });
    return;
  }

  if (newPassword !== confirmPassword) {
    setAlert({ message: 'New passwords do not match.', severity: 'error', show: true });
    return;
  }

  try {
    await apiClient.put(`/users/update-password/${userId}`, {
      oldPassword,
      newPassword,
    });
    setAlert({ message: 'Password updated successfully.', severity: 'success', show: true });
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
  } catch (err) {
    console.error('Failed to update password:', err);
    setAlert({ message: err.response?.data?.message || 'Failed to update password.', severity: 'error', show: true });
  }
};
  const formatDate = (isoDateString) => {
  if (!isoDateString) return '';
  const date = new Date(isoDateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', // use 'long' for full month name, use numeric for numeric month
    day: 'numeric',
  });
};
  const calculateAge = (isoDateString) => {
  if (!isoDateString) return null;
  const birthDate = new Date(isoDateString);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // If birthday hasn’t occurred yet this year, subtract one
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};


  useEffect(() => {
    const fetchUser = async () => {
      
      try {
        const res = await apiClient.get(`/users/profile/${userId}`);
        setUserData(res.data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  useEffect(() => {
    if (alert.show) {
      // Start fade-out after 3.5s
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 3500);

      // Fully hide after fade ends (e.g., 500ms later)
      const hideTimer = setTimeout(() => {
        setAlert({ ...alert, show: false });
        setFadeOut(false); // reset
      }, 4000);
  
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [alert]);

  return (
     <>
      <ResponsiveNavbar username={username} />
        <div className="h-24" />
      <div className="profile-container">
        <h2 className="profile-header">User Profile</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="profile-info">
            {userData.profileImageUrl ? (
              <img 
                src={userData.profileImageUrl} 
                alt="Profile" 
                className="profile-image"
              />
            ) : (
              <div className="no-image-placeholder">
                No Image
              </div>
            )}
            <p><strong>ID:</strong> {userData.id}</p>
            <p><strong>Username:</strong> {userData.username}</p>
            <p><strong>Fullname:</strong> {userData.lname}, {userData.fname} {abbreviateMiddleName(userData.mname)} {userData.suffix}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Contact No:</strong> {userData.contact_no}</p>
            <p><strong>Birthdate:</strong> {formatDate(userData.birthdate)}</p>
            <p><strong>Age:</strong> {calculateAge(userData.birthdate)} years old</p>
          </div>
        )}

        <div className="change-password-section">
          <h3>Change Password</h3>
          <input
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            value={passwordData.oldPassword}
            onChange={handlePasswordChange}
            className="password-input"
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            className="password-input"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            className="password-input"
          />
          <button
            onClick={handlePasswordUpdate}
            className="update-password-button"
          >
            Update Password
          </button>
        </div>
      </div>

      {alert.show && (
        <div className={`fixed top-28 right-4 z-50 transition-opacity duration-500 ${
          fadeOut ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <Alert
            severity={alert.severity}
            onClose={() => setAlert({ ...alert, show: false })}
            variant="filled"
          >
            {alert.message}
          </Alert>
        </div>
      )}
    </>
  );
};

export default StaffProfile;

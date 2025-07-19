import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import ResponsiveNavbar from '../Components/Navbar';
import apiClient from '../utils/apiService';

const StudentProfile = () => {
  const [tab, setTab] = useState('profile');
  const [userData, setUserData] = useState({
    id: '', username: '', fname: '', mname: '', lname: '', suffix: '',
    email: '', contact_no: '', profile_image_url: '', gender: '', birthdate: ''
  });

  const [profileData, setProfileData] = useState({
    parent_fname: '', parent_mname: '', parent_lname: '', parent_suffix: '',
    parent_email: '', parent_contact_no: ''
  });

  const [passwordData, setPasswordData] = useState({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});
  const [newEmail, setNewEmail] = useState({
    email: '',
  });
  const [newContactNo, setNewContactNo] = useState({
    contact_no: '',
  });

  const [alert, setAlert] = useState({ message: '', severity: '', show: false });
  const [fadeOut, setFadeOut] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = sessionStorage.getItem('user_id');
  const username = sessionStorage.getItem('username');

  const abbreviateMiddleName = middle => middle ? `${middle.charAt(0).toUpperCase()}.` : '';

  const formatDate = (isoDateString) => {
    if (!isoDateString) return '';
    const date = new Date(isoDateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    // Function to fetch user data
    const fetchUser = async () => {
      
      try {
        const res = await apiClient.get(`/users/profile/${userId}`);
        setUserData(res.data);
        setNewEmail({ email: res.data.email });
        setNewContactNo({ contact_no: res.data.contact_no });
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    };
    // Function to fetch parent profile data
    const fetchStudentProfile = async () => {
      try {
        const res = await apiClient.get(`/users/profile/student/${userId}`);
        setProfileData(res.data);
      } catch (err) {
        console.error('Failed to fetch student profile:', err);
      }
    };

    if (userId) {
      fetchUser();
      fetchStudentProfile();
    }
  }, [userId]);

  useEffect(() => {
    if (alert.show) {
      const fadeTimer = setTimeout(() => setFadeOut(true), 3500);
      const hideTimer = setTimeout(() => { setAlert({ ...alert, show: false }); setFadeOut(false); }, 4000);
      return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
    }
  }, [alert]);

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
  // Function to handle email update  
  const handleEmailUpdate = async () => {
    const email = newEmail.email;

    // Email format check
    const isValidEmail = /^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email);
    if (!isValidEmail) {
      setAlert({
        message: 'Please enter a valid email address.',
        severity: 'error',
        show: true
      });
      return;
    }

    try {
      await apiClient.put(`/users/update-email/${userId}`, { email });
      setAlert({ message: 'Email updated successfully.', severity: 'success', show: true });
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setAlert({
          message: 'This email is already taken. Please use a different one.',
          severity: 'error',
          show: true
        });
      } else {
        console.error('Failed to update email:', err);
        setAlert({ message: 'Failed to update email.', severity: 'error', show: true });
      }
    }
  };

  // Email change handler
    const handleEmailChange = (e) => {
    setNewEmail({ ...newEmail, [e.target.name]: e.target.value });
  };
  // Function to handle contact number update
  const handleContactNumberUpdate = async () => {
    try {
      await apiClient.put(`/users/update-contact/${userId}`, { contact_no: newContactNo.contact_no });
      setAlert({ message: 'Contact number updated successfully.', severity: 'success', show: true });
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setAlert({
          message: 'This contact number is already taken. Please use a different one.',
          severity: 'error',
          show: true
        });
      } else {
        console.error('Failed to update email:', err);
        setAlert({ message: 'Failed to update contact number.', severity: 'error', show: true });
      }
    }
  };
  // Contact Number Change handler
  const handleContactNumberChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, '');
    setNewContactNo({ ...newContactNo, [name]: numericValue });
  };


  return (
    <>
      <ResponsiveNavbar username={username} />
      <div className="h-24" />
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg font-sans"> 
        <h2 className="text-2xl text-center mb-6 font-bold">
          {tab === 'contact' ? 'Update User Contacts' : tab === 'password' ? 'Change Password': 'Account Profile'}
        </h2>
        <div className="flex border-b border-gray-300 mb-6">
          <div className={`px-5 py-2 cursor-pointer ${tab === 'profile' ? 'border-b-4 border-cyan-500 text-cyan-500 font-semibold' : ''}`} onClick={() => setTab('profile')}>Profile</div>
          <div className={`px-5 py-2 cursor-pointer ${tab === 'contact' ? 'border-b-4 border-cyan-500 text-cyan-500 font-semibold' : ''}`} onClick={() => setTab('contact')}>Update Contacts</div>
          <div className={`px-5 py-2 cursor-pointer ${tab === 'password' ? 'border-b-4 border-cyan-500 text-cyan-500 font-semibold' : ''}`} onClick={() => setTab('password')}>Change Password</div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : tab === 'profile' ? (
          <div className="flex flex-wrap justify-between gap-6">
            <div className="flex-1 min-w-[40%] text-center">
              <img
                src={userData.profile_image_url ? `http://localhost:5000/uploads/${userData.profile_image_url}` : '/default-avatar.png'}
                alt="Profile"
                className="w-[130px] h-[130px] object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold">
                {userData.fname} {abbreviateMiddleName(userData.mname)} {userData.lname} {userData.suffix}
                {userData.gender === "male" && <span title="Male">♂️</span>}
                {userData.gender === "female" && <span title="Female">♀️</span>}
              </h3>
              <h4>
                {userData.id ? `ID: ${userData.id}` : 'No ID available'}
              </h4>
            </div>
            <div className="flex-1 min-w-[55%] space-y-2">
              <p><strong>Username:</strong> {userData.username}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Contact No:</strong> {userData.contact_no}</p>
              <p><strong>Birthdate:</strong> {formatDate(userData.birthdate)}</p>
              <p><strong>Age:</strong> {calculateAge(userData.birthdate)} years old</p>
              <p><strong>Parent Fullname:</strong> {profileData.parent_lname}, {profileData.parent_fname} {abbreviateMiddleName(profileData.parent_mname)} {profileData.parent_suffix}</p>
              <p><strong>Parent Email:</strong> {profileData.parent_email}</p>
              <p><strong>Parent Contact No:</strong> {profileData.parent_contact_no}</p>
            </div>
          </div>
        ) : tab === 'contact' ? (
          <div className="flex flex-wrap gap-6 justify-between">
            {/* New Email */}
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm font-medium text-gray-700">Current Email</label>
              <div className="flex items-center gap-x-4">
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. example@email.com"
                  value={newEmail.email}
                  onChange={handleEmailChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleEmailUpdate}
                  className="w-56 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md whitespace-nowrap"
                >
                  Change Email
                </button>
              </div>
            </div>

            {/* New Contact Number */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Current Contact Number</label>
              <div className="flex items-center gap-x-4">
                <input
                  type="text"
                  name="contact_no"
                  placeholder="e.g. 09123456789"
                  value={newContactNo.contact_no}
                  onChange={handleContactNumberChange}
                  maxLength={11}
                  inputMode="numeric"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleContactNumberUpdate}
                  className="w-56 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md whitespace-nowrap"
                >
                  Change Contact Number
                </button>
              </div>
            </div>
          </div>
        ) : tab === 'password' ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <input
                  type="password"
                  name="oldPassword"
                  placeholder="Old Password"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <button
                onClick={handlePasswordUpdate}
                className="mx-auto block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md"
              >
                Update Password
              </button>              
      </div>
        ) : null}
      </div>

      {alert.show && (
        <div className={`fixed top-28 right-4 z-50 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
          <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, show: false })} variant="filled">
            {alert.message}
          </Alert>
        </div>
      )}
    </>
  );
};

export default StudentProfile;

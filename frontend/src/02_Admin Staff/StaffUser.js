// StaffUserPage.js
import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import apiService from '../utils/apiService';
import ResponsiveNavbar from '../Components/Navbar';
import UserFormModal from '../Components/UserFormModal_Final';
import UserViewModal from '../Components/UserViewModal_Final';
import { format } from 'date-fns';

const StaffUserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [alert, setAlert] = useState({ message: '', severity: '', show: false });
  const [fadeOut, setFadeOut] = useState(false);
  const [formData, setFormData] = useState({
    // Common Fields
    username: '', password: '', account_type: '',
    fname: '', mname: '', lname: '', birthdate: '',
    email: '', contact_no: '', profile_image: null,
    // Student Fields
    parent_fname: '', parent_mname: '', parent_lname: '',
    parent_suffix: '', parent_email: '', parent_contact_no: '',
    // Tutor Fields
    certification: '', teaching_lvl: '', subject: '',
    experiences: '', graduate_at: '', major: '',
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentUsers = users.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(users.length / rowsPerPage);

  const fetchUsers = async () => {
    try {
      // Only fetch students and tutors
      const response = await apiService.get('/users/all');
      const filteredUsers = response.data.filter(
        user => user.account_type === 'student' || user.account_type === 'tutor'
      );
      setUsers(filteredUsers);
    } catch (err) {
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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

  const resetForm = () => {
    setFormData({
      username: '', password: '', account_type: '',
      fname: '', mname: '', lname: '', birthdate: '',
      email: '', contact_no: '', profile_image: null,
      parent_fname: '', parent_mname: '', parent_lname: '',
      parent_suffix: '', parent_email: '', parent_contact_no: '',
      certification: '', teaching_lvl: '', subject: '',
      experiences: '', graduate_at: '', major: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Normalize and trim the input email
    const trimmedEmail = formData.email.trim().toLowerCase();

    // Check for existing email (exclude current user if editing)
    const emailExists = users.some(user =>
      user.email.toLowerCase() === trimmedEmail &&
      (!isEdit || user.id !== formData.id) // allow same email if it's the user being edited
    );

    if (emailExists) {
      setAlert({
        message: 'Email already exists. Please use a different email.',
        severity: 'error',
        show: true,
      });
      return;
    }

    // If password field is blank during edit, don't include it
    if (isEdit && (!formData.password || formData.password.trim() === '')) {
      delete formData.password;
    }

    // Prepare form data
    const form = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        form.append(key, formData[key]);
      }
    }

    try {
    if (isEdit) {
      const response = await apiService.put(`/users/update/${formData.id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updateMsg = response?.data?.message || 'User Updated Successfully.';
      setAlert({ message: updateMsg, severity: 'success', show: true });
    } else {
      const response = await apiService.post('/users/create', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // ✅ Show success message from backend if provided
      const successMsg = response?.data?.message || 'User Created Successfully.';
      setAlert({ message: successMsg, severity: 'success', show: true });
    }

    resetForm();
    setShowForm(false);
    fetchUsers();
    } catch (err) {
    const backendMessage = err?.response?.data?.message || 'Error saving user. Please check input.';
    setAlert({ message: backendMessage, severity: 'error', show: true });
    }
  };

  const handleViewUser = async (user) => {
    let extendedProfile = null;
    try {
      if (user.account_type === 'student') {
        const res = await apiService.get(`/users/profile/student/${user.id}`);
        extendedProfile = res.data;
      } else if (user.account_type === 'tutor') {
        const res = await apiService.get(`/users/profile/tutor/${user.id}`);
        extendedProfile = res.data;
      }
      setSelectedUser({ ...user, extendedProfile });
      setShowViewModal(true);
    } catch {
      setAlert({ message: 'Failed to load user details.', severity: 'error', show: true });
    }
  };

  const handleEditUser = async (user) => {
    let extendedProfile = {};

    try {
      if (user.account_type === 'student') {
        const res = await apiService.get(`/users/profile/student/${user.id}`);
        const { id: parent_profile_id, ...rest } = res.data;
        extendedProfile = { ...rest, parent_profile_id };
      } else if (user.account_type === 'tutor') {
        const res = await apiService.get(`/users/profile/tutor/${user.id}`);
        const { id: tutor_profile_id, ...rest } = res.data;
        extendedProfile = { ...rest, tutor_profile_id };
      }
    } catch (err) {
      console.warn('Failed to fetch extended profile:', err);
    }

    const formattedBirthdate = user.birthdate
      ? format(new Date(user.birthdate), 'yyyy-MM-dd')
      : '';

    setFormData({
      ...user,
      ...extendedProfile,
      birthdate: formattedBirthdate,
      profile_image: user.profile_image_url || '',
    });

    setIsEdit(true);
    setShowForm(true);
  };

  return (
    <>
      <ResponsiveNavbar />
      <div className="h-24" />
      <div className="items-center justify-center flex flex-col">
        <div className="p-4 flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Student & Tutor Management</h2>

          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : users.length === 0 ? (
            <p>No users found.</p>
          ) : (
          <>
          <div className="flex gap-4 mb-4">
          <button
            onClick={() => { resetForm(); setIsEdit(false); setShowForm(true); }}
            className="bg-blue-600 text-white text-base w-48 h-12 rounded-md hover:bg-blue-700 mb-4"
          >
            Create User Account
          </button>
          </div>

          {showForm && (
            <UserFormModal
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onClose={() => setShowForm(false)}
              isEdit={isEdit}
            />
          )}

          {showViewModal && selectedUser && (
            <UserViewModal
              user={selectedUser}
              onClose={() => setShowViewModal(false)}
            />
          )}

            <div className="mb-4">
              <label htmlFor="rowsPerPage" className="mr-2 font-medium">Rows per page:</label>
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded px-2 py-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
            </div>
            {/* User Table List */}
            <table className="table-auto border-collapse border border-gray-300 max-w-4xl w-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Username</th>
                  <th className="border px-4 py-2 w-64">Account Type</th>
                  <th className="border px-4 py-2 w-80">Name</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{user.id}</td>
                    <td className="border px-4 py-2">{user.username}</td>
                    <td className="border px-4 py-2 capitalize">{user.account_type}</td>
                    <td className="border px-4 py-2"> {`${user.lname}, ${user.fname} `} </td>
                    <td className="border px-4 py-2">
                      <div className="flex">
                        <button onClick={() => handleViewUser(user)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">View</button>
                        <button onClick={() => handleEditUser(user)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 ml-2"
                              >
                                Edit
                              </button>
                            </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>    
          </> 
          )}
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

export default StaffUserPage;
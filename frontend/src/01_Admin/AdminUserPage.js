// AdminUserPage.js
import React, { useEffect, useState } from 'react';
import apiService from '../utils/apiService';
import ResponsiveNavbar from '../Components/Navbar';
import UserFormModal from '../Components/UserFormModal_Final';
import UserViewModal from '../Components/UserViewModal_Final';
import { format } from 'date-fns';

const AdminUserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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
    credentials: '', graduate_at: '', major: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentUsers = users.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(users.length / rowsPerPage);



  const fetchUsers = async () => {
    try {
      const response = await apiService.get('/users/all');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setFormData({
      username: '', password: '', account_type: '',
      fname: '', mname: '', lname: '', birthdate: '',
      email: '', contact_no: '', profile_image: null,
      parent_fname: '', parent_mname: '', parent_lname: '',
      parent_suffix: '', parent_email: '', parent_contact_no: '',
      certification: '', teaching_lvl: '', subject: '',
      credentials: '', graduate_at: '', major: '',
    });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        form.append(key, formData[key]);
      }
    }

    try {
      if (isEdit) {
        await apiService.put(`/users/update/${formData.id}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('User updated successfully.');
      } else {
        await apiService.post('/users/create', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('User created successfully.');
      }
      resetForm();
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      alert('Error saving user. Please check input.');
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
      alert('Failed to load user details.');
    }
  };

const handleEditUser = async (user) => {
  let extendedProfile = {};

  try {
    if (user.account_type === 'student') {
      const res = await apiService.get(`/users/profile/student/${user.id}`);
      const { id: student_profile_id, ...rest } = res.data;
      extendedProfile = { ...rest, student_profile_id }; // ✅ renamed id
    } else if (user.account_type === 'tutor') {
      const res = await apiService.get(`/users/profile/tutor/${user.id}`);
      const { id: tutor_profile_id, ...rest } = res.data;
      extendedProfile = { ...rest, tutor_profile_id }; // ✅ renamed id
    }
    // console.log('Extended Profile:', extendedProfile);
  } catch (err) {
    console.warn('Failed to fetch extended profile:', err);
  }

  const formattedBirthdate = user.birthdate
    ? format(new Date(user.birthdate), 'yyyy-MM-dd')
    : '';

  setFormData({
    ...user, // user.id stays intact
    ...extendedProfile, // renamed id won't overwrite
    birthdate: formattedBirthdate,
    profile_image: user.profile_image_url || '',
  });

  setIsEdit(true);
  setShowForm(true);
};

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };


  return (
    <>
      <ResponsiveNavbar />
      <div className="h-24" />
      <div className="items-center justify-center flex flex-col">
      <div className="p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">User Management</h2>

          <button
            onClick={() => { resetForm(); setIsEdit(false); setShowForm(true); }}
            className="bg-blue-600 text-white text-base w-48 h-12 rounded-md hover:bg-blue-700 mb-4"
          >
            Create User Account
          </button>


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

          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : users.length === 0 ? (
            <p>No users found.</p>
          ) : (
          <>
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
                              <button 
                                onClick={() => handleDelete(user)} 
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-6"
                              >
                                Delete
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

      {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-md w-96">
              <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
              <p className="mb-4">Are you sure you want to delete this user?</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      await apiService.put(`/users/delete/${selectedUser.id}`);
                      alert('User deleted successfully.');
                      // Refresh user list after deletion 
                      fetchUsers();
                      setShowDeleteModal(false);
                    } catch (err) {
                      alert('Failed to delete user. Please try again.');
                      setShowDeleteModal(false);
                    }
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default AdminUserPage;

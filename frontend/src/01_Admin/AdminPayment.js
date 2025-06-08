import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import apiService from '../utils/apiService';
import ResponsiveNavbar from '../Components/Navbar';

const AdminApplicationManagementPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', severity: '', show: false });
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

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

  const fetchApplications = async () => {
    try {
      const res = await apiService.get('/applications/all-submitted');
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await apiService.put(`/applications/approve/${id}`); // Your backend handles expiration logic
      setAlert({ message: 'Application approved.', severity: 'success', show: true });
      fetchApplications(); // refresh list
    } catch {
      setAlert({ message: 'Failed to approve application.', severity: 'error', show: true });
    }
  };

  const handleReject = async (id) => {
    try {
      await apiService.put(`/applications/reject/${id}`);
        setAlert({ message: 'Application rejected.', severity: 'success', show: true });
      fetchApplications();
    } catch {
      setAlert({ message: 'Failed to reject application.', severity: 'error', show: true });
    }
  };

  const viewPaymentProof = (filename) => {
    window.open(`http://localhost:5000/uploads/payment_proofs/${filename}`, '_blank');
  };

  return (
  <>
  <ResponsiveNavbar />
  <div className="h-24" />
  <div className="max-w-7xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6 text-center">Package Applications</h1>

    {loading ? (
      <p>Loading applications...</p>
    ) : applications.length === 0 ? (
      <p>No submitted applications to review.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th> N0. </th>
              <th className="border px-4 py-2">Student</th>
              <th className="border px-4 py-2">Package</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Tutor</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="border px-4 py-3">{app.id}</td>
                <td className="border px-4 py-3">{app.student_fname} {app.student_lname}</td>
                <td className="border px-4 py-3">{app.package_name}</td>
                <td className="border px-4 py-3">₱{app.price_package}</td>
                <td className="border px-4 py-3">{app.tutor_fname} {app.tutor_lname} </td>
                <td className="border px-4 py-3 capitalize">{app.application_status}</td>
                <td className="border px-4 py-3">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center">
                    {app.payment_proof && (
                      <button
                        onClick={() => viewPaymentProof(app.payment_proof)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                      >
                        View Proof
                      </button>
                    )}
                    <button
                      onClick={() => handleApprove(app.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(app.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
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

export default AdminApplicationManagementPage;

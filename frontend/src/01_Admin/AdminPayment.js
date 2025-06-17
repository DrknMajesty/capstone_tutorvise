import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import apiService from '../utils/apiService';
import ResponsiveNavbar from '../Components/Navbar';

const AdminApplicationManagementPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', severity: '', show: false });
  const [fadeOut, setFadeOut] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    if (alert.show) {
      const fadeTimer = setTimeout(() => setFadeOut(true), 3500);
      const hideTimer = setTimeout(() => {
        setAlert({ ...alert, show: false });
        setFadeOut(false);
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
      setError('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await apiService.put(`/applications/approve/${id}`);
      setAlert({ message: 'Application approved.', severity: 'success', show: true });
      fetchApplications();
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

  const calculateTotalPrice = (price_package, total_sessions, price_sessions) => {
    const totalPrice = parseFloat(price_package || 0) + (parseInt(total_sessions || 0) * parseFloat(price_sessions || 0));
    return parseFloat(totalPrice.toFixed(2));
  };

  const formatCurrency = (amount) => `₱${amount.toFixed(2)}`;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = applications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(applications.length / itemsPerPage);

  return (
    <>
      <ResponsiveNavbar />
      <div className="h-24" />
      <div className="items-center justify-center flex flex-col">
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Student Applications</h1>

          {loading ? (
            <p>Loading applications...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : applications.length === 0 ? (
            <p>No applications to review.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-gray-300">
                  <thead className="bg-gray-100 text-left">
                    <tr>
                      <th className="border px-4 py-2">No.</th>
                      <th className="border px-4 py-2">Student</th>
                      <th className="border px-4 py-2">Package</th>
                      <th className="border px-4 py-2">Tutor</th>
                      <th className="border px-4 py-2">Status</th>
                      <th className="border px-4 py-2">Date Paid</th>
                      <th className="border px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="border px-4 py-3">{app.id}</td>
                        <td className="border px-4 py-3">{app.student_fname} {app.student_lname}</td>
                        <Tooltip
                          title={
                            <>
                              <div>📦 Package: {app.package_name}</div>
                              <div>💰 Package Price: ₱{app.price_package}</div>
                              <div>💰 Price/Session: ₱{app.price_sessions}</div>
                              <div>📅 Total Sessions: {app.total_sessions}</div>
                              <div>🧾 Total Fee: {formatCurrency(calculateTotalPrice(app.price_package, app.total_sessions, app.price_sessions))}</div>
                            </>
                          }
                          arrow
                          placement="top"
                        >
                          <td className="border px-4 py-3 cursor-help text-blue-700 hover:underline">
                            {app.package_name}
                          </td>
                        </Tooltip>
                        <td className="border px-4 py-3">{app.tutor_fname} {app.tutor_lname}</td>
                        <td className="border px-4 py-3 capitalize">{app.application_status}</td>
                        <td className="border px-4 py-3">{new Date(app.submitted_at).toLocaleString()}</td>
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
                            {app.application_status === 'submitted' && (
                              <>
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
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center mt-4 gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {alert.show && (
        <div className={`fixed top-28 right-4 z-50 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
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

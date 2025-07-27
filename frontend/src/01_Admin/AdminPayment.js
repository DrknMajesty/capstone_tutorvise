import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import apiService from '../utils/apiService';
import ResponsiveNavbar from '../Components/Navbar';

const AdminApplicationManagementPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', severity: '', show: false });
  const [fadeOut, setFadeOut] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [visiblePaymentAppId, setVisiblePaymentAppId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const itemsPerPage = 4;

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

  useEffect(() => {
    setCurrentPage(1);
    }, [searchTerm, statusFilter]);

  const fetchApplications = async () => {
    try {
      const res = await apiService.get('/applications/all-submitted');
      setApplications(res.data);
      console.log('Fetched applications:', res.data);
    } catch (err) {
      setError('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePayments = (appId) => {
    setVisiblePaymentAppId((prev) => (prev === appId ? null : appId));
  };

    const [showModal, setShowModal] = useState(false);
    const [proofUrl, setProofUrl] = useState('');

    const openModal = (url) => {
    setProofUrl(url);
    setShowModal(true);
    };

    const closeModal = () => {
    setShowModal(false);
    setProofUrl('');
    };

const handleConfirmPayment = async (paymentId) => {
  try {
    const res = await apiService.post(`/applications/payments/${paymentId}/action`, { 
      action: 'confirm'
    });
    if (res.status === 200) {
      setAlert({ message: 'Payment confirmed successfully.', severity: 'success', show: true });
      fetchApplications(); // Refresh data
    }
  } catch (err) {
    console.error(err);
    setAlert({ message: 'Payment Confirmatino Failed.', severity: 'error', show: true });
  }
};

const handleRejectPayment = async (paymentId) => {
  try {
    const res = await apiService.post(`/applications/payments/${paymentId}/action`, {
      action: 'reject'
    });
    if (res.status === 200) {
      setAlert({ type: 'warning', message: res.data.message || 'Payment rejected successfully.' });
      fetchApplications(); // Refresh data
    }
  } catch (err) {
    console.error(err);
    setAlert({ type: 'error', message: 'Payment rejection failed.', show: true });
  }
};

  const formatCurrency = (amount_paid) => `₱${Number(amount_paid).toFixed(2)}`;

  const formatTimeRange = (startTime, endTime) => {
    const toLocalTime = (timeStr) => {
      if (!timeStr) return 'Invalid time';
      const today = new Date().toISOString().split('T')[0]; // e.g., "2025-07-23"
      const dateObj = new Date(`${today}T${timeStr}`);
      return isNaN(dateObj.getTime())
        ? 'Invalid time'
        : dateObj.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });
    };

    return `${toLocalTime(startTime)} - ${toLocalTime(endTime)}`;
  };

    const filteredApplications = applications.filter((app) => {
    const fullName = `${app.student_fname} ${app.student_lname}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? app.application_status === statusFilter : true;
    return matchesSearch && matchesStatus;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentApplications = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  return (
    <>
      <ResponsiveNavbar />
      <div className="h-24" />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Student Payment Approvals</h1>

        {loading ? (
          <p>Loading applications...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : applications.length === 0 ? (
          <p>No applications to review.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <input
                    type="text"
                    placeholder="Search by student name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border px-3 py-2 rounded-md w-full sm:w-64"
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border px-3 py-2 rounded-md w-full sm:w-48"
                >
                    <option value="">All Statuses</option>
                    <option value="submitted">Submitted</option>
                    <option value="approved">Approved</option>
                    <option value="done">Done</option>
                </select>
            </div>
            {currentApplications.map((app) => (
              <div key={app.id} className="border rounded-md shadow-sm">
                <button
                  onClick={() => handleTogglePayments(app.id)}
                  className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 flex justify-between items-center"
                >
                  <div>
                    <h2 className="text-lg font-semibold"> Application # {app.id} {app.student_fname} {app.student_lname}</h2>
                    <p className="text-sm text-gray-600">
                      Package: {app.package_name} | Tutor: {app.tutor_fname} {app.tutor_lname} | Time: {formatTimeRange(app.snapshot_start_time, app.snapshot_end_time)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Submitted: {new Date(app.created_at).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit', hour12: true})} | Payment Due: {new Date(app.payment_due_date).toLocaleString()}
                    </p>
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded capitalize ${
                    app.application_status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                    app.application_status === 'partially_paid' ? 'bg-orange-100 text-orange-800' :
                    app.application_status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {app.application_status.replace('_', ' ')}
                  </span>
                </button>

                {visiblePaymentAppId === app.id && (
                  <div className="p-4 bg-white border-t space-y-4">                      
{app.payments.length > 0 ? (
  app.payments.map((payment, index) => (
    <div key={payment.id} className="border p-4 mb-3 rounded bg-gray-50 shadow-sm">
      <div className="flex flex-wrap justify-between items-center gap-y-2 text-sm text-gray-700">

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="font-medium text-gray-900">
            {app.paymentType === 'full'
              ? 'Full Payment'
              : index === 0
              ? 'Initial Payment'
              : 'Final Payment'}
          </div>

          <div>Date Paid: {new Date(payment.payment_date).toLocaleString()}</div>

          <div>Amount: {formatCurrency(payment.amount_paid)}</div>

          <div>
            <button
                onClick={() => openModal(`http://localhost:5000/uploads/payment_proofs/${payment.payment_proof}`)}
                className="text-blue-600 underline text-sm hover:text-blue-800"
            >
                View Payment Proof
            </button>
          </div>

          <div className="font-medium">
            Status:{' '}
            <span className={payment.is_confirmed ? 'text-green-600' : 'text-red-600'}>
              {payment.is_confirmed ? 'Confirmed' : 'Not Confirmed'}
            </span>
          </div>
        </div>

        {!payment.is_confirmed && (
          <div className="flex gap-x-2 mt-2 ml-auto">
            <button
              onClick={() => handleConfirmPayment(payment.id)}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Confirm
            </button>
            <button
              onClick={() => handleRejectPayment(payment.id)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  ))
) : (
  <p className="text-sm text-gray-500">No payment uploaded.</p>
)}
                  </div>
                )}
              </div>
            ))}

            {/* Pagination */}
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
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-3xl w-full relative">
            <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
            >
                &times;
            </button>
            <div className="p-4 max-h-[80vh] overflow-auto">
                {proofUrl.endsWith('.pdf') ? (
                <iframe
                    src={proofUrl}
                    title="Payment Proof PDF"
                    className="w-full h-[70vh]"
                ></iframe>
                ) : (
                <img
                    src={proofUrl}
                    alt="Payment Proof"
                    className="w-full max-h-[70vh] object-contain"
                />
                )}
            </div>
            </div>
        </div>
        )}

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

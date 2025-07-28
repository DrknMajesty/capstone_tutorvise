import React, { useEffect, useState, useCallback } from 'react';
import Alert from '@mui/material/Alert';
import apiService from '../utils/apiService';
import BookingList from '../Components/BookingList';
import ResponsiveNavbar from '../Components/Navbar';

const StudentBookingPage2 = () => {
  const studentId = sessionStorage.getItem('user_id');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({
    message: '',
    severity: '',
    show: false
  });
  const [fadeOut, setFadeOut] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const [selectedAppId, setSelectedAppId] = useState('');
  const [preservedAppId, setPreservedAppId] = useState('');

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.get(`/bookings/students/${studentId}/bookings`);
      setBookings(res.data || []);
    } catch (err) {
      console.error('Failed to fetch student bookings:', err);
      setError('Failed to fetch your bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  const handleCancelClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBookingId) return;

    try {
      await apiService.patch(`/bookings/${selectedBookingId}/cancel`);
      setBookings(prev =>
        prev.map(booking =>
          booking.booking_id === selectedBookingId
            ? { ...booking, booking_status: 'cancelled' }
            : booking
        )
      );
      setAlert({
        message: 'Booking successfully cancelled.',
        severity: 'success',
        show: true
      });
    } catch (err) {
      console.error('Cancel booking failed:', err);
      setAlert({
        message: err.response?.data?.message || 'Failed to cancel booking. Please try again.',
        severity: 'error',
        show: true
      });
    } finally {
      setCancelModalOpen(false);
      setSelectedBookingId(null);
    }
  };

  useEffect(() => {
    if (alert.show) {
      const fadeTimer = setTimeout(() => setFadeOut(true), 3500);
      const hideTimer = setTimeout(() => {
        setAlert(prev => ({ ...prev, show: false }));
        setFadeOut(false);
      }, 4000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [alert]);

  useEffect(() => {
    if (studentId) {
      fetchBookings();
    } else {
      setError('Student ID not found. Please log in again.');
    }
  }, [studentId, fetchBookings]);

  useEffect(() => {
    if (selectedAppId) {
      setPreservedAppId(selectedAppId);
    }
  }, [selectedAppId]);

  useEffect(() => {
    if (preservedAppId && bookings.some(b => String(b.application_id) === preservedAppId)) {
      setSelectedAppId(preservedAppId);
    } else {
      setSelectedAppId('');
    }
  }, [bookings, preservedAppId]);

  return (
    <>
      <ResponsiveNavbar />
      <div className="h-24" />

      <div className="items-center justify-center flex flex-col">
        <div className="max-w-6xl mx-auto mt-10 p-4 w-full">
          {loading && (
            <p className="text-center text-gray-600">Loading your bookings...</p>
          )}
          {error && (
            <p className="text-center text-red-600">{error}</p>
          )}
          {!loading && !error && (
            <BookingList
              bookings={bookings}
              onCancel={handleCancelClick}
              title="My Bookings"
              role="student"
              selectedAppId={selectedAppId}
              setSelectedAppId={setSelectedAppId}
            />
          )}
        </div>

        {alert.show && (
          <div className={`fixed top-28 right-4 z-50 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
            <Alert
              severity={alert.severity}
              onClose={() => setAlert(prev => ({ ...prev, show: false }))}
              variant="filled"
            >
              {alert.message}
            </Alert>
          </div>
        )}

        {/* Tailwind Cancel Confirmation Modal */}
        {cancelModalOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Confirm Cancellation</h2>
              <p className="text-sm text-gray-700 mb-4">Are you sure you want to cancel this booking?</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setCancelModalOpen(false)}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                >
                  No, Keep Booking
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Yes, Cancel Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentBookingPage2;

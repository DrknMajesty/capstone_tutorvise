import React, { useEffect, useState, useCallback } from 'react';
import Alert from '@mui/material/Alert';
import apiService from '../utils/apiService';
import BookingList from '../Components/BookingList';
import ResponsiveNavbar from '../Components/Navbar';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const TutorBookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ message: '', severity: '', show: false });
  const [fadeOut, setFadeOut] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedAppId, setSelectedAppId] = useState('');

  const tutorId = sessionStorage.getItem('user_id');

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.get(`/bookings/tutors/${tutorId}/bookings`);
      const bookingsData = res.data || [];

      setBookings(current => {
        const hasChanged = JSON.stringify(current) !== JSON.stringify(bookingsData);
        return hasChanged ? bookingsData : current;
      });
    } catch (err) {
      console.error('Error fetching tutor bookings:', err);
      setError('Failed to fetch tutor bookings.');
    } finally {
      setLoading(false);
    }
  }, [tutorId]);

const handleAccept = async (bookingId) => {
  try {
    await apiService.put(`/bookings/${bookingId}/confirm`);
    setBookings(prev => prev.map(b =>
      b.booking_id === bookingId
        ? { ...b, booking_status: 'accepted' }
        : b
    ));
    setAlert({ message: 'Booking accepted', severity: 'success', show: true });
  } catch (err) {
    console.error('Error accepting booking:', err);
    
    const status = err.response?.status;
    const msg = err.response?.data?.error || 'Failed to accept booking.';

    if (status === 409) {
      setAlert({
        message: 'Booked schedule overlaps with existing schedules. Please cancel the booking.',
        severity: 'warning',
        show: true
      });
    } else {
      setAlert({
        message: msg,
        severity: 'error',
        show: true
      });
    }
  }
};

  const handleCancelClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBookingId || !cancelReason) return;

    try {
      await apiService.put(`/bookings/tutors/${selectedBookingId}/cancel`, {
        cancel_reason: cancelReason
      });

      setBookings(prev => prev.map(b =>
        b.booking_id === selectedBookingId
          ? { ...b, booking_status: 'cancelled', cancel_reason: cancelReason }
          : b
      ));

      setAlert({
        message: `Booking cancelled. Reason: ${cancelReason}`,
        severity: 'info',
        show: true
      });
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setAlert({
        message: err.response?.data?.message || 'Failed to cancel booking.',
        severity: 'error',
        show: true
      });
    } finally {
      setCancelModalOpen(false);
      setCancelReason('');
      setSelectedBookingId(null);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

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

  return (
    <>
      <ResponsiveNavbar />
      <div className="h-24" />
      <div className="items-center justify-center flex flex-col">
        <div className="max-w-6xl mx-auto mt-10 p-4 w-full">
          {loading && <p className="text-center text-gray-600">Loading bookings...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
          {!loading && !error && (
            <BookingList
              bookings={bookings}
              onAccept={handleAccept}
              onCancel={handleCancelClick}
              title="Student Bookings"
              role="tutor"
              selectedAppId={selectedAppId}
              setSelectedAppId={setSelectedAppId}
            />
          )}
        </div>
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

      <Modal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        aria-labelledby="cancel-booking-modal"
        aria-describedby="cancel-booking-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          <h2 className="text-xl font-bold mb-4">Cancel Booking</h2>
          <div className="mb-4">
            <label htmlFor="cancel-reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason for cancellation
            </label>
            <select
              id="cancel-reason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select a reason</option>
              <option value="sick leave">Sick Leave</option>
              <option value="unavailable">Unavailable</option>
              <option value="conflict">Personal Schedule Conflict</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outlined" onClick={() => setCancelModalOpen(false)}>
              Back
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCancelConfirm}
              disabled={!cancelReason}
            >
              Confirm Cancellation
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default TutorBookingPage;

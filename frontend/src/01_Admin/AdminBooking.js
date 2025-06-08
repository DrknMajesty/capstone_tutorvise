import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import apiService from '../utils/apiService';
import BookingList from '../Components/BookingList';
import ResponsiveNavbar from '../Components/Navbar';

const AdminBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ message: '', severity: '', show: false });
  const [fadeOut, setFadeOut] = useState(false);

    const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
        const res = await apiService.get('/bookings/all-bookings');
        const bookingsData = res.data || [];
        setBookings(bookingsData);
        console.log('Fetched bookings:', bookingsData); // 🔍 Debug log
    } catch (err) {
        setError('Failed to fetch bookings.');
    } finally {
        setLoading(false);
    }
    };


  const handleAccept = async (bookingId) => {
    try {
      await apiService.put(`/bookings/${bookingId}/confirm`);
      setAlert({ message: 'Booking Accepted.', severity: 'success', show: true });
      fetchBookings();
    } catch (err) {
      setAlert({ message: 'Failed to accept booking.', severity: 'error', show: true });
    }
  };

  useEffect(() => {
    fetchBookings();
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

  return (
    <>
      <ResponsiveNavbar />
      <div className="h-24" /> {/* Spacer Div */}
      <div className="items-center justify-center flex flex-col">
        <div className="max-w-6xl mx-auto mt-10 p-4 w-full">
          {loading && <p className="text-center text-gray-600">Loading bookings...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
          {!loading && !error && (
            <BookingList
              bookings={bookings}
              onAccept={handleAccept}
              title="All Bookings"
              role="admin" // ← must be exactly this
            />
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

export default AdminBooking;

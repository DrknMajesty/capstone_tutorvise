import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import apiService from '../utils/apiService';
import BookingList from '../Components/BookingList';
import ResponsiveNavbar from '../Components/Navbar';

const StudentBookingPage2 = () => {
  const studentId = sessionStorage.getItem('user_id'); // or get from auth context
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ message: '', severity: '', show: false });
  const [fadeOut, setFadeOut] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.get(`/bookings/students/${studentId}/bookings`);
      setBookings(res.data || []);
      console.log('Student bookings fetched:', res.data);
    } catch (err) {
      console.error('Failed to fetch student bookings:', err);
      setError('Failed to fetch your bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    const confirm = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirm) return;

    try {
      await apiService.patch(`/bookings/${bookingId}/cancel`);
      setAlert({ message: 'Booking Cancelled.', severity: 'success', show: true });
      fetchBookings();
    } catch (err) {
      console.error('Cancel booking failed:', err);
      setAlert({ message: 'Failed to cancel booking.', severity: 'error', show: true });
    }
  };

    useEffect(() => {
    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
        const res = await apiService.get(`/bookings/students/${studentId}/bookings`);
        setBookings(res.data || []);
        console.log('Student bookings fetched:', res.data);
        } catch (err) {
        console.error('Failed to fetch student bookings:', err);
        setError('Failed to fetch your bookings.');
        } finally {
        setLoading(false);
        }
    };

    if (studentId) {
        fetchBookings();
    } else {
        setError('Student ID not found. Please log in.');
    }
    }, [studentId]);

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
      <div className="h-24" />
      <div className="items-center justify-center flex flex-col">
        <div className="max-w-6xl mx-auto mt-10 p-4 w-full">
          {loading && <p className="text-center text-gray-600">Loading your bookings...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
          {!loading && !error && (
            <BookingList
              bookings={bookings}
              onCancel={handleCancel}
              title="My Bookings"
              role="student"
            />
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
      </div>
    </>
  );
};

export default StudentBookingPage2;

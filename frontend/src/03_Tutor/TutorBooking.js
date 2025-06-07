import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import apiService from '../utils/apiService';
import BookingList from '../Components/BookingList';
import ResponsiveNavbar from '../Components/Navbar';

const TutorBookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ message: '', severity: '', show: false });
  const [fadeOut, setFadeOut] = useState(false);

  const tutorId = sessionStorage.getItem('user_id');

  const handleAccept = async (bookingId) => {
    try {
      await apiService.post(`/bookings/${bookingId}/accept`);
      setAlert({ message: 'Booking accepted successfully.', severity: 'success', show: true });
      // Re-fetch bookings after accepting
      if (tutorId) {
        const res = await apiService.get(`/bookings/tutors/${tutorId}/bookings`);
        setBookings(res.data || []);
      }
    } catch (err) {
      console.error('Error accepting booking:', err);
      setAlert({ message: 'Failed to accept booking.', severity: 'error', show: true });
    }
  };

  useEffect(() => {
    console.log('useEffect triggered, tutorId:', tutorId);

    const fetchBookings = async () => {
      console.log('Fetching bookings...');
      setLoading(true);
      setError(null);
      try {
        const res = await apiService.get(`/bookings/tutors/${tutorId}/bookings`);
        const bookingsData = res.data || [];
        console.log('Data received from API:', res.data);
        setBookings(bookingsData);
        console.log('Fetched tutor bookings:', bookingsData);
      } catch (err) {
        console.error('Error fetching tutor bookings:', err);
        setError('Failed to fetch tutor bookings.');
      } finally {
        setLoading(false);
        console.log('Fetching bookings finished');
      }
    };

    if (tutorId) {
      fetchBookings();
    } else {
      console.log('No tutorId provided, skipping fetch');
    }
  }, [tutorId]);

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
      <div className="h-24" /> {/* Spacer */}
      <div className="items-center justify-center flex flex-col">
        <div className="max-w-6xl mx-auto mt-10 p-4 w-full">
          {loading && <p className="text-center text-gray-600">Loading bookings...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
          {!loading && !error && (
            <BookingList bookings={bookings} onAccept={handleAccept} title="Student Bookings" />
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

export default TutorBookingPage;

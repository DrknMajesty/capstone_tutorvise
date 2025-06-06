import React, { useEffect, useState } from 'react';
import apiService from '../utils/apiService';
import BookingList from '../Components/BookingList';
import ResponsiveNavbar from '../Components/Navbar';

const AdminBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      await apiService.post(`/bookings/accept/${bookingId}`);
      alert('Booking accepted.');
      fetchBookings();
    } catch (err) {
      alert('Failed to accept booking.');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <>
      <ResponsiveNavbar />
      <div className="h-24" /> {/* Spacer Div */}
      <div className="items-center justify-center flex flex-col">
        <div className="max-w-6xl mx-auto mt-10 p-4 w-full">
          {loading && <p className="text-center text-gray-600">Loading bookings...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
          {!loading && !error && (
            <BookingList bookings={bookings} onAccept={handleAccept} title="Pending Bookings" />
          )}
        </div>
      </div>
    </>
  );
};

export default AdminBooking;

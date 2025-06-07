import React, { useEffect, useState } from 'react';
import apiService from '../utils/apiService';
import BookingList from '../Components/BookingList';
import ResponsiveNavbar from '../Components/Navbar';

const StudentBookingPage2 = () => {
  const studentId = sessionStorage.getItem('user_id'); // or get from auth context
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      alert('Booking cancelled.');
      fetchBookings();
    } catch (err) {
      console.error('Cancel booking failed:', err);
      alert('Failed to cancel booking.');
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
      </div>
    </>
  );
};

export default StudentBookingPage2;

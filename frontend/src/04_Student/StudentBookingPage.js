import React, { useEffect, useState } from 'react';
import ResponsiveNavbar from '../Components/Navbar';
import apiService from '../utils/apiService';

const StudentBookingPage = () => {
  const [packages, setPackages] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await apiService.get('/bookings/avail-packages');
      setPackages(res.data);
    } catch {
      alert('Failed to fetch packages.');
    }
  };

  const fetchTutors = async () => {
    try {
      const res = await apiService.get('/users/active-tutors');
      setTutors(res.data);
    } catch {
      alert('Failed to fetch tutors.');
    }
  };

  const fetchTimeslots = async (tutorId) => {
    try {
      console.log("Fetched Tutor ID:", tutorId);
      const res = await apiService.get(`/bookings/book-timeslots/${tutorId}`);
      console.log("Data", res.data);
      setTimeslots(res.data);
    } catch (err) {
      console.error('Error fetching timeslots:', err);
      alert('Failed to fetch timeslots.');
    }
  };

  const handleApplyClick = async (pkg) => {
    setSelectedPackage(pkg);
    setShowModal(true);
    setSelectedTutor(null);
    setSelectedSlot('');
    await fetchTutors();
  };

  const handleTutorChange = async (e) => {
    const tutor = tutors.find(t => t.id === parseInt(e.target.value));
    setSelectedTutor(tutor);
    if (tutor) {
      await fetchTimeslots(tutor.id);
    }
  };

  const handleBookingSubmit = async () => {
    if (!selectedTutor || !selectedSlot) {
      return alert('Please select a tutor and timeslot.');
    }

    try {
      await apiService.post('/bookings/apply', {
        package_id: selectedPackage.id,
        tutor_id: selectedTutor.id,
        timeslot_id: selectedSlot
      });
      alert('Booking submitted. Please wait for admin approval.');
      setShowModal(false);
    } catch {
      alert('Failed to submit booking.');
    }
  };

  const formatTime12h = (time) => {
    if (!time) return '';
    const [hourStr, minute] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  return (
    <>
      <ResponsiveNavbar />
      <div className="h-24" />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Book a Tutorial Service</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="border rounded-lg p-5 shadow">
              <h3 className="text-xl font-semibold mb-2">{pkg.package_name}</h3>
              <p><strong>Price:</strong> ₱{pkg.price_package}</p>
              <p><strong>Sessions:</strong> {pkg.total_sessions}</p>
              <p><strong>Session Price:</strong> ₱{pkg.price_sessions}</p>
              <p><strong>Type:</strong> {pkg.tutorial_type}</p>
              <p className="text-sm text-gray-600 mt-2">{pkg.description}</p>
              <button
                onClick={() => handleApplyClick(pkg)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 text-xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-4">Apply for: {selectedPackage?.package_name}</h2>

            <div className="mb-4">
              <label className="block font-medium mb-1">Select Tutor</label>
              <select
                value={selectedTutor?.id || ''}
                onChange={handleTutorChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">-- Select Tutor --</option>
                {tutors.map((tutor) => (
                  <option key={tutor.id} value={tutor.id}>
                    {tutor.fname} {tutor.lname}
                  </option>
                ))}
              </select>
            </div>

            {selectedTutor && (
              <div className="border rounded p-4 mb-4 bg-gray-50 flex items-center gap-4">
                {selectedTutor.profile_image_url && (
                  <img
                    src={`http://localhost:5000/uploads/${selectedTutor.profile_image_url}`}
                    alt="Profile"
                    className="w-20 h-20 object-cover rounded-full border"
                  />
                )}
                <div>
                  <p><strong>Name:</strong> {selectedTutor.fname} {selectedTutor.lname}</p>
                  {selectedTutor.certification && <p><strong>Certification:</strong> {selectedTutor.certification}</p>}
                  {selectedTutor.subject && <p><strong>Subject:</strong> {selectedTutor.subject}</p>}
                  {selectedTutor.teaching_lvl && <p><strong>Level:</strong> {selectedTutor.teaching_lvl}</p>}
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block font-medium mb-1">Select Timeslot</label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">-- Select Timeslot --</option>
                {timeslots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {formatTime12h(slot.start_time)} - {formatTime12h(slot.end_time)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleBookingSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Submit Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentBookingPage;

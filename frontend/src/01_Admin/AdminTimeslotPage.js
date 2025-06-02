
import React, { useEffect, useState } from 'react';
import ResponsiveNavbar from '../Components/Navbar';
import FloatingField from '../Components/FloatingFields';
import apiService from '../utils/apiService';

const AdminTimeslotPage = () => {
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState('');
  const [formData, setFormData] = useState({
    start_time: '',
    end_time: '',
    status: 'Available'
  });
  const [timeslots, setTimeslots] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(null);

  useEffect(() => {
    fetchTutors();
  }, []);

  useEffect(() => {
    if (selectedTutor) fetchTimeslots(selectedTutor);
    else setTimeslots([]);
  }, [selectedTutor]);

  const fetchTutors = async () => {
    try {
      const res = await apiService.get('/users/active-tutors');
      setTutors(res.data);
    } catch {
      alert('Failed to fetch tutors');
    }
  };

  const fetchTimeslots = async (tutorId) => {
    try {
      const res = await apiService.get(`/timeslots/available-slots/${tutorId}`);
      setTimeslots(res.data);
    } catch {
      alert('Failed to fetch timeslots');
    }
  };

  const generateEndTimeFromStartTime = (startTime) => {
    if (!startTime) return '';
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes);

    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // add 1 hour

    const endHours = String(endDate.getHours()).padStart(2, '0');
    const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
    return `${endHours}:${endMinutes}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'start_time') {
      const generatedEnd = generateEndTimeFromStartTime(value);
      setFormData((prev) => ({
        ...prev,
        start_time: value,
        end_time: generatedEnd,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTutorChange = (e) => {
    setSelectedTutor(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTutor) return alert('Please select a tutor');

    // Check for overlapping time in frontend
    const overlap = timeslots.some((slot) => {
      return (
        (formData.start_time < slot.end_time) &&
        (formData.end_time > slot.start_time)
      );
    });

    if (overlap) return alert('Time conflict detected. Please adjust the time.');

    try {
      await apiService.post('/timeslots/create', {
        tutor_id: selectedTutor,
        ...formData
      });
      setFormData({ start_time: '', end_time: '', status: 'Available' });
      fetchTimeslots(selectedTutor);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create timeslot.');
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.delete(`/timeslots/delete/${slotToDelete}`);
      setShowDeleteConfirm(false);
      fetchTimeslots(selectedTutor);
    } catch {
      alert('Failed to delete timeslot.');
    }
  };

  const formatTime12h = (time24) => {
    if (!time24) return '';
    const [hourStr, minute] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const tutorOptions = [
    { value: '', label: 'Select Tutor' },
    ...tutors.map((tutor) => ({
      value: tutor.id,
      label: `${tutor.fname} ${tutor.mname || ''} ${tutor.lname}`,
    })),
  ];

    const handleToggleStatus = async (slot) => {
    const newStatus = slot.status === 'Available' ? 'Unavailable' : 'Available';

    try {
      await apiService.put(`/timeslots/update-status/${slot.id}`, {
        status: newStatus,
      });
      fetchTimeslots(selectedTutor);
    } catch (err) {
      alert('Failed to update timeslot status');
    }
  };

  return (
    <>
      <ResponsiveNavbar />
      <div className="h-24" />
      <div className="items-center justify-center flex flex-col w-full max-w-4xl mx-auto">
        <div className="p-6 font-sans w-full">
          <h1 className='text-2xl font-bold mb-6'>Timeslot Management</h1>
          <FloatingField
            type="select"
            id="selected_tutor"
            name="selected_tutor"
            label="Select Tutor"
            value={selectedTutor}
            onChange={handleTutorChange}
            required
            options={tutorOptions}
          />
        </div>

        {selectedTutor && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full px-6 mb-6">
            <FloatingField
                         type="time"
                         name="start_time"
                         id="start_time"
                         label="Start Time"
                         value={formData.start_time}
                         onChange={handleChange}
                         required
                       />
                       <FloatingField
                         type="time"
                         name="end_time"
                         id="end_time"
                         label="End Time"
                         value={formData.end_time}
                         onChange={handleChange}
                         required
                       />
                       <FloatingField
                         type="select"
                         name="status"
                         id="status"
                         label="Status"
                         value={formData.status}
                         onChange={handleChange}
                         required
                         options={[
                           { value: 'Available', label: 'Available' },
                           { value: 'Unavailable', label: 'Unavailable' },
                         ]}
                       />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Timeslot</button>
          </form>
        )}

        {timeslots.length > 0 ? (
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Start Time</th>
                <th className="border px-4 py-2">End Time</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {timeslots.map((slot, index) => (
                <tr key={slot.id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{formatTime12h(slot.start_time)}</td>
                  <td className="border px-4 py-2">{formatTime12h(slot.end_time)}</td>
                  <td className="border px-4 py-2 w-40 whitespace-nowrap text-center">{slot.status}</td>
                  <td className="border px-4 py-2 text-center">
                    {(slot.status === 'Available' || slot.status === 'Unavailable') && (
                      <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(true);
                            setSlotToDelete(slot.id);
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleToggleStatus(slot)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Update Status
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : selectedTutor ? (
          <p className="text-gray-500 mt-4">No timeslots found for this tutor.</p>
        ) : null}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this timeslot?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setShowDeleteConfirm(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
              <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminTimeslotPage;

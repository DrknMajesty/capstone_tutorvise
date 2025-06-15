import React, { useEffect, useState } from 'react';
import ResponsiveNavbar from '../Components/Navbar';
import apiService from '../utils/apiService';

const AdminReportPage = () => {
  const username = sessionStorage.getItem('username') || '';
  const [ratingsData, setRatingsData] = useState([]);
  const [selectedTutorId, setSelectedTutorId] = useState('');
  const [tutorFeedback, setTutorFeedback] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState('ratings');

  useEffect(() => {
    fetchRatings();
  }, []);

  useEffect(() => {
    if (selectedTutorId) {
      fetchTutorFeedback(selectedTutorId);
    } else {
      setTutorFeedback([]);
    }
  }, [selectedTutorId]);

  const fetchRatings = async () => {
    try {
      const res = await apiService.get('/reports/tutor-ratings');
      const sorted = res.data.sort((a, b) => b.average_rating - a.average_rating);
      console.log("Data:", res.data)
      setRatingsData(sorted);
    } catch (err) {
      console.error('Failed to fetch tutor ratings report:', err);
    }
  };

  const fetchTutorFeedback = async (tutorId) => {
    try {
      const res = await apiService.get(`/reports/tutor-feedback/${tutorId}`);
      setTutorFeedback(res.data);
    } catch (err) {
      console.error('Failed to fetch tutor feedback:', err);
    }
  };

  const fetchFilteredRatings = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start', startDate);
      if (endDate) params.append('end', endDate);

      const res = await apiService.get(`/reports/tutor-ratings?${params.toString()}`);
      const sorted = res.data.sort((a, b) => b.average_rating - a.average_rating);
      setRatingsData(sorted);
    } catch (err) {
      console.error('Failed to fetch filtered tutor ratings:', err);
    }
  };

  return (
    <div>
      <ResponsiveNavbar username={username} />
      <div className="h-24" />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Generate Report</h1>

        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('ratings')}
              className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium ${activeTab === 'ratings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Tutor Ratings
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium ${activeTab === 'comments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Tutor Comments
            </button>
            <button
              onClick={() => setActiveTab('finance')}
              className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium ${activeTab === 'finance' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Financial Report
            </button>
          </nav>
        </div>

        {activeTab === 'ratings' && (
          <>
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 px-3 py-1 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 px-3 py-1 rounded"
                />
              </div>
              <div className="mt-4 md:mt-6">
                <button
                  onClick={fetchFilteredRatings}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Filter Ratings
                </button>
              </div>
            </div>

            {ratingsData.length === 0 ? (
              <p className="text-gray-500">No ratings data available.</p>
            ) : (
              <div className="overflow-x-auto mb-8">
                <table className="min-w-full table-auto border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Rank</th>
                      <th className="border px-4 py-2 text-left">Tutor Name</th>
                      <th className="border px-4 py-2 text-left">Average Rating</th>
                      <th className="border px-4 py-2 text-left">Total Ratings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratingsData.map((tutor, index) => (
                      <tr key={tutor.tutor_id} className="hover:bg-gray-50">
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{tutor.name}</td>
                        <td className="border px-4 py-2">{Number(tutor.average_rating).toFixed(2)}</td>
                        <td className="border px-4 py-2">{tutor.rating_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === 'comments' && (
          <>
            <div className="mb-6">
              <label className="block mb-2 font-medium">Select a Tutor to View Feedback:</label>
              <select
                value={selectedTutorId}
                onChange={(e) => setSelectedTutorId(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
              >
                <option value="">-- Select Tutor --</option>
                {ratingsData.map(tutor => (
                  <option key={tutor.tutor_id} value={tutor.tutor_id}>{tutor.name}</option>
                ))}
              </select>
            </div>

            {selectedTutorId && tutorFeedback.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Confirmed Sessions Feedback</h2>
                <table className="min-w-full table-auto border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Date</th>
                      <th className="border px-4 py-2 text-left">Time</th>
                      <th className="border px-4 py-2 text-left">Rating</th>
                      <th className="border px-4 py-2 text-left">Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tutorFeedback.map((fb, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="border px-4 py-2">{new Date(fb.scheduled_date).toLocaleDateString()}</td>
                        <td className="border px-4 py-2">
                          {new Date(`1970-01-01T${fb.start_time}`).toLocaleTimeString([], {
                            hour: '2-digit', minute: '2-digit', hour12: true,
                          })} - {new Date(`1970-01-01T${fb.end_time}`).toLocaleTimeString([], {
                            hour: '2-digit', minute: '2-digit', hour12: true,
                          })}
                        </td>
                        <td className="border px-4 py-2">
                      <div className="flex text-yellow-500 text-sm">
                        {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                      </div>
                    </td>
                        <td className="border px-4 py-2 italic text-gray-700">{fb.comment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminReportPage;

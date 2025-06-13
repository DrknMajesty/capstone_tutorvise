import React, { useEffect, useState } from 'react';
import ResponsiveNavbar from '../Components/Navbar';
import apiService from '../utils/apiService';

const StudentPayment = () => {
  const username = sessionStorage.getItem('username') || '';
  const user_id = parseInt(sessionStorage.getItem('user_id'), 10);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAppId, setSelectedAppId] = useState('');
  const [view, setView] = useState('applications'); // 'applications' or 'ledger'

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await apiService.get(`/applications/${user_id}/my-applications`);
        const sorted = response.data.sort(
          (a, b) => new Date(b.submitted_at || b.created_at) - new Date(a.submitted_at || a.created_at)
        );
        setApplications(sorted);
        if (sorted.length > 0) setSelectedAppId(sorted[0].id);
      } catch (err) {
        setError('Failed to fetch applications.');
      }

      setLoading(false);
    };

    fetchApplications();
  }, [user_id]);

  const selectedApplication = applications.find((app) => app.id === selectedAppId);

  return (
    <div>
      <ResponsiveNavbar username={username} />
      <div className="h-24" />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {view === 'applications' ? 'Student Applications' : 'Student Ledger'}
          </h1>
          <div className="space-x-2">
            <button
              onClick={() => setView('applications')}
              className={`px-4 py-2 rounded ${
                view === 'applications' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setView('ledger')}
              className={`px-4 py-2 rounded ${
                view === 'ledger' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              Ledger
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading applications...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <>
            {view === 'applications' && (
              <>
                {/* Dropdown Selector */}
                <div className="mb-6">
                  <label className="block text-lg font-medium mb-2">Select an Application:</label>
                  <select
                    value={selectedAppId}
                    onChange={(e) => setSelectedAppId(e.target.value)}
                    className="w-full md:w-1/2 p-2 border border-gray-300 rounded"
                  >
                    {applications.map((app) => (
                      <option key={app.id} value={app.id}>
                        ID #{app.id} - {new Date(app.submitted_at || app.created_at).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Application Details */}
                {selectedApplication && (
                  <div className="bg-white shadow rounded-lg p-6 border">
                    <p className="mb-2"><strong>Package:</strong> {selectedApplication.package_name}</p>
                    <p className="mb-2"><strong>Total Sessions:</strong> {selectedApplication.total_sessions}</p>
                    <p className="mb-2"><strong>Price per Session:</strong> ₱{selectedApplication.price_sessions}</p>
                    <p className="mb-2"><strong>Total Package Price:</strong> ₱{selectedApplication.price_package}</p>
                    <p className="mb-2">
                      <strong>Status:</strong>{' '}
                      <span className={`px-2 py-1 rounded text-white ${
                        selectedApplication.status === 'Approved' ? 'bg-green-500'
                        : selectedApplication.status === 'Pending' ? 'bg-yellow-500'
                        : 'bg-red-500'
                      }`}>
                        {selectedApplication.status}
                      </span>
                    </p>
                    <p className="mb-2">
                      <strong>Submitted At:</strong>{' '}
                      {new Date(selectedApplication.submitted_at || selectedApplication.created_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </>
            )}
{view === 'ledger' && (
  <div className="bg-white shadow rounded-lg p-6 border">
    <h2 className="text-2xl font-semibold mb-4">Student Ledger</h2>

    <table className="w-full border text-sm">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="px-4 py-2">Date</th>
          <th className="px-4 py-2">Reference</th>
          <th className="px-4 py-2">Description</th>
          <th className="px-4 py-2">Type</th>
          <th className="px-4 py-2">Amount (₱)</th>
        </tr>
      </thead>
      <tbody>
        {applications
          .flatMap((app) => {
            const entries = [
              {
                id: `debit-${app.id}`,
                date: app.submitted_at || app.created_at,
                reference: `APP#${app.id}`,
                description: `Tuition Fee for ${app.package_name}`,
                type: 'Debit',
                amount: parseFloat(app.price_package),
              }
            ];

            if (app.paid_amount) {
              entries.push({
                id: `credit-${app.id}`,
                date: app.paid_at,
                reference: app.reference || `PAY#${app.id}`,
                description: `Full Payment for ${app.package_name}`,
                type: 'Credit',
                amount: parseFloat(app.paid_amount),
              });
            }

            return entries;
          })
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((entry) => (
            <tr key={entry.id} className="border-t">
              <td className="px-4 py-2">{new Date(entry.date).toLocaleDateString()}</td>
              <td className="px-4 py-2">{entry.reference}</td>
              <td className="px-4 py-2">{entry.description}</td>
              <td className={`px-4 py-2 font-medium ${entry.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                {entry.type}
              </td>
              <td className="px-4 py-2">₱{entry.amount.toFixed(2)}</td>
            </tr>
          ))}

        {/* Totals */}
        <tr className="border-t font-bold bg-gray-50">
          <td colSpan="4" className="px-4 py-2 text-right">Total Debits</td>
          <td className="px-4 py-2 text-red-600">
            ₱{applications.reduce((sum, app) => sum + parseFloat(app.price_package || 0), 0).toFixed(2)}
          </td>
        </tr>
        <tr className="border-t font-bold bg-gray-50">
          <td colSpan="4" className="px-4 py-2 text-right">Total Credits</td>
          <td className="px-4 py-2 text-green-600">
            ₱{applications.reduce((sum, app) => sum + parseFloat(app.paid_amount || 0), 0).toFixed(2)}
          </td>
        </tr>
        <tr className="border-t font-bold bg-yellow-50">
          <td colSpan="4" className="px-4 py-2 text-right">Balance</td>
          <td className="px-4 py-2 text-black">
            ₱{(
              applications.reduce((sum, app) => sum + parseFloat(app.price_package || 0), 0) -
              applications.reduce((sum, app) => sum + parseFloat(app.paid_amount || 0), 0)
            ).toFixed(2)}
          </td>
        </tr>
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

export default StudentPayment;

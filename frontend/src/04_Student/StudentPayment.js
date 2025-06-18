import React, { useEffect, useState } from 'react';
import ResponsiveNavbar from '../Components/Navbar';
import apiService from '../utils/apiService';

const StudentPayment = () => {
  const username = sessionStorage.getItem('username') || '';
  const user_id = parseInt(sessionStorage.getItem('user_id'), 10);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [view, setView] = useState('applications'); // 'applications' or 'ledger'

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await apiService.get(`/applications/${user_id}/my-applications`);
        console.log("Applications Data:", response);
        const sorted = response.data.sort(
          (a, b) => new Date(b.submitted_at || b.created_at) - new Date(a.submitted_at || a.created_at)
        );
        setApplications(sorted);
        if (sorted.length > 0 && (!selectedAppId || !sorted.some(app => app.id === selectedAppId))) {
          setSelectedAppId(sorted[0].id);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError('Failed to fetch applications.');
      }

      setLoading(false);
    };

    fetchApplications();
  }, [user_id, selectedAppId]);

  const selectedApplication = applications.find((app) => app.id === (selectedAppId || applications[0]?.id));

  const calculateTotalPrice = (price_package, total_sessions, price_sessions) => {
    const totalPrice = parseFloat(price_package || 0) + (parseInt(total_sessions || 0) * parseFloat(price_sessions || 0));
    return parseFloat(totalPrice.toFixed(2));
  };

  const formatCurrency = (amount) => {
    const num = Number(amount);
    if (isNaN(num)) return '';
    return `₱${num.toFixed(2)}`;
  };

  console.log('Current State:', {
    selectedAppId,
    applications,
    selectedApplication
  });

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
                    value={selectedAppId || ''}
                    onChange={(e) => setSelectedAppId(Number(e.target.value))}
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
                    <h2 className="text-xl font-bold mb-4">Application Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="mb-2"><strong>Application ID:</strong> #{selectedApplication.id}</p>
                        <p className="mb-2"><strong>Package:</strong> {selectedApplication.package_name}</p>
                        <p className="mb-2"><strong>Total Sessions:</strong> {selectedApplication.total_sessions}</p>
                        <p className="mb-2"><strong>Price per Session:</strong> {formatCurrency(selectedApplication.price_sessions)}</p>
                      </div>
                      <div>
                        <p className="mb-2"><strong>Package Price:</strong> {formatCurrency(selectedApplication.price_package)}</p>
                        <p className="mb-2"><strong>Total Price:</strong> {formatCurrency(calculateTotalPrice(
                          selectedApplication.price_package, 
                          selectedApplication.total_sessions, 
                          selectedApplication.price_sessions)
                        )}</p>
                        <p className="mb-2">
                          <strong>Submitted At:</strong>{' '}
                          {new Date(selectedApplication.submitted_at || selectedApplication.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {view === 'ledger' && (
              <div className="bg-white shadow rounded-lg p-6 border">
                <h2 className="text-xl font-bold mb-4">Payment Ledger</h2>
                <table className="w-full border text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Reference</th>
                      <th className="px-4 py-2">Description</th>
                      <th className="px-4 py-2">Debit (₱)</th>
                      <th className="px-4 py-2">Credit (₱)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications
                      .flatMap((app) => {
                        const totalAmount = calculateTotalPrice(app.price_package, app.total_sessions, app.price_sessions);
                        const total = totalAmount > 0 ? formatCurrency(totalAmount) : '';

                        const entries = [
                          {
                            id: `debit-${app.id}`,
                            date: app.submitted_at || app.created_at,
                            reference: `APP#${app.id}`,
                            description: `Fee for ${app.package_name}`,
                            debit: total,
                            credit: ''
                          }
                        ];

                        if (parseFloat(app.paid_amount) > 0) {
                          entries.push({
                            id: `credit-${app.id}`,
                            date: app.payment_date,
                            reference: app.reference || `PAY#${app.id}`,
                            description: `Payment for ${app.package_name}`,
                            debit: '',
                            credit: formatCurrency(app.paid_amount)
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
                          <td className="px-4 py-2 text-red-600">{entry.debit}</td>
                          <td className="px-4 py-2 text-green-600">{entry.credit}</td>
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

export default StudentPayment;
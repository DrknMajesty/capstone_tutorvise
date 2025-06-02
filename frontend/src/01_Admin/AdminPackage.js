import React, { useEffect, useState } from 'react';
import apiService from '../utils/apiService';
import ResponsiveNavbar from '../Components/Navbar';
import FloatingField from '../Components/FloatingFields';

const AdminPackage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('create');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingPackage, setViewingPackage] = useState(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState({ id: null, package_name: '' });

  const [formData, setFormData] = useState({
    package_name: '',
    price_package: '',
    total_sessions: '',
    price_sessions: '',
    tutorial_type: '',
    description: '',
    status: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await apiService.get('/packages/all-packages');
      setPackages(response.data || []);
    } catch (err) {
      setError('Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      package_name: '',
      price_package: '',
      total_sessions: '',
      price_sessions: '',
      tutorial_type: '',
      description: '',
      status: ''
    });
    setEditingId(null);
    setMode('create');
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiService.post('/packages/create-package', formData);
      if (res.status !== 200) throw new Error('Failed to create package');
      alert('Package created successfully!');
      resetForm();
      fetchPackages();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleEdit = (pkg) => {
    setFormData({
      package_name: pkg.package_name,
      price_package: pkg.price_package,
      total_sessions: pkg.total_sessions,
      price_sessions: pkg.price_sessions,
      tutorial_type: pkg.tutorial_type,
      description: pkg.description || '',
      status: pkg.status
    });
    setEditingId(pkg.id);
    setMode('edit');
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await apiService.put(`/packages/update-package/${editingId}`, formData);
      if (res.status !== 200) throw new Error('Failed to update package');
      alert('Package updated successfully!');
      resetForm();
      fetchPackages();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const calculateTotalPrice = (price_package, total_sessions, price_sessions) => {
    const totalPrice = parseFloat(price_package || 0) + (parseInt(total_sessions || 0) * parseFloat(price_sessions || 0));
    return parseFloat(totalPrice.toFixed(2));
  };

  const formatCurrency = (amount) => `₱${amount.toFixed(2)}`;

  const handleOpenArchiveModal = (id, package_name) => {
    setSelectedPackage({ id, package_name });
    setShowArchiveModal(true);
  };

  const handleCloseArchiveModal = () => {
    setShowArchiveModal(false);
  };

  const handleArchivePackage = async () => {
    try {
      await apiService.put(`packages/archive/${selectedPackage.id}`);
      alert('Package archived successfully.');
      setShowArchiveModal(false);
      // Optional: trigger a refetch or update the local state to reflect the change
    } catch (err) {
      console.error('Failed to archive:', err);
      alert('Failed to archive the package.');
    }
    fetchPackages();
  };

  const totalPages = Math.ceil(packages.length / itemsPerPage);
  const paginatedPackages = packages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <ResponsiveNavbar />
      <div className="h-24" />
      <div className="items-center justify-center flex flex-col">
        <div className="p-4 flex flex-col">
           <h2 className="text-2xl font-bold mb-4">Package Management</h2>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-blue-600 text-white text-base w-48 h-12 rounded-md hover:bg-blue-700 mb-4">
            + Create Package
          </button>

  
        {loading ? (
          <p>Loading packages...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : packages.length === 0 ? (
          <p>No packages found.</p>
        ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-300 max-w-4xl w-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2 w-64">Package</th>
                  <th className="border px-4 py-2">Total Price</th>
                  <th className="border px-4 py-2">Type</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPackages.map(pkg => (
                  <tr key={pkg.id}>
                    <td className="border px-4 py-2">{pkg.id}</td>
                    <td className="border px-4 py-2">{pkg.package_name}</td>
                    <td className="border px-4 py-2">
                      {formatCurrency(calculateTotalPrice(pkg.price_package, pkg.total_sessions, pkg.price_sessions))}
                    </td>
                    <td className="border px-4 py-2 capitalize">{pkg.tutorial_type}</td>
                    <td className="border px-4 py-2 capitalize">{pkg.status}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <div className="flex">
                      <button onClick={() => setViewingPackage(pkg)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">View</button>
                      <button onClick={() => handleEdit(pkg)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 ml-2">Edit</button>
                      <button onClick={() => handleOpenArchiveModal(pkg.id, pkg.package_name)} variant="destructive" className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-6">Archive</button>
                    </div>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center space-x-2">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50">Prev</button>
              <span className="px-3 py-1">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50">Next</button>
            </div>
          </>
        )}
      </div>
      </div>
      

      {/* Floating Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={resetForm}>
          <div className="bg-white p-6 rounded-lg w-full max-w-xl relative shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">{mode === 'edit' ? 'Edit Package' : 'Create Package'}</h2>
            <form onSubmit={mode === 'edit' ? handleUpdate : handleSubmit} className="space-y-3">
              <FloatingField
                id="package_name"
                name="package_name"
                label="Package Name"
                value={formData.package_name}
                onChange={handleChange}
                required
              />
              <FloatingField
                id="price_package" 
                name="price_package" 
                label="Package Price"
                readOnly={mode === 'edit'} 
                type="number" 
                step="0.01" 
                max="999999.99" 
                value={formData.price_package} 
                onChange={handleChange} 
                required 
               />
              <FloatingField 
                id="total_sessions" 
                name="total_sessions" 
                label="Total Sessions" 
                readOnly={mode === 'edit'} 
                type="number" 
                value={formData.total_sessions} 
                onChange={handleChange} 
                required
              />
              <FloatingField
                type="number"
                id="price_sessions"
                name="price_sessions"
                label="Price Per Session"
                value={formData.price_sessions}
                onChange={handleChange}
                readOnly={mode === 'edit'}
                step="0.01"
                max="999999.99"
              />
              <FloatingField
                type="number"
                id="total_price"
                name="total_price"
                label="Total Price"
                value={calculateTotalPrice(
                  formData.price_package,
                  formData.total_sessions,
                  formData.price_sessions
                )}
                readOnly
              />
              <FloatingField
                type="select"
                id="tutorial_type"
                name="tutorial_type"
                label="Tutorial Type"
                value={formData.tutorial_type}
                onChange={handleChange}
                required
                options={[
                  { value: '', label: 'Select a Tutorial Type'},
                  { value: 'center-based', label: 'Center-Based' },
                  { value: 'home-based', label: 'Home-Based' },
                ]}
              />
              <FloatingField
                type="select"
                id="status"
                name="status"
                label="Status"
                value={formData.status}
                onChange={handleChange}
                required
                options={[
                  { value: '', label: 'Select Package Status'},
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
              />
              <FloatingField
                type="textarea"
                id="description"
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
              />

              <div className="flex justify-end space-x-2 pt-4">
                {/* <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button> */}
                <button type="submit" className={`text-white px-4 py-2 rounded ${mode === 'edit' ? 'bg-yellow-500' : 'bg-blue-500'}`}>
                  {mode === 'edit' ? 'Update Package' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* View Package Details Modal */}
        {viewingPackage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={() => setViewingPackage(null)} // ← closes modal on outside click
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative"
              onClick={(e) => e.stopPropagation()} // ← prevents closing when clicking inside modal
            >
              <h2 className="text-2xl font-semibold mb-4">Package Details</h2>
              <div className="space-y-2">
                <p><strong>ID:</strong> {viewingPackage.id}</p>
                <p><strong>Package Name:</strong> {viewingPackage.package_name}</p>
                <p><strong>Package Price:</strong> {formatCurrency(parseFloat(viewingPackage.price_package))}</p>
                <p><strong>Sessions:</strong> {viewingPackage.total_sessions}</p>
                <p><strong>Price per Session:</strong> {formatCurrency(parseFloat(viewingPackage.price_sessions))}</p>
                <p><strong>Total Price:</strong> {formatCurrency(calculateTotalPrice(viewingPackage.price_package, viewingPackage.total_sessions, viewingPackage.price_sessions))}</p>
                <p className='capitalize'><strong>Tutorial Type:</strong> {viewingPackage.tutorial_type}</p>
                <p><strong>Status:</strong> {viewingPackage.status}</p>
                <p><strong>Description:</strong> {viewingPackage.description || 'N/A'}</p>
              </div>
              {/* <button
                onClick={() => setViewingPackage(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              >
                &times;
              </button> */}
            </div>
          </div>
        )}
        {/* Archive Modal */}
        {showArchiveModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleCloseArchiveModal}
          >
            <div
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Are you sure you want to archive <br />
                <span className="text-blue-600">
                  Package ID #{selectedPackage.id} - "{selectedPackage.package_name}"
                </span>
                ?
              </h2>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCloseArchiveModal}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleArchivePackage}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Yes, Archive
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default AdminPackage;

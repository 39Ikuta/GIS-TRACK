import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Search,
  Phone,
  User,
  FileText,
  MapPin,
  Signal,
  Smartphone
} from 'lucide-react';
import { useSim, SimCard } from '../contexts/SimContext';

export default function SimManagement() {
  const { sims, addSim, updateSim, deleteSim, trackSim, searchSims } = useSim();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSim, setEditingSim] = useState<SimCard | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    phoneNumber: '',
    name: '',
    remarks: '',
    imsi: '',
    imei: '',
    status: 'inactive' as const
  });

  const filteredSims = searchQuery ? searchSims(searchQuery) : sims;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSim) {
      updateSim(editingSim.id, formData);
      setEditingSim(null);
    } else {
      addSim(formData);
      setShowAddModal(false);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      phoneNumber: '',
      name: '',
      remarks: '',
      imsi: '',
      imei: '',
      status: 'inactive'
    });
  };

  const handleEdit = (sim: SimCard) => {
    setEditingSim(sim);
    setFormData({
      phoneNumber: sim.phoneNumber,
      name: sim.name,
      remarks: sim.remarks,
      imsi: sim.imsi || '',
      imei: sim.imei || '',
      status: sim.status
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this SIM?')) {
      deleteSim(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-900 text-green-300 border-green-700',
      inactive: 'bg-gray-600 text-gray-300 border-gray-500',
      tracking: 'bg-orange-900 text-orange-300 border-orange-700'
    };
    return styles[status as keyof typeof styles] || styles.inactive;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">Manage your tracked SIM cards</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add SIM</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by phone number, name, or remarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 text-gray-100 placeholder-gray-400 rounded-lg focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* SIM Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSims.map((sim) => (
          <div key={sim.id} className="bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 transition-colors">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{sim.name}</h3>
                    <p className="text-sm text-gray-400">{sim.phoneNumber}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded border ${getStatusBadge(sim.status)}`}>
                  {sim.status.charAt(0).toUpperCase() + sim.status.slice(1)}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                {sim.imsi && (
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Signal className="w-4 h-4" />
                    <span>IMSI: {sim.imsi}</span>
                  </div>
                )}
                {sim.imei && (
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>IMEI: {sim.imei}</span>
                  </div>
                )}
                {sim.lastLocation && (
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{sim.lastLocation.address}</span>
                  </div>
                )}
                {sim.remarks && (
                  <div className="flex items-start space-x-2 text-sm text-gray-400">
                    <FileText className="w-4 h-4 mt-0.5" />
                    <span className="line-clamp-2">{sim.remarks}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => trackSim(sim.id)}
                  disabled={sim.status === 'tracking'}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    sim.status === 'tracking'
                      ? 'bg-orange-900 text-orange-300 cursor-not-allowed border border-orange-700'
                      : 'bg-green-900 text-green-300 hover:bg-green-800 border border-green-700'
                  }`}
                >
                  {sim.status === 'tracking' ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Tracking...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Track</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleEdit(sim)}
                  className="p-2 text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(sim.id)}
                  className="p-2 text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSims.length === 0 && (
        <div className="text-center py-12">
          <Smartphone className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <p className="text-gray-500">
            {searchQuery ? 'No SIMs found matching your search' : 'No SIMs registered yet'}
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                {editingSim ? 'Edit SIM' : 'Add New SIM'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                  placeholder="+1234567890"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Device Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Primary Device"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  IMSI
                </label>
                <input
                  type="text"
                  value={formData.imsi}
                  onChange={(e) => setFormData({ ...formData, imsi: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                  placeholder="310260123456789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  IMEI
                </label>
                <input
                  type="text"
                  value={formData.imei}
                  onChange={(e) => setFormData({ ...formData, imei: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                  placeholder="123456789012345"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="inactive">Inactive</option>
                  <option value="active">Active</option>
                  <option value="tracking">Tracking</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 rounded-lg focus:border-blue-500 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder="Additional notes..."
                />
              </div>
              <div className="flex space-x-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingSim(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  {editingSim ? 'Update' : 'Add'} SIM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
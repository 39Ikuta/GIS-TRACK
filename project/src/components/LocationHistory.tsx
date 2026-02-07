import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Clock, 
  Download,
  Filter,
  Smartphone,
  Signal
} from 'lucide-react';
import { useSim } from '../contexts/SimContext';

export default function LocationHistory() {
  const { locationHistory, searchLocationHistory, sims } = useSim();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('');

  let filteredHistory = searchQuery ? searchLocationHistory(searchQuery) : locationHistory;

  // Apply additional filters
  if (dateFilter) {
    filteredHistory = filteredHistory.filter(record => 
      record.timestamp.startsWith(dateFilter)
    );
  }

  if (deviceFilter) {
    filteredHistory = filteredHistory.filter(record => 
      record.simId === deviceFilter
    );
  }

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Phone Number', 'Device Name', 'IMSI', 'IMEI', 'Latitude', 'Longitude', 'Address'];
    const csvContent = [
      headers.join(','),
      ...filteredHistory.map(record => {
        const sim = sims.find(s => s.id === record.simId);
        return [
          record.timestamp,
          record.phoneNumber,
          sim?.name || 'Unknown',
          record.imsi,
          record.imei,
          record.latitude,
          record.longitude,
          `"${record.address}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `location-history-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">Complete log of device locations</p>
        </div>
        <button
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Download className="w-5 h-5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search phone, IMSI, IMEI, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 rounded-lg focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:border-blue-500 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Devices</option>
              {sims.map((sim) => (
                <option key={sim.id} value={sim.id}>
                  {sim.name} ({sim.phoneNumber})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700 bg-gray-750">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Location Records ({filteredHistory.length})
            </h2>
            {searchQuery || dateFilter || deviceFilter ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDateFilter('');
                  setDeviceFilter('');
                }}
                className="text-sm text-blue-400 hover:text-blue-300 font-medium"
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredHistory.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-750 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Identifiers
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Coordinates
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredHistory.map((record) => {
                  const sim = sims.find(s => s.id === record.simId);
                  return (
                    <tr key={record.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-600 p-2 rounded-lg">
                            <Smartphone className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {sim?.name || 'Unknown Device'}
                            </p>
                            <p className="text-sm text-gray-400">{record.phoneNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <Signal className="w-3 h-3" />
                            <span>IMSI: {record.imsi}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <span>IMEI: {record.imei}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                          <p className="text-sm text-white max-w-xs">{record.address}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-400 font-mono">
                          {record.latitude.toFixed(6)}, {record.longitude.toFixed(6)}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-white">
                              {new Date(record.timestamp).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-400">
                              {new Date(record.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-500">
                {searchQuery || dateFilter || deviceFilter 
                  ? 'No location records found matching your filters' 
                  : 'No location history available yet'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
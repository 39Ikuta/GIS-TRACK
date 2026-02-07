import React from 'react';
import { 
  Smartphone, 
  Activity, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Users,
  Signal,
  AlertTriangle,
  Database,
  Wifi,
  Server
} from 'lucide-react';
import { useSim } from '../contexts/SimContext';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { sims, locationHistory, getSimStats } = useSim();
  const { users } = useAuth();
  const stats = getSimStats();

  const recentActivity = locationHistory
    .slice(0, 5)
    .map(history => {
      const sim = sims.find(s => s.id === history.simId);
      return {
        ...history,
        simName: sim?.name || 'Unknown Device'
      };
    });

  const activeTrackingSims = sims.filter(sim => sim.status === 'tracking');

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total SIMs</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <div className="bg-blue-600 p-3 rounded-lg">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Active SIMs</p>
              <p className="text-3xl font-bold text-green-400 mt-1">{stats.active}</p>
            </div>
            <div className="bg-green-600 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Locations Tracked</p>
              <p className="text-3xl font-bold text-orange-400 mt-1">{locationHistory.length}</p>
            </div>
            <div className="bg-orange-600 p-3 rounded-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Data Usage (GB)</p>
              <p className="text-3xl font-bold text-purple-400 mt-1">4.2</p>
            </div>
            <div className="bg-purple-600 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your SIM Cards */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Your SIM Cards</h2>
          </div>
          <div className="p-6 space-y-4">
            {sims.slice(0, 3).map((sim) => (
              <div key={sim.id} className="bg-gray-700 border border-gray-600 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-gray-400" />
                    <span className="text-white font-medium">{sim.phoneNumber}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    sim.status === 'active' ? 'bg-green-900 text-green-300' : 
                    sim.status === 'tracking' ? 'bg-orange-900 text-orange-300' : 
                    'bg-gray-600 text-gray-300'
                  }`}>
                    {sim.status}
                  </span>
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Signal className="w-4 h-4" />
                    <span>{sim.name}</span>
                  </div>
                  {sim.lastLocation && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{sim.lastLocation.address}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>5m ago</span>
                  </div>
                </div>
                {sim.status === 'active' && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Data usage: 2.4 GB</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Live Tracking Map */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Live Tracking Map</h2>
          </div>
          <div className="p-6">
            <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Map Integration</h3>
                <p className="text-gray-500 text-sm">
                  Google Maps API key required for live tracking
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {activeTrackingSims.map((sim) => (
                <div key={sim.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-white font-medium">{sim.phoneNumber}</span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {sim.lastLocation?.address || 'Locating...'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">System Status</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-green-900 border border-green-700 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-green-300">API Server</p>
                <p className="text-xs text-green-400">online</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-green-900 border border-green-700 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-green-300">Database</p>
                <p className="text-xs text-green-400">online</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-green-900 border border-green-700 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-green-300">Network</p>
                <p className="text-xs text-green-400">online</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-yellow-300">Tracking Service</p>
                <p className="text-xs text-yellow-400">warning</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Recent Alerts</h2>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-yellow-900 border border-yellow-700 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-yellow-300 font-medium">High data usage detected for SIM</p>
              <p className="text-yellow-400 text-sm">+1-555-123-4567</p>
              <p className="text-yellow-500 text-xs">5 min ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-blue-900 border border-blue-700 rounded-lg">
            <Users className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-blue-300 font-medium">New user registration: Jane Smith</p>
              <p className="text-blue-500 text-xs">15 min ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
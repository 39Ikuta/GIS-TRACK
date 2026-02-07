import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Activity, 
  Clock, 
  Smartphone,
  RefreshCw,
  Locate,
  Navigation
} from 'lucide-react';
import { useSim } from '../contexts/SimContext';

export default function LiveTracking() {
  const { sims, trackSim } = useSim();
  const [selectedSim, setSelectedSim] = useState<string>('');
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Auto-refresh every 30 seconds when tracking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        setLastUpdate(new Date());
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const activeSims = sims.filter(sim => sim.status !== 'inactive');
  const trackingSims = sims.filter(sim => sim.status === 'tracking');

  const handleStartTracking = (simId: string) => {
    trackSim(simId);
    setSelectedSim(simId);
    setIsTracking(true);
  };

  const MapPlaceholder = () => (
    <div className="h-96 bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
      <div className="text-center">
        <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-300 mb-2">Google Maps Integration</h3>
        <p className="text-gray-500 text-sm max-w-xs">
          Map visualization will be available once Google Maps API is configured
        </p>
        <div className="mt-4 p-3 bg-yellow-900 border border-yellow-700 rounded-lg">
          <p className="text-yellow-300 text-xs">
            Placeholder for real-time location display
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">Real-time location monitoring</p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-900 text-blue-300 px-4 py-2 rounded-lg border border-blue-700">
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-medium">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Live Map</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors">
                  <Locate className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors">
                  <Navigation className="w-5 h-5" />
                </button>
              </div>
            </div>
            <MapPlaceholder />
          </div>
        </div>

        {/* Control Panel */}
        <div className="space-y-6">
          {/* Device Selection */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Select Device</h3>
            <div className="space-y-3">
              {activeSims.map((sim) => (
                <button
                  key={sim.id}
                  onClick={() => setSelectedSim(sim.id)}
                  className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                    selectedSim === sim.id
                      ? 'bg-blue-900 border-2 border-blue-600 text-blue-100'
                      : 'bg-gray-700 border border-gray-600 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      sim.status === 'tracking' 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-green-600 text-white'
                    }`}>
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-white">{sim.name}</p>
                      <p className="text-sm text-gray-400 truncate">{sim.phoneNumber}</p>
                    </div>
                    <div className={`px-2 py-1 text-xs font-medium rounded ${
                      sim.status === 'tracking'
                        ? 'bg-orange-900 text-orange-300 border border-orange-700'
                        : 'bg-green-900 text-green-300 border border-green-700'
                    }`}>
                      {sim.status}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {selectedSim && (
              <button
                onClick={() => handleStartTracking(selectedSim)}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Start Real-time Tracking
              </button>
            )}
          </div>

          {/* Currently Tracking */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Currently Tracking</h3>
            {trackingSims.length > 0 ? (
              <div className="space-y-3">
                {trackingSims.map((sim) => (
                  <div key={sim.id} className="p-4 bg-orange-900 border border-orange-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-600 p-2 rounded-lg">
                        <Activity className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white">{sim.name}</p>
                        <p className="text-sm text-orange-200">{sim.phoneNumber}</p>
                        {sim.lastLocation && (
                          <p className="text-xs text-orange-300 mt-1 truncate">
                            📍 {sim.lastLocation.address}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-orange-300 font-medium">Live</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Activity className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <p className="text-sm">No devices currently tracking</p>
              </div>
            )}
          </div>

          {/* Tracking Stats */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Tracking Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Active Devices</span>
                <span className="font-semibold text-green-400">{activeSims.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Currently Tracking</span>
                <span className="font-semibold text-orange-400">{trackingSims.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Update Frequency</span>
                <span className="font-semibold text-blue-400">30s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Last Update</span>
                <span className="font-semibold text-gray-300">
                  {lastUpdate.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
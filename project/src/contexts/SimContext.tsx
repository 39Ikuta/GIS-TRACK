import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SimCard {
  id: string;
  phoneNumber: string;
  name: string;
  remarks: string;
  status: 'active' | 'inactive' | 'tracking';
  lastLocation?: {
    latitude: number;
    longitude: number;
    address: string;
    timestamp: string;
  };
  imsi?: string;
  imei?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocationHistory {
  id: string;
  simId: string;
  phoneNumber: string;
  imsi: string;
  imei: string;
  latitude: number;
  longitude: number;
  address: string;
  timestamp: string;
}

interface SimContextType {
  sims: SimCard[];
  locationHistory: LocationHistory[];
  addSim: (sim: Omit<SimCard, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSim: (id: string, updates: Partial<SimCard>) => void;
  deleteSim: (id: string) => void;
  trackSim: (id: string) => void;
  searchSims: (query: string) => SimCard[];
  searchLocationHistory: (query: string) => LocationHistory[];
  getSimStats: () => {
    total: number;
    active: number;
    inactive: number;
    tracking: number;
  };
}

const SimContext = createContext<SimContextType | undefined>(undefined);

// Mock data
const mockSims: SimCard[] = [
  {
    id: '1',
    phoneNumber: '+1234567890',
    name: 'Primary Device',
    remarks: 'Main tracking device for operation Alpha',
    status: 'active',
    lastLocation: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: 'New York, NY, USA',
      timestamp: '2024-01-15T10:30:00Z'
    },
    imsi: '310260123456789',
    imei: '123456789012345',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    phoneNumber: '+1234567891',
    name: 'Backup Device',
    remarks: 'Secondary tracking device',
    status: 'tracking',
    lastLocation: {
      latitude: 34.0522,
      longitude: -118.2437,
      address: 'Los Angeles, CA, USA',
      timestamp: '2024-01-15T09:15:00Z'
    },
    imsi: '310260123456790',
    imei: '123456789012346',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-15T09:15:00Z'
  },
  {
    id: '3',
    phoneNumber: '+1234567892',
    name: 'Test Device',
    remarks: 'Testing purposes only',
    status: 'inactive',
    imsi: '310260123456791',
    imei: '123456789012347',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  }
];

const mockLocationHistory: LocationHistory[] = [
  {
    id: '1',
    simId: '1',
    phoneNumber: '+1234567890',
    imsi: '310260123456789',
    imei: '123456789012345',
    latitude: 40.7128,
    longitude: -74.0060,
    address: 'New York, NY, USA',
    timestamp: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    simId: '1',
    phoneNumber: '+1234567890',
    imsi: '310260123456789',
    imei: '123456789012345',
    latitude: 40.7589,
    longitude: -73.9851,
    address: 'Central Park, New York, NY, USA',
    timestamp: '2024-01-15T08:45:00Z'
  },
  {
    id: '3',
    simId: '2',
    phoneNumber: '+1234567891',
    imsi: '310260123456790',
    imei: '123456789012346',
    latitude: 34.0522,
    longitude: -118.2437,
    address: 'Los Angeles, CA, USA',
    timestamp: '2024-01-15T09:15:00Z'
  }
];

export function SimProvider({ children }: { children: React.ReactNode }) {
  const [sims, setSims] = useState<SimCard[]>(mockSims);
  const [locationHistory, setLocationHistory] = useState<LocationHistory[]>(mockLocationHistory);

  const addSim = (simData: Omit<SimCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSim: SimCard = {
      ...simData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSims(prev => [...prev, newSim]);
  };

  const updateSim = (id: string, updates: Partial<SimCard>) => {
    setSims(prev => prev.map(sim => 
      sim.id === id 
        ? { ...sim, ...updates, updatedAt: new Date().toISOString() }
        : sim
    ));
  };

  const deleteSim = (id: string) => {
    setSims(prev => prev.filter(sim => sim.id !== id));
    setLocationHistory(prev => prev.filter(history => history.simId !== id));
  };

  const trackSim = (id: string) => {
    updateSim(id, { status: 'tracking' });
    
    // Simulate real-time tracking updates
    setTimeout(() => {
      const sim = sims.find(s => s.id === id);
      if (sim) {
        const newLocation = {
          latitude: Math.random() * 180 - 90,
          longitude: Math.random() * 360 - 180,
          address: 'Updated Location',
          timestamp: new Date().toISOString()
        };
        
        updateSim(id, { 
          lastLocation: newLocation,
          status: 'active'
        });

        // Add to location history
        const newHistory: LocationHistory = {
          id: Date.now().toString(),
          simId: id,
          phoneNumber: sim.phoneNumber,
          imsi: sim.imsi || '',
          imei: sim.imei || '',
          ...newLocation
        };
        
        setLocationHistory(prev => [newHistory, ...prev]);
      }
    }, 2000);
  };

  const searchSims = (query: string): SimCard[] => {
    return sims.filter(sim =>
      sim.phoneNumber.toLowerCase().includes(query.toLowerCase()) ||
      sim.name.toLowerCase().includes(query.toLowerCase()) ||
      sim.remarks.toLowerCase().includes(query.toLowerCase())
    );
  };

  const searchLocationHistory = (query: string): LocationHistory[] => {
    return locationHistory.filter(history =>
      history.phoneNumber.toLowerCase().includes(query.toLowerCase()) ||
      history.imsi.toLowerCase().includes(query.toLowerCase()) ||
      history.imei.toLowerCase().includes(query.toLowerCase()) ||
      history.address.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getSimStats = () => {
    return {
      total: sims.length,
      active: sims.filter(sim => sim.status === 'active').length,
      inactive: sims.filter(sim => sim.status === 'inactive').length,
      tracking: sims.filter(sim => sim.status === 'tracking').length
    };
  };

  return (
    <SimContext.Provider value={{
      sims,
      locationHistory,
      addSim,
      updateSim,
      deleteSim,
      trackSim,
      searchSims,
      searchLocationHistory,
      getSimStats
    }}>
      {children}
    </SimContext.Provider>
  );
}

export function useSim() {
  const context = useContext(SimContext);
  if (context === undefined) {
    throw new Error('useSim must be used within a SimProvider');
  }
  return context;
}
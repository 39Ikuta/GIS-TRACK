import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SimProvider } from './contexts/SimContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SimManagement from './components/SimManagement';
import LiveTracking from './components/LiveTracking';
import LocationHistory from './components/LocationHistory';
import UserManagement from './components/UserManagement';

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'sims':
        return <SimManagement />;
      case 'tracking':
        return <LiveTracking />;
      case 'history':
        return <LocationHistory />;
      case 'users':
        return user.role === 'admin' ? <UserManagement /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <SimProvider>
        <AppContent />
      </SimProvider>
    </AuthProvider>
  );
}

export default App;
import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Shield, 
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Filter
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function UserManagement() {
  const { users, createUser, deleteUser, searchUsers } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    alias: '',
    role: 'user' as 'admin' | 'user'
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const filteredUsers = searchQuery ? searchUsers(searchQuery) : users;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = createUser(formData.username, formData.password, formData.alias, formData.role);
    
    if (success) {
      setMessage({ type: 'success', text: 'User created successfully!' });
      setShowAddModal(false);
      resetForm();
    } else {
      setMessage({ type: 'error', text: 'Failed to create user. Username may already exist.' });
    }
    
    setTimeout(() => setMessage(null), 3000);
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      alias: '',
      role: 'user'
    });
  };

  const handleDelete = (userId: string, username: string) => {
    if (confirm(`Are you sure you want to delete user "${username}"?`)) {
      const success = deleteUser(userId);
      if (success) {
        setMessage({ type: 'success', text: 'User deleted successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to delete user.' });
      }
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">Create and manage user accounts</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create User</span>
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`flex items-center space-x-2 px-4 py-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-900 text-green-300 border border-green-700' 
            : 'bg-red-900 text-red-300 border border-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 text-gray-100 placeholder-gray-400 rounded-lg focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-3 bg-gray-800 border border-gray-600 text-gray-100 rounded-lg focus:border-blue-500 focus:ring-blue-500">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Users List */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Users ({filteredUsers.length})</h2>
        </div>
        <div className="divide-y divide-gray-700">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-6 hover:bg-gray-750 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{user.alias}</h3>
                    <p className="text-gray-400 text-sm">{user.username}@example.com</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="px-2 py-1 text-xs font-medium rounded bg-green-900 text-green-300">
                        active
                      </span>
                      <div className="flex items-center space-x-1 text-gray-400 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>Last login: 30m ago</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-400 text-sm">
                        <Smartphone className="w-4 h-4" />
                        <span>3 SIM cards</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-blue-400 hover:bg-gray-700 rounded-lg transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id, user.username)}
                    className="p-2 text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Create User</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter username"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter password"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Alias/Display Name *
                </label>
                <input
                  type="text"
                  value={formData.alias}
                  onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Field Agent Alpha"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
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
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
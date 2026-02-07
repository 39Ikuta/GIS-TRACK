import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  alias: string;
  role: 'admin' | 'user';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  createUser: (username: string, password: string, alias: string, role: 'admin' | 'user') => boolean;
  deleteUser: (userId: string) => boolean;
  searchUsers: (query: string) => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demo purposes
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    alias: 'System Administrator',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    username: 'user1',
    password: 'user123',
    alias: 'Field Agent Alpha',
    role: 'user',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    username: 'user2',
    password: 'user123',
    alias: 'Field Agent Beta',
    role: 'user',
    createdAt: '2024-01-03T00:00:00Z'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<(User & { password: string })[]>(mockUsers);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        username: foundUser.username,
        alias: foundUser.alias,
        role: foundUser.role,
        createdAt: foundUser.createdAt
      };
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const createUser = (username: string, password: string, alias: string, role: 'admin' | 'user'): boolean => {
    if (user?.role !== 'admin') return false;
    if (users.find(u => u.username === username)) return false;

    const newUser = {
      id: Date.now().toString(),
      username,
      password,
      alias,
      role,
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    return true;
  };

  const deleteUser = (userId: string): boolean => {
    if (user?.role !== 'admin') return false;
    if (userId === user.id) return false; // Can't delete self

    setUsers(prev => prev.filter(u => u.id !== userId));
    return true;
  };

  const searchUsers = (query: string): User[] => {
    const filtered = users.filter(u => 
      u.alias.toLowerCase().includes(query.toLowerCase()) ||
      u.username.toLowerCase().includes(query.toLowerCase())
    );
    return filtered.map(u => ({
      id: u.id,
      username: u.username,
      alias: u.alias,
      role: u.role,
      createdAt: u.createdAt
    }));
  };

  const publicUsers = users.map(u => ({
    id: u.id,
    username: u.username,
    alias: u.alias,
    role: u.role,
    createdAt: u.createdAt
  }));

  return (
    <AuthContext.Provider value={{
      user,
      users: publicUsers,
      login,
      logout,
      createUser,
      deleteUser,
      searchUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
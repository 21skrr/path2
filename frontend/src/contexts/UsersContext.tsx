import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchAllUsers, deleteUser as apiDeleteUser, updateUserMembership } from '../services/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  membershipStatus: string;
  createdAt: string;
}

interface UsersContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  deleteUser: (id: number) => Promise<void>;
  updateMembership: (id: number, status: string) => Promise<void>;
  refreshUsers: () => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchAllUsers();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch users', err);
      setError('Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const deleteUser = async (id: number) => {
    try {
      await apiDeleteUser(id);
      loadUsers();
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  const updateMembership = async (id: number, status: string) => {
    try {
      await updateUserMembership(id, status);
      loadUsers();
    } catch (err) {
      console.error('Failed to update membership', err);
    }
  };

  return (
    <UsersContext.Provider value={{ users, loading, error, deleteUser, updateMembership, refreshUsers: loadUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};

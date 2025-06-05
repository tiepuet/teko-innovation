import { User } from '../context/AuthContext';

export const mockUsers: User[] = [
  {
    id: 'admin-1',
    full_name: 'Admin User',
    email: 'admin@tekoinnovation.com',
    role: 'admin',
  },
  {
    id: 'user-1',
    full_name: 'Regular User',
    email: 'user@tekoinnovation.com',
    role: 'user',
  },
  {
    id: 'user-google-1',
    full_name: 'Google User',
    email: 'google@tekoinnovation.com',
    role: 'user',
  },
];
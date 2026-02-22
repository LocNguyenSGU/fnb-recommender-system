'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import DataTable from '@/components/Admin/DataTable';
import ModalForm from '@/components/Admin/ModalForm';
import { ToastContainer, useToast } from '@/components/Admin/Toast';
import { userAPI } from '@/lib/api';
import { User } from '@/lib/types';

const fields = [
  { key: 'username', label: 'Username', type: 'text' as const, required: true },
  { key: 'password', label: 'Password', type: 'password' as const },
  { key: 'full_name', label: 'Full Name', type: 'text' as const, required: true },
  { key: 'email', label: 'Email', type: 'email' as const, required: true },
  { key: 'phone', label: 'Phone', type: 'text' as const },
  { key: 'avatar_url', label: 'Avatar URL', type: 'text' as const },
  { key: 'google_id', label: 'Google ID', type: 'text' as const },
  { key: 'facebook_id', label: 'Facebook ID', type: 'text' as const },
  {
    key: 'provider',
    label: 'Provider',
    type: 'select' as const,
    options: [
      { value: 'local', label: 'Local' },
      { value: 'google', label: 'Google' },
      { value: 'facebook', label: 'Facebook' },
    ],
  },
  {
    key: 'role',
    label: 'Role',
    type: 'select' as const,
    options: [
      { value: 'user', label: 'User' },
      { value: 'admin', label: 'Admin' },
      { value: 'owner', label: 'Owner' },
    ],
  },
];

const columns = [
  { key: 'id' as keyof User, label: 'ID' },
  { key: 'username' as keyof User, label: 'Username' },
  { key: 'full_name' as keyof User, label: 'Full Name' },
  { key: 'email' as keyof User, label: 'Email' },
  { key: 'role' as keyof User, label: 'Role' },
  {
    key: 'created_at' as keyof User,
    label: 'Created',
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(userAPI.getAll());
  };

  const handleAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    userAPI.delete(id);
    loadUsers();
    addToast('User deleted successfully', 'success');
  };

  const handleSubmit = (data: Record<string, any>) => {
    try {
      if (editingUser) {
        userAPI.update(editingUser.id, data as any);
        addToast('User updated successfully', 'success');
      } else {
        userAPI.create(data as any);
        addToast('User created successfully', 'success');
      }
      loadUsers();
      setIsModalOpen(false);
    } catch (error) {
      addToast('An error occurred', 'error');
    }
  };

  return (
    <AdminLayout title="Users">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Manage Users</h2>
            <p className="text-gray-600">Add, edit, or delete user accounts</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add User
          </button>
        </div>

        <DataTable
          data={users}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ModalForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          title={editingUser ? 'Edit User' : 'Add User'}
          fields={fields}
          initialData={editingUser || {}}
        />

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </AdminLayout>
  );
}
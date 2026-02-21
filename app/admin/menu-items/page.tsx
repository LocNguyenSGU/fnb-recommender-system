'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import DataTable from '@/components/Admin/DataTable';
import ModalForm from '@/components/Admin/ModalForm';
import { ToastContainer, useToast } from '@/components/Admin/Toast';
import { menuItemAPI } from '@/lib/api';
import { MenuItem } from '@/lib/types';

const fields = [
  { key: 'menu_id', label: 'Menu ID', type: 'number' as const, required: true },
  { key: 'name', label: 'Name', type: 'text' as const, required: true },
  { key: 'description', label: 'Description', type: 'textarea' as const },
  { key: 'price', label: 'Price', type: 'number' as const, required: true },
  { key: 'is_available', label: 'Available', type: 'checkbox' as const },
  { key: 'is_hot', label: 'Hot', type: 'checkbox' as const },
  { key: 'is_signature', label: 'Signature', type: 'checkbox' as const },
  { key: 'images', label: 'Images (JSON array)', type: 'textarea' as const },
];

const columns = [
  { key: 'id' as keyof MenuItem, label: 'ID' },
  { key: 'name' as keyof MenuItem, label: 'Name' },
  { key: 'price' as keyof MenuItem, label: 'Price', render: (value: number) => `$${value.toFixed(2)}` },
  { key: 'is_available' as keyof MenuItem, label: 'Available', render: (value: boolean) => value ? 'Yes' : 'No' },
  { key: 'is_hot' as keyof MenuItem, label: 'Hot', render: (value: boolean) => value ? 'Yes' : 'No' },
  { key: 'is_signature' as keyof MenuItem, label: 'Signature', render: (value: boolean) => value ? 'Yes' : 'No' },
  { key: 'menu_id' as keyof MenuItem, label: 'Menu ID' },
  {
    key: 'created_at' as keyof MenuItem,
    label: 'Created',
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
];

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = () => {
    setMenuItems(menuItemAPI.getAll());
  };

  const handleAdd = () => {
    setEditingMenuItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    menuItemAPI.delete(id);
    loadMenuItems();
    addToast('Menu item deleted successfully', 'success');
  };

  const handleSubmit = (data: Record<string, any>) => {
    try {
      if (data.images && typeof data.images === 'string') {
        try {
          data.images = JSON.parse(data.images);
        } catch {
          data.images = [];
        }
      }

      if (editingMenuItem) {
        menuItemAPI.update(editingMenuItem.id, data as any);
        addToast('Menu item updated successfully', 'success');
      } else {
        menuItemAPI.create(data as any);
        addToast('Menu item created successfully', 'success');
      }
      loadMenuItems();
      setIsModalOpen(false);
    } catch (error) {
      addToast('An error occurred', 'error');
    }
  };

  return (
    <AdminLayout title="Menu Items">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Manage Menu Items</h2>
            <p className="text-gray-600">Add, edit, or delete individual menu items</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Menu Item
          </button>
        </div>

        <DataTable
          data={menuItems}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ModalForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          title={editingMenuItem ? 'Edit Menu Item' : 'Add Menu Item'}
          fields={fields}
          initialData={editingMenuItem ? { ...editingMenuItem, images: JSON.stringify(editingMenuItem.images) } : {}}
        />

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </AdminLayout>
  );
}
'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import DataTable from '@/components/Admin/DataTable';
import ModalForm from '@/components/Admin/ModalForm';
import { ToastContainer, useToast } from '@/components/Admin/Toast';
import menuItemsApi from '@/lib/menuItems';
import { MenuItem } from '@/lib/types';

const fields = [
  { key: 'menuId', label: 'Menu ID', type: 'number' as const, required: true },
  { key: 'name', label: 'Name', type: 'text' as const, required: true },
  { key: 'description', label: 'Description', type: 'textarea' as const },
  { key: 'price', label: 'Price', type: 'number' as const, required: true },
  { key: 'isAvailable', label: 'Available', type: 'checkbox' as const },
  { key: 'isHot', label: 'Hot', type: 'checkbox' as const },
  { key: 'isSignature', label: 'Signature', type: 'checkbox' as const },
  { key: 'images', label: 'Images (JSON array)', type: 'textarea' as const },
];

const columns = [
  { key: 'id' as keyof MenuItem, label: 'ID' },
  { key: 'name' as keyof MenuItem, label: 'Name' },
  { key: 'price' as keyof MenuItem, label: 'Price', render: (value: number) => `$${value.toFixed(2)}` },
  { key: 'isAvailable' as keyof MenuItem, label: 'Available', render: (value: boolean) => value ? 'Yes' : 'No' },
  { key: 'isHot' as keyof MenuItem, label: 'Hot', render: (value: boolean) => value ? 'Yes' : 'No' },
  { key: 'isSignature' as keyof MenuItem, label: 'Signature', render: (value: boolean) => value ? 'Yes' : 'No' },
  { key: 'menuId' as keyof MenuItem, label: 'Menu ID' },
  {
    key: 'createdAt' as keyof MenuItem,
    label: 'Created',
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
];

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const response = await (menuItemsApi as any).getAll();
      setMenuItems(response.data);
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Failed to load menu items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingMenuItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await (menuItemsApi as any).remove(id);
      loadMenuItems();
      addToast('Menu item deleted successfully', 'success');
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Failed to delete menu item', 'error');
    }
  };

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      if (data.images && typeof data.images === 'string') {
        try {
          data.images = JSON.parse(data.images);
        } catch {
          data.images = [];
        }
      }

      if (editingMenuItem) {
        await (menuItemsApi as any).update(editingMenuItem.id, data);
        addToast('Menu item updated successfully', 'success');
      } else {
        await (menuItemsApi as any).create(data);
        addToast('Menu item created successfully', 'success');
      }
      loadMenuItems();
      setIsModalOpen(false);
    } catch (error: any) {
      addToast(error.response?.data?.message || 'An error occurred', 'error');
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
          loading={loading}
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
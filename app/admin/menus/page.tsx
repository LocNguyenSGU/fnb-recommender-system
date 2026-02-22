'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import DataTable from '@/components/Admin/DataTable';
import ModalForm from '@/components/Admin/ModalForm';
import { ToastContainer, useToast } from '@/components/Admin/Toast';
import menusApi from '@/lib/menus';
import { Menu } from '@/lib/types';

const fields = [
  { key: 'shopId', label: 'Shop ID', type: 'number' as const, required: true },
  { key: 'name', label: 'Name', type: 'text' as const },
  { key: 'images', label: 'Images (JSON array)', type: 'textarea' as const },
];

const columns = [
  { key: 'id' as keyof Menu, label: 'ID' },
  { key: 'name' as keyof Menu, label: 'Name' },
  { key: 'shopId' as keyof Menu, label: 'Shop ID' },
  {
    key: 'images' as keyof Menu,
    label: 'Images',
    render: (value: string[]) => `${value.length} images`,
  },
  {
    key: 'createdAt' as keyof Menu,
    label: 'Created',
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
];

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      setLoading(true);
      const response = await (menusApi as any).getAll();
      setMenus(response.data);
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Failed to load menus', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingMenu(null);
    setIsModalOpen(true);
  };

  const handleEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await (menusApi as any).remove(id);
      loadMenus();
      addToast('Menu deleted successfully', 'success');
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Failed to delete menu', 'error');
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

      if (editingMenu) {
        await (menusApi as any).update(editingMenu.id, data);
        addToast('Menu updated successfully', 'success');
      } else {
        await (menusApi as any).create(data);
        addToast('Menu created successfully', 'success');
      }
      loadMenus();
      setIsModalOpen(false);
    } catch (error: any) {
      addToast(error.response?.data?.message || 'An error occurred', 'error');
    }
  };

  return (
    <AdminLayout title="Menus">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Manage Menus</h2>
            <p className="text-gray-600">Add, edit, or delete shop menus</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Menu
          </button>
        </div>

        <DataTable
          data={menus}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

        <ModalForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          title={editingMenu ? 'Edit Menu' : 'Add Menu'}
          fields={fields}
          initialData={editingMenu ? { ...editingMenu, images: JSON.stringify(editingMenu.images) } : {}}
        />

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </AdminLayout>
  );
}
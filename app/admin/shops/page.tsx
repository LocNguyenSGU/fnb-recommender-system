'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import DataTable from '@/components/Admin/DataTable';
import ModalForm from '@/components/Admin/ModalForm';
import { ToastContainer, useToast } from '@/components/Admin/Toast';
import { shopAPI } from '@/lib/api';
import { Shop } from '@/lib/types';

const fields = [
  { key: 'owner_id', label: 'Owner ID', type: 'number' as const, required: true },
  { key: 'category_id', label: 'Category ID', type: 'number' as const },
  { key: 'name', label: 'Name', type: 'text' as const, required: true },
  { key: 'address', label: 'Address', type: 'textarea' as const },
  { key: 'latitude', label: 'Latitude', type: 'number' as const },
  { key: 'longitude', label: 'Longitude', type: 'number' as const },
  { key: 'open_time', label: 'Open Time', type: 'text' as const },
  { key: 'close_time', label: 'Close Time', type: 'text' as const },
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'approved', label: 'Approved' },
      { value: 'rejected', label: 'Rejected' },
    ],
  },
  { key: 'images', label: 'Images (JSON array)', type: 'textarea' as const },
];

const columns = [
  { key: 'id' as keyof Shop, label: 'ID' },
  { key: 'name' as keyof Shop, label: 'Name' },
  { key: 'address' as keyof Shop, label: 'Address' },
  { key: 'status' as keyof Shop, label: 'Status' },
  { key: 'owner_id' as keyof Shop, label: 'Owner ID' },
  { key: 'category_id' as keyof Shop, label: 'Category ID' },
  {
    key: 'images' as keyof Shop,
    label: 'Images',
    render: (value: string[]) => `${value.length} images`,
  },
  {
    key: 'created_at' as keyof Shop,
    label: 'Created',
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
];

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = () => {
    setShops(shopAPI.getAll());
  };

  const handleAdd = () => {
    setEditingShop(null);
    setIsModalOpen(true);
  };

  const handleEdit = (shop: Shop) => {
    setEditingShop(shop);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    shopAPI.delete(id);
    loadShops();
    addToast('Shop deleted successfully', 'success');
  };

  const handleSubmit = (data: Record<string, any>) => {
    try {
      // Parse images JSON
      if (data.images && typeof data.images === 'string') {
        try {
          data.images = JSON.parse(data.images);
        } catch {
          data.images = [];
        }
      }

      if (editingShop) {
        shopAPI.update(editingShop.id, data as any);
        addToast('Shop updated successfully', 'success');
      } else {
        shopAPI.create(data as any);
        addToast('Shop created successfully', 'success');
      }
      loadShops();
      setIsModalOpen(false);
    } catch (error) {
      addToast('An error occurred', 'error');
    }
  };

  return (
    <AdminLayout title="Shops">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Manage Shops</h2>
            <p className="text-gray-600">Add, edit, or delete restaurant/shop listings</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Shop
          </button>
        </div>

        <DataTable
          data={shops}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ModalForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          title={editingShop ? 'Edit Shop' : 'Add Shop'}
          fields={fields}
          initialData={editingShop ? { ...editingShop, images: JSON.stringify(editingShop.images) } : {}}
        />

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </AdminLayout>
  );
}
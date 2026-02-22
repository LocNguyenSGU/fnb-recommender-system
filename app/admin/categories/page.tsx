'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import DataTable from '@/components/Admin/DataTable';
import ModalForm from '@/components/Admin/ModalForm';
import { ToastContainer, useToast } from '@/components/Admin/Toast';
import { categoryAPI } from '@/lib/api';
import { Category } from '@/lib/types';

const fields = [
  { key: 'name', label: 'Name', type: 'text' as const, required: true },
  { key: 'description', label: 'Description', type: 'textarea' as const },
];

const columns = [
  { key: 'id' as keyof Category, label: 'ID' },
  { key: 'name' as keyof Category, label: 'Name' },
  { key: 'description' as keyof Category, label: 'Description' },
  {
    key: 'created_at' as keyof Category,
    label: 'Created',
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    setCategories(categoryAPI.getAll());
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    categoryAPI.delete(id);
    loadCategories();
    addToast('Category deleted successfully', 'success');
  };

  const handleSubmit = (data: Record<string, any>) => {
    try {
      if (editingCategory) {
        categoryAPI.update(editingCategory.id, data as any);
        addToast('Category updated successfully', 'success');
      } else {
        categoryAPI.create(data as any);
        addToast('Category created successfully', 'success');
      }
      loadCategories();
      setIsModalOpen(false);
    } catch (error) {
      addToast('An error occurred', 'error');
    }
  };

  return (
    <AdminLayout title="Categories">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Manage Categories</h2>
            <p className="text-gray-600">Add, edit, or delete food categories</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Category
          </button>
        </div>

        <DataTable
          data={categories}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ModalForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          title={editingCategory ? 'Edit Category' : 'Add Category'}
          fields={fields}
          initialData={editingCategory || {}}
        />

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </AdminLayout>
  );
}
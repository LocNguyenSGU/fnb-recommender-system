'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import DataTable from '@/components/Admin/DataTable';
import ModalForm from '@/components/Admin/ModalForm';
import { ToastContainer, useToast } from '@/components/Admin/Toast';
import reviewsApi from '@/lib/reviews';
import { Review } from '@/lib/types';

const fields = [
  { key: 'userId', label: 'User ID', type: 'number' as const, required: true },
  { key: 'shopId', label: 'Shop ID', type: 'number' as const, required: true },
  {
    key: 'rating',
    label: 'Rating',
    type: 'select' as const,
    required: true,
    options: [
      { value: 1, label: '1 Star' },
      { value: 2, label: '2 Stars' },
      { value: 3, label: '3 Stars' },
      { value: 4, label: '4 Stars' },
      { value: 5, label: '5 Stars' },
    ],
  },
  { key: 'content', label: 'Content', type: 'textarea' as const },
  { key: 'replies', label: 'Replies (JSON array)', type: 'textarea' as const },
];

const columns = [
  { key: 'id' as keyof Review, label: 'ID' },
  { key: 'rating' as keyof Review, label: 'Rating', render: (value: number) => `${value} ⭐` },
  { key: 'content' as keyof Review, label: 'Content', render: (value: string) => value.length > 50 ? `${value.substring(0, 50)}...` : value },
  { key: 'userId' as keyof Review, label: 'User ID' },
  { key: 'shopId' as keyof Review, label: 'Shop ID' },
  {
    key: 'createdAt' as keyof Review,
    label: 'Created',
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await (reviewsApi as any).getAll();
      setReviews(response.data);
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingReview(null);
    setIsModalOpen(true);
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await (reviewsApi as any).remove(id);
      addToast('Review deleted successfully', 'success');
      loadReviews();
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Failed to delete review', 'error');
    }
  };

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      if (data.replies && typeof data.replies === 'string') {
        try {
          data.replies = JSON.parse(data.replies);
        } catch {
          data.replies = [];
        }
      }

      if (editingReview) {
        await (reviewsApi as any).update(editingReview.id, data);
        addToast('Review updated successfully', 'success');
      } else {
        await (reviewsApi as any).create(data);
        addToast('Review created successfully', 'success');
      }
      loadReviews();
      setIsModalOpen(false);
    } catch (error: any) {
      addToast(error.response?.data?.message || 'An error occurred', 'error');
    }
  };

  return (
    <AdminLayout title="Reviews">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Manage Reviews</h2>
            <p className="text-gray-600">Add, edit, or delete customer reviews</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Review
          </button>
        </div>

        <DataTable
          data={reviews}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

        <ModalForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          title={editingReview ? 'Edit Review' : 'Add Review'}
          fields={fields}
          initialData={editingReview ? { ...editingReview, replies: JSON.stringify(editingReview.replies) } : {}}
        />

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </AdminLayout>
  );
}
'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import DataTable from '@/components/Admin/DataTable';
import ModalForm from '@/components/Admin/ModalForm';
import { ToastContainer, useToast } from '@/components/Admin/Toast';
import commentsApi from '@/lib/comments';
import { BlogComment } from '@/lib/types';

const fields = [
  { key: 'blogId', label: 'Blog ID', type: 'number' as const, required: true },
  { key: 'userId', label: 'User ID', type: 'number' as const, required: true },
  { key: 'content', label: 'Content', type: 'textarea' as const, required: true },
  { key: 'replies', label: 'Replies (JSON array)', type: 'textarea' as const },
];

const columns = [
  { key: 'id' as keyof BlogComment, label: 'ID' },
  { key: 'content' as keyof BlogComment, label: 'Content', render: (value: string) => value.length > 50 ? `${value.substring(0, 50)}...` : value },
  { key: 'blogId' as keyof BlogComment, label: 'Blog ID' },
  { key: 'userId' as keyof BlogComment, label: 'User ID' },
  {
    key: 'createdAt' as keyof BlogComment,
    label: 'Created',
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
];

export default function CommentsPage() {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<BlogComment | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await (commentsApi as any).getAll();
      setComments(data);
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Failed to load comments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingComment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (comment: BlogComment) => {
    setEditingComment(comment);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await (commentsApi as any).remove(id);
      loadComments();
      addToast('Comment deleted successfully', 'success');
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Failed to delete comment', 'error');
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

      if (editingComment) {
        await (commentsApi as any).update(editingComment.id, data);
        addToast('Comment updated successfully', 'success');
      } else {
        await (commentsApi as any).create(data);
        addToast('Comment created successfully', 'success');
      }
      loadComments();
      setIsModalOpen(false);
    } catch (error: any) {
      addToast(error.response?.data?.message || 'An error occurred', 'error');
    }
  };

  return (
    <AdminLayout title="Comments">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Manage Comments</h2>
            <p className="text-gray-600">Add, edit, or delete blog comments</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Comment
          </button>
        </div>

        <DataTable
          data={comments}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

        <ModalForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          title={editingComment ? 'Edit Comment' : 'Add Comment'}
          fields={fields}
          initialData={editingComment ? { ...editingComment, replies: JSON.stringify(editingComment.replies) } : {}}
        />

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </AdminLayout>
  );
}
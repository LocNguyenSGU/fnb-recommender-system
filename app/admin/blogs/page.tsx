'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import DataTable from '@/components/Admin/DataTable';
import ModalForm from '@/components/Admin/ModalForm';
import { ToastContainer, useToast } from '@/components/Admin/Toast';
import { blogAPI } from '@/lib/api';
import { Blog } from '@/lib/types';

const fields = [
  { key: 'author_id', label: 'Author ID', type: 'number' as const, required: true },
  { key: 'title', label: 'Title', type: 'text' as const, required: true },
  { key: 'content', label: 'Content', type: 'textarea' as const },
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'published', label: 'Published' },
      { value: 'draft', label: 'Draft' },
    ],
  },
  { key: 'images', label: 'Images (JSON array)', type: 'textarea' as const },
  { key: 'likes_count', label: 'Likes Count', type: 'number' as const },
];

const columns = [
  { key: 'id' as keyof Blog, label: 'ID' },
  { key: 'title' as keyof Blog, label: 'Title', render: (value: string) => value.length > 30 ? `${value.substring(0, 30)}...` : value },
  { key: 'status' as keyof Blog, label: 'Status' },
  { key: 'author_id' as keyof Blog, label: 'Author ID' },
  { key: 'likes_count' as keyof Blog, label: 'Likes' },
  {
    key: 'created_at' as keyof Blog,
    label: 'Created',
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = () => {
    setBlogs(blogAPI.getAll());
  };

  const handleAdd = () => {
    setEditingBlog(null);
    setIsModalOpen(true);
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    blogAPI.delete(id);
    loadBlogs();
    addToast('Blog deleted successfully', 'success');
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

      if (editingBlog) {
        blogAPI.update(editingBlog.id, data as any);
        addToast('Blog updated successfully', 'success');
      } else {
        blogAPI.create(data as any);
        addToast('Blog created successfully', 'success');
      }
      loadBlogs();
      setIsModalOpen(false);
    } catch (error) {
      addToast('An error occurred', 'error');
    }
  };

  return (
    <AdminLayout title="Blogs">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Manage Blogs</h2>
            <p className="text-gray-600">Add, edit, or delete blog posts</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Blog
          </button>
        </div>

        <DataTable
          data={blogs}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ModalForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          title={editingBlog ? 'Edit Blog' : 'Add Blog'}
          fields={fields}
          initialData={editingBlog ? { ...editingBlog, images: JSON.stringify(editingBlog.images) } : {}}
        />

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </AdminLayout>
  );
}
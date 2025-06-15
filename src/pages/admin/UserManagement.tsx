// src/pages/admin/UserManagement.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import UserManagement from '@/components/admin/UserManagement';
import { fetchCurrentAdmin } from '@/api/admin';
import type { AdminUser } from '@/types/admin';

export default function UserManagementPage() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize admin data (same pattern as AdminDashboard)
  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        const adminResponse = await fetchCurrentAdmin();
        if (adminResponse.data.status === 'success') {
          setAdmin(adminResponse.data.admin);
        } else {
          navigate('/admin/login', { replace: true });
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          navigate('/admin/login', { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAdmin();
  }, [navigate]);

  const handleLogout = () => {
    navigate('/admin/login', { replace: true });
  };

  if (isLoading || !admin) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AdminLayout admin={admin} onLogout={handleLogout}>
      <UserManagement />
    </AdminLayout>
  );
}
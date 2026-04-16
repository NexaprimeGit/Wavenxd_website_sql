'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TrafficGraph from './../../components/admin/TrafficGraph';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.replace('/admin-7f4b9c/login');
    }
  }, [router]);

  return (
    <div className="space-y-6">
      <TrafficGraph />
    </div>
  );
}

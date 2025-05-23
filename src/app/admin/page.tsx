'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  ShoppingCart, 
  Package, 
  Tag,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { API_ROUTES } from '@/lib/constants';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalItems: number;
  totalCategories: number;
  totalRevenue: number;
  recentOrders: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalItems: 0,
    totalCategories: 0,
    totalRevenue: 0,
    recentOrders: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real application, you would have an API endpoint for dashboard stats
        // For now, we'll fetch individual data
        const [users, orders, items, categories] = await Promise.all([
          fetch(API_ROUTES.USERS).then(res => res.json()),
          fetch(API_ROUTES.ORDERS).then(res => res.json()),
          fetch(API_ROUTES.ITEMS).then(res => res.json()),
          fetch(API_ROUTES.CATEGORIES).then(res => res.json()),
        ]);

        setStats({
          totalUsers: users.length,
          totalOrders: orders.length,
          totalItems: items.length,
          totalCategories: categories.length,
          totalRevenue: orders.reduce((sum: number, order: any) => sum + order.total, 0),
          recentOrders: orders.slice(0, 5),
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      title: 'Total Items',
      value: stats.totalItems,
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Categories',
      value: stats.totalCategories,
      icon: Tag,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="p-6 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customer?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
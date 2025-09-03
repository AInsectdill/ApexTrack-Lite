import React, { useState, useEffect } from 'react';
import { BarChart, TrendingUp, Users, DollarSign } from 'lucide-react';
import { apiClient } from '../config/api';
import { DashboardData } from '../types';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.get('/dashboard');
      setData(response);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-6 md:p-10 lg:p-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-10 lg:p-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 lg:p-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Clicks Today</p>
              <p className="text-2xl font-bold">{data?.summary.today_clicks?.toLocaleString() || 0}</p>
            </div>
            <BarChart className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Conversions Today</p>
              <p className="text-2xl font-bold">{data?.summary.today_leads?.toLocaleString() || 0}</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Revenue Today</p>
              <p className="text-2xl font-bold">${data?.summary.today_revenue?.toFixed(2) || '0.00'}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">EPC Today</p>
              <p className="text-2xl font-bold">${data?.summary.today_epc?.toFixed(2) || '0.00'}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Clicks</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-600 font-medium">Sub ID</th>
                  <th className="text-left py-2 text-gray-600 font-medium">Country</th>
                  <th className="text-left py-2 text-gray-600 font-medium">Device</th>
                  <th className="text-left py-2 text-gray-600 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {data?.recent_clicks?.slice(0, 5).map((click, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 text-gray-900">{click.sub_id || 'N/A'}</td>
                    <td className="py-2 text-gray-600">{click.country_code || 'N/A'}</td>
                    <td className="py-2 text-gray-600">{click.device_type || 'N/A'}</td>
                    <td className="py-2 text-gray-600">
                      {click.created_at ? new Date(click.created_at).toLocaleTimeString() : 'N/A'}
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500">
                      No recent clicks
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Conversions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-600 font-medium">Sub ID</th>
                  <th className="text-left py-2 text-gray-600 font-medium">Revenue</th>
                  <th className="text-left py-2 text-gray-600 font-medium">Country</th>
                  <th className="text-left py-2 text-gray-600 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {data?.recent_leads?.slice(0, 5).map((lead, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 text-gray-900">{lead.sub_id || 'N/A'}</td>
                    <td className="py-2 text-green-600 font-semibold">${lead.payout || '0.00'}</td>
                    <td className="py-2 text-gray-600">{lead.country_code || 'N/A'}</td>
                    <td className="py-2 text-gray-600">
                      {lead.created_at ? new Date(lead.created_at).toLocaleTimeString() : 'N/A'}
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500">
                      No recent conversions
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
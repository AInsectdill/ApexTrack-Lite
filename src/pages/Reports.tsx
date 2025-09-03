import React, { useState, useEffect } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { apiClient } from '../config/api';

const Reports: React.FC = () => {
  const [activeView, setActiveView] = useState('advance');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    username: 'all',
    breakdown_by: 'country_code',
  });

  const fetchReportData = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const data = await apiClient.get(`/reports/${activeView}?${params.toString()}`);
      setReportData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [activeView]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReportData();
  };

  const tabs = [
    { id: 'advance', label: 'Advance' },
    { id: 'clicks', label: 'Clicks' },
    { id: 'leads', label: 'Conversions' },
    { id: 'breakdown', label: 'Breakdown' },
  ];

  return (
    <div className="p-6 md:p-10 lg:p-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Reports</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => setFilters(prev => ({ ...prev, start_date: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => setFilters(prev => ({ ...prev, end_date: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={filters.username}
              onChange={(e) => setFilters(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>{loading ? 'Loading...' : 'Apply Filters'}</span>
          </button>
        </form>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {error && (
          <div className="p-6 bg-red-100 border border-red-400 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading report data...</p>
          </div>
        ) : reportData?.data?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {activeView === 'advance' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sub ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hits</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unique</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CR (%)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Payout</th>
                    </>
                  )}
                  {activeView === 'clicks' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sub ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
                    </>
                  )}
                  {activeView === 'leads' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sub ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payout</th>
                    </>
                  )}
                  {activeView === 'breakdown' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dimension</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hits</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unique</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CR (%)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payout</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.data.map((row: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {activeView === 'advance' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.hits}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.unique_clicks}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.leads}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.approved_leads}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.cr}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${row.total_payout}</td>
                      </>
                    )}
                    {activeView === 'clicks' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(row.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.ip_address}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.country_code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.device_type}</td>
                      </>
                    )}
                    {activeView === 'leads' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(row.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.click_subid}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.click_country_code}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            row.status === 'approved' ? 'bg-green-100 text-green-800' :
                            row.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${row.payout}</td>
                      </>
                    )}
                    {activeView === 'breakdown' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.dimension_value}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.hits}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.unique_clicks}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.leads}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.cr}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${row.total_payout}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No data available for the selected filters
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
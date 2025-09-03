import React, { useState, useEffect } from 'react'
import { BarChart, TrendingUp, Users, DollarSign } from 'lucide-react'
import Layout from '../components/Layout'
import { dashboardAPI, DashboardData } from '../lib/api'
import { formatCurrency, formatNumber, formatDate } from '../lib/utils'

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const response = await dashboardAPI.getData()
      setData(response.data)
      setError('')
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error)
      setError(error.response?.data?.message || 'Gagal memuat data dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading && !data) {
    return (
      <Layout>
        <div className="p-6 md:p-10 lg:p-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-6 md:p-10 lg:p-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="card bg-blue-100 text-blue-800 border-l-4 border-blue-500">
            <div className="flex items-center mb-1">
              <BarChart className="w-5 h-5 mr-2" />
              <h3 className="text-sm font-semibold uppercase">Clicks Today</h3>
            </div>
            <div className="text-2xl font-bold">
              {formatNumber(data?.summary.today_clicks || 0)}
            </div>
          </div>
          
          <div className="card bg-purple-100 text-purple-800 border-l-4 border-purple-500">
            <div className="flex items-center mb-1">
              <Users className="w-5 h-5 mr-2" />
              <h3 className="text-sm font-semibold uppercase">Conversions Today</h3>
            </div>
            <div className="text-2xl font-bold">
              {formatNumber(data?.summary.today_leads || 0)}
            </div>
          </div>
          
          <div className="card bg-orange-100 text-orange-800 border-l-4 border-orange-500">
            <div className="flex items-center mb-1">
              <DollarSign className="w-5 h-5 mr-2" />
              <h3 className="text-sm font-semibold uppercase">Revenue Today</h3>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(data?.summary.today_revenue || 0)}
            </div>
          </div>
          
          <div className="card bg-green-100 text-green-800 border-l-4 border-green-500">
            <div className="flex items-center mb-1">
              <TrendingUp className="w-5 h-5 mr-2" />
              <h3 className="text-sm font-semibold uppercase">EPC Today</h3>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(data?.summary.today_epc || 0)}
            </div>
          </div>
        </div>

        {/* Recent Clicks Table */}
        <div className="card mt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Clicks</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-sm text-gray-500 font-semibold uppercase border border-gray-300">Sub ID</th>
                  <th className="py-2 px-4 text-sm text-gray-500 font-semibold uppercase border border-gray-300">Offer Name</th>
                  <th className="py-2 px-4 text-sm text-gray-500 font-semibold uppercase border border-gray-300">IP Address</th>
                  <th className="py-2 px-4 text-sm text-gray-500 font-semibold uppercase border border-gray-300">Country</th>
                  <th className="py-2 px-4 text-sm text-gray-500 font-semibold uppercase border border-gray-300">OS</th>
                  <th className="py-2 px-4 text-sm text-gray-500 font-semibold uppercase border border-gray-300">Device</th>
                  <th className="py-2 px-4 text-sm text-gray-500 font-semibold uppercase border border-gray-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.recent_clicks?.length ? (
                  data.recent_clicks.map((click, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-700 border border-gray-300">{click.sub_id}</td>
                      <td className="py-3 px-4 text-sm text-gray-700 border border-gray-300">{click.offer_name}</td>
                      <td className="py-3 px-4 text-sm text-gray-700 border border-gray-300">{click.ip_address}</td>
                      <td className="py-3 px-4 text-sm text-gray-700 border border-gray-300">{click.country_code}</td>
                      <td className="py-3 px-4 text-sm text-gray-700 border border-gray-300">{click.os}</td>
                      <td className="py-3 px-4 text-sm text-gray-700 border border-gray-300">{click.device_type}</td>
                      <td className="py-3 px-4 text-sm text-gray-700 border border-gray-300">{formatDate(click.created_at)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500 py-4 border border-gray-300">
                      Tidak ada klik terbaru hari ini
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance and Conversions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Performance Report */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Report</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-sm text-gray-500 font-semibold uppercase border border-gray-300">Sub ID</th>
                    <th className="py-2 px-4 text-sm text-gray-500 font-semibold uppercase border border-gray-300">Hits</th>
                    <th className="py-2 px-4 text-sm text-gray-500 font-semibold uppercase border border-gray-300">Conversions</th>
                    <th className="py-2 px-4 text-sm text-gray-500 font-semibold uppercase border border-gray-300">Revenue</th>
                    <th className="py-2 px-4 text-sm text-gray-500 font-semibold uppercase border border-gray-300">CR (%)</th>
                    <th className="py-2 px-4 text-sm text-gray-500 font-semibold uppercase border border-gray-300">EPC ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.performance_report?.length ? (
                    data.performance_report.map((report, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-700 border border-gray-300">{report.sub_id}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 border border-gray-300">{formatNumber(report.hits)}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 border border-gray-300">{formatNumber(report.conversions)}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 border border-gray-300">{formatCurrency(report.revenue)}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 border border-gray-300">{report.cr.toFixed(2)}%</td>
                        <td className="py-3 px-4 text-sm text-gray-700 border border-gray-300">{formatCurrency(report.epc)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-500 py-4 border border-gray-300">
                        Tidak ada data untuk laporan kinerja
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Conversions */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Conversions</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-sm text-gray-500 font-semibold uppercase border border-gray-300">Sub ID</th>
                    <th className="py-2 px-4 text-sm text-gray-500 font-semibold uppercase border border-gray-300">Revenue</th>
                    <th className="py-2 px-4 text-sm text-gray-500 font-semibold uppercase border border-gray-300">Country</th>
                    <th className="py-2 px-4 text-sm text-gray-500 font-semibold uppercase border border-gray-300">Device</th>
                    <th className="py-2 px-4 text-sm text-gray-500 font-semibold uppercase border border-gray-300">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.recent_leads?.length ? (
                    data.recent_leads.map((lead, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-700 border border-gray-300">{lead.sub_id}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 border border-gray-300">{formatCurrency(lead.payout)}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 border border-gray-300">{lead.country_code}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 border border-gray-300">{lead.device_type}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 border border-gray-300">{formatDate(lead.created_at)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-500 py-4 border border-gray-300">
                        Tidak ada konversi terbaru hari ini
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
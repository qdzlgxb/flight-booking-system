import React, { useState, useEffect } from 'react';
import { adminAPI, airportAPI } from '../services/api';
import type { Airport, Flight, Booking, Passenger } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'airports' | 'flights' | 'bookings'>('airports');
  const [airports, setAirports] = useState<Airport[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 机场表单
  const [airportForm, setAirportForm] = useState({
    code: '',
    name: '',
    city: ''
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      switch (activeTab) {
        case 'airports':
          const airportList = await airportAPI.getAllAirports();
          setAirports(airportList);
          break;
        case 'flights':
          const flightList = await adminAPI.getAllFlights();
          setFlights(flightList);
          break;
        case 'bookings':
          const bookingList = await adminAPI.getAllBookings();
          setBookings(bookingList);
          break;
      }
    } catch (err: any) {
      setError('获取数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAirport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminAPI.createAirport(airportForm);
      setAirportForm({ code: '', name: '', city: '' });
      loadData();
      alert('机场创建成功！');
    } catch (err: any) {
      alert('创建失败：' + (err.response?.data || err.message));
    }
  };

  const handleDeleteAirport = async (id: number) => {
    if (window.confirm('确定要删除这个机场吗？')) {
      try {
        await adminAPI.deleteAirport(id);
        loadData();
        alert('删除成功！');
      } catch (err: any) {
        alert('删除失败：' + (err.response?.data || err.message));
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">管理面板</h1>

      {/* 标签页 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'airports', label: '机场管理' },
            { key: 'flights', label: '航班管理' },
            { key: 'bookings', label: '订单管理' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="text-center py-4">
          <div className="text-lg">加载中...</div>
        </div>
      )}

      {/* 机场管理 */}
      {activeTab === 'airports' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">添加新机场</h2>
            <form onSubmit={handleCreateAirport} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="机场代码 (如: PEK)"
                value={airportForm.code}
                onChange={(e) => setAirportForm(prev => ({ ...prev, code: e.target.value }))}
                required
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="机场名称"
                value={airportForm.name}
                onChange={(e) => setAirportForm(prev => ({ ...prev, name: e.target.value }))}
                required
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="城市"
                value={airportForm.city}
                onChange={(e) => setAirportForm(prev => ({ ...prev, city: e.target.value }))}
                required
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                添加机场
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">机场列表</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">代码</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">城市</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {airports.map(airport => (
                    <tr key={airport.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{airport.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{airport.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{airport.city}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleDeleteAirport(airport.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 航班管理 */}
      {activeTab === 'flights' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">航班列表</h2>
            <div className="space-y-4">
              {flights.map(flight => (
                <div key={flight.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-lg font-semibold">{flight.flightNumber}</div>
                      <div className="text-gray-600">
                        {flight.departureAirport.code} → {flight.destinationAirport.code}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(flight.departureDate)} {formatTime(flight.departureTime)} - {formatTime(flight.arrivalTime)}
                      </div>
                      <div className="text-lg font-bold text-blue-600">¥{flight.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 订单管理 */}
      {activeTab === 'bookings' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">所有订单</h2>
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium">订单信息</h4>
                    <div className="text-sm text-gray-600">
                      <div>订单号: {booking.reference}</div>
                      <div>状态: {booking.status}</div>
                      <div>金额: ¥{booking.totalPrice}</div>
                      <div>时间: {formatDate(booking.bookingTime)}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">航班信息</h4>
                    <div className="text-sm text-gray-600">
                      <div>航班: {booking.flight.flightNumber}</div>
                      <div>{booking.flight.departureAirport.code} → {booking.flight.destinationAirport.code}</div>
                      <div>{formatDate(booking.flight.departureDate)} {formatTime(booking.flight.departureTime)}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">用户信息</h4>
                    <div className="text-sm text-gray-600">
                      <div>姓名: {booking.user.fullName}</div>
                      <div>用户名: {booking.user.username}</div>
                      <div>邮箱: {booking.user.email}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 
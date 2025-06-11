import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';
import type { Booking } from '../types';

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const userBookings = await bookingAPI.getUserBookings();
      setBookings(userBookings);
    } catch (err: any) {
      setError('获取订单失败');
      console.error('Failed to load bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // 只显示 HH:MM
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">我的订单</h1>
        <button
          onClick={loadBookings}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          刷新
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">暂无订单</div>
          <p className="text-gray-400 mt-2">去首页搜索航班并预订吧！</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    订单号: {booking.reference}
                  </h3>
                  <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                    booking.status === 'CONFIRMED' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status === 'CONFIRMED' ? '已确认' : booking.status}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-600">
                    ¥{booking.totalPrice}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(booking.bookingTime)}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">航班信息</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>航班号: {booking.flight.flightNumber}</div>
                      <div>
                        {booking.flight.departureAirport.code} ({booking.flight.departureAirport.name}) 
                        → {booking.flight.destinationAirport.code} ({booking.flight.destinationAirport.name})
                      </div>
                      <div>
                        出发: {formatDate(booking.flight.departureDate)} {formatTime(booking.flight.departureTime)}
                      </div>
                      <div>
                        到达: {formatTime(booking.flight.arrivalTime)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">乘客信息</h4>
                    <div className="text-sm text-gray-600">
                      <div>姓名: {booking.user.fullName}</div>
                      <div>邮箱: {booking.user.email}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingList; 
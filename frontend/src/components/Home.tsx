import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { flightAPI, airportAPI, bookingAPI } from '../services/api';
import type { Flight, Airport, FlightSearchRequest, BookingRequest } from '../types';

const Home: React.FC = () => {
  const [searchRequest, setSearchRequest] = useState<FlightSearchRequest>({
    flightNumber: '',
    departureAirportCode: '',
    destinationAirportCode: '',
  });
  const [flights, setFlights] = useState<Flight[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadAirports();
  }, []);

  const loadAirports = async () => {
    try {
      const airportList = await airportAPI.getAllAirports();
      setAirports(airportList);
    } catch (err) {
      console.error('Failed to load airports:', err);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const results = await flightAPI.searchFlights(searchRequest);
      setFlights(results);
    } catch (err: any) {
      setError('搜索失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = (flight: Flight) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedFlight(flight);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFlight) return;

    try {
      const request: BookingRequest = {
        flightId: selectedFlight.id,
        firstName: bookingData.firstName,
        lastName: bookingData.lastName,
        email: bookingData.email,
      };

      await bookingAPI.createBooking(request);
      alert('订票成功！');
      setShowBookingForm(false);
      setSelectedFlight(null);
      setBookingData({ firstName: '', lastName: '', email: '' });
    } catch (err: any) {
      alert('订票失败：' + (err.response?.data || err.message));
    }
  };

  return (
    <div className="space-y-8">
      {/* 标题 */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          航班购票系统
        </h1>
        <p className="text-lg text-gray-600">
          搜索您需要的航班并立即预订
        </p>
      </div>

      {/* 搜索表单 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">搜索航班</h2>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                航班号
              </label>
              <input
                type="text"
                name="flightNumber"
                value={searchRequest.flightNumber}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例如: CA1234"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                出发机场
              </label>
              <select
                name="departureAirportCode"
                value={searchRequest.departureAirportCode}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">选择出发机场</option>
                {airports.map(airport => (
                  <option key={airport.id} value={airport.code}>
                    {airport.code} - {airport.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                到达机场
              </label>
              <select
                name="destinationAirportCode"
                value={searchRequest.destinationAirportCode}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">选择到达机场</option>
                {airports.map(airport => (
                  <option key={airport.id} value={airport.code}>
                    {airport.code} - {airport.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? '搜索中...' : '搜索航班'}
          </button>
        </form>
      </div>

      {/* 错误信息 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* 搜索结果 */}
      {flights.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">搜索结果</h2>
          <div className="space-y-4">
            {flights.map(flight => (
              <div key={flight.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="text-lg font-semibold">
                      {flight.flightNumber}
                    </div>
                    <div className="text-gray-600">
                      {flight.departureAirport.code} → {flight.destinationAirport.code}
                    </div>
                    <div className="text-sm text-gray-500">
                      {flight.departureDate} {flight.departureTime} - {flight.arrivalTime}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">
                      ¥{flight.price}
                    </div>
                    <button
                      onClick={() => handleBooking(flight)}
                      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      {user ? '立即预订' : '登录预订'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 订票表单模态框 */}
      {showBookingForm && selectedFlight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              预订航班: {selectedFlight.flightNumber}
            </h3>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  名
                </label>
                <input
                  type="text"
                  value={bookingData.firstName}
                  onChange={(e) => setBookingData(prev => ({...prev, firstName: e.target.value}))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  姓
                </label>
                <input
                  type="text"
                  value={bookingData.lastName}
                  onChange={(e) => setBookingData(prev => ({...prev, lastName: e.target.value}))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  邮箱
                </label>
                <input
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => setBookingData(prev => ({...prev, email: e.target.value}))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  确认预订
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 
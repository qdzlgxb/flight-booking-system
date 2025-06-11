import axios from 'axios';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Flight,
  FlightSearchRequest,
  Airport,
  Booking,
  BookingRequest,
  Passenger
} from '../types';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 认证相关API
export const authAPI = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    api.post('/auth/login', data).then(res => res.data),
  
  register: (data: RegisterRequest): Promise<string> =>
    api.post('/auth/register', data).then(res => res.data),
};

// 航班相关API
export const flightAPI = {
  searchFlights: (data: FlightSearchRequest): Promise<Flight[]> =>
    api.post('/flights/search', data).then(res => res.data),
  
  getFlightById: (id: number): Promise<Flight> =>
    api.get(`/flights/${id}`).then(res => res.data),
};

// 机场相关API
export const airportAPI = {
  getAllAirports: (): Promise<Airport[]> =>
    api.get('/airports').then(res => res.data),
  
  getAirportById: (id: number): Promise<Airport> =>
    api.get(`/airports/${id}`).then(res => res.data),
};

// 订票相关API
export const bookingAPI = {
  createBooking: (data: BookingRequest): Promise<Booking> =>
    api.post('/bookings', data).then(res => res.data),
  
  getUserBookings: (): Promise<Booking[]> =>
    api.get('/bookings/my').then(res => res.data),
};

// 管理员相关API
export const adminAPI = {
  // 机场管理
  createAirport: (data: Omit<Airport, 'id'>): Promise<Airport> =>
    api.post('/admin/airports', data).then(res => res.data),
  
  deleteAirport: (id: number): Promise<string> =>
    api.delete(`/admin/airports/${id}`).then(res => res.data),
  
  // 航班管理
  getAllFlights: (): Promise<Flight[]> =>
    api.get('/admin/flights').then(res => res.data),
  
  createFlight: (data: Omit<Flight, 'id'>): Promise<Flight> =>
    api.post('/admin/flights', data).then(res => res.data),
  
  deleteFlight: (id: number): Promise<string> =>
    api.delete(`/admin/flights/${id}`).then(res => res.data),
  
  // 订单管理
  getAllBookings: (): Promise<Booking[]> =>
    api.get('/admin/bookings').then(res => res.data),
  
  getFlightPassengers: (flightId: number): Promise<Passenger[]> =>
    api.get(`/admin/flights/${flightId}/passengers`).then(res => res.data),
}; 
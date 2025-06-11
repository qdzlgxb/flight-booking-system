// 用户类型
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
}

// 认证响应类型
export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
}

// 登录请求类型
export interface LoginRequest {
  username: string;
  password: string;
}

// 注册请求类型
export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
}

// 机场类型
export interface Airport {
  id: number;
  code: string;
  name: string;
  city: string;
}

// 航班类型
export interface Flight {
  id: number;
  flightNumber: string;
  departureAirport: Airport;
  destinationAirport: Airport;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
}

// 航班搜索请求类型
export interface FlightSearchRequest {
  flightNumber?: string;
  departureAirportCode?: string;
  destinationAirportCode?: string;
}

// 订票请求类型
export interface BookingRequest {
  flightId: number;
  firstName: string;
  lastName: string;
  email: string;
}

// 乘客类型
export interface Passenger {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

// 订单类型
export interface Booking {
  id: number;
  user: User;
  flight: Flight;
  reference: string;
  status: string;
  bookingTime: string;
  totalPrice: number;
} 
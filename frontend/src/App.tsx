import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import BookingList from './components/BookingList';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={
            <Layout>
              <Login />
            </Layout>
          } />
          <Route path="/register" element={
            <Layout>
              <Register />
            </Layout>
          } />
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute>
              <Layout>
                <BookingList />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

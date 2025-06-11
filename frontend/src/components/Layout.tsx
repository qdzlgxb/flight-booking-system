import React from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold">
                航班购票系统
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/" className="hover:text-blue-200">
                首页
              </Link>
              
              {user ? (
                <>
                  <Link to="/bookings" className="hover:text-blue-200">
                    我的订单
                  </Link>
                  
                  {isAdmin() && (
                    <Link to="/admin" className="hover:text-blue-200">
                      管理面板
                    </Link>
                  )}
                  
                  <span className="text-blue-200">
                    欢迎, {user.fullName}
                  </span>
                  
                  <button
                    onClick={handleLogout}
                    className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
                  >
                    退出登录
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
                >
                  登录
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 航班购票系统. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 
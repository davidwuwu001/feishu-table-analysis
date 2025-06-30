'use client';

import { useState } from 'react';
import { User } from '@/lib/feishu';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<'老师' | '家长' | '管理员'>('家长');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      setError('请输入手机号');
      return;
    }

    // 简单的手机号格式验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError('请输入正确的手机号格式');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone.trim(),
          name: name.trim() || undefined,
          userType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setIsNewUser(data.isNewUser);
        setError('');
      } else {
        setError(data.error || '认证失败，请稍后重试');
      }
    } catch (err) {
      console.error('认证错误:', err);
      setError('网络错误，请检查网络连接后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUser(null);
    setIsNewUser(false);
    setPhone('');
    setName('');
    setUserType('家长');
    setError('');
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isNewUser ? '🎉 注册成功！' : '🔐 登录成功！'}
            </h2>
            <p className="text-gray-600">
              {isNewUser ? '欢迎加入飞书系统' : '欢迎回来'}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">姓名</span>
                <span className="font-medium text-gray-800">{user.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">手机号</span>
                <span className="font-medium text-gray-800">{user.phone}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">用户类型</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.userType === '老师' ? 'bg-blue-100 text-blue-800' :
                  user.userType === '管理员' ? 'bg-purple-100 text-purple-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.userType}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">状态</span>
                <span className="text-green-600 font-medium">已认证</span>
              </div>
            </div>

            {isNewUser && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">📝 新用户提示</h3>
                <p className="text-blue-700 text-sm">
                  您的账户已成功创建并存储在飞书多维表格中。此认证模块可以轻松集成到其他应用系统中。
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              重新认证
            </button>
            
            <div className="text-center text-sm text-gray-500">
              认证时间: {new Date(user.lastLoginTime).toLocaleString('zh-CN')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">飞书认证模块</h1>
          <p className="text-gray-600">基于飞书多维表格的用户认证系统</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              手机号 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入手机号"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/95 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              姓名 <span className="text-gray-400">(新用户选填)</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入姓名"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/95 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
              用户类型 <span className="text-gray-400">(新用户)</span>
            </label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value as '老师' | '家长' | '管理员')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/95 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            >
              <option value="家长">家长</option>
              <option value="老师">老师</option>
              <option value="管理员">管理员</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                认证中...
              </div>
            ) : (
              '登录 / 注册'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>🔒 数据安全存储在飞书多维表格</p>
          <p>📱 支持自动登录和新用户注册</p>
        </div>
      </div>
    </div>
  );
} 
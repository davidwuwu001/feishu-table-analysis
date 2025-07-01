'use client';

import { useState } from 'react';
import { User } from '@/lib/feishu';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
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
    setError('');
  };

  // 如果用户已登录，显示成功页面并准备跳转
  if (user) {
    // 保存用户信息到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // 3秒后自动跳转到dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 3000);
    }

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
              {isNewUser ? '欢迎加入AI工具平台' : '欢迎回来'}
            </p>
            <div className="mt-4 text-sm text-blue-600">
              3秒后自动跳转到主页...
            </div>
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
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🚀 AI工具平台</h1>
          <p className="text-gray-600">基于飞书多维表格的用户认证系统</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              手机号 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入手机号"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              姓名 <span className="text-gray-400">(选填)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入姓名"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !phone}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>处理中...</span>
              </>
            ) : (
              <>
                <span>🔐</span>
                <span>登录 / 注册</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>数据安全存储在飞书多维表格</span>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            支持自动登录和用户注册
          </div>
        </div>
      </div>
    </div>
  );
} 
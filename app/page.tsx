'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/feishu';

// 新闻数据类型
interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  heat: number;
  crawlTime: string;
  aiRelevance: '高' | '中' | '低' | '未分类';
  summary: string;
}

// AI工具类型
interface AITool {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  comingSoon?: boolean;
}

// AI工具数据
const AI_TOOLS: AITool[] = [
  {
    id: 'mindmap',
    name: '智能思维导图',
    description: '一键生成思维导图',
    icon: '🧠',
    color: 'bg-purple-500',
    comingSoon: true
  },
  {
    id: 'chat',
    name: 'AI对话助手',
    description: '智能对话问答',
    icon: '💬',
    color: 'bg-blue-500',
    comingSoon: true
  },
  {
    id: 'writing',
    name: 'AI写作助手',
    description: '智能文本生成',
    icon: '✍️',
    color: 'bg-green-500',
    comingSoon: true
  },
  {
    id: 'translation',
    name: 'AI翻译工具',
    description: '多语言智能翻译',
    icon: '🌐',
    color: 'bg-indigo-500',
    comingSoon: true
  },
  {
    id: 'summary',
    name: 'AI内容总结',
    description: '智能文档摘要',
    icon: '📝',
    color: 'bg-yellow-500',
    comingSoon: true
  },
  {
    id: 'analyzer',
    name: 'AI数据分析',
    description: '智能数据洞察',
    icon: '📊',
    color: 'bg-red-500',
    comingSoon: true
  }
];

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<'老师' | '家长' | '管理员'>('家长');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState('');
  
  // 新闻相关状态
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState('');

  // 获取新闻列表
  const fetchNews = async () => {
    setNewsLoading(true);
    setNewsError('');
    
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      
      if (data.success) {
        setNewsList(data.data.items || []);
      } else {
        setNewsError(data.error || '获取新闻失败');
      }
    } catch (err) {
      console.error('获取新闻错误:', err);
      setNewsError('网络连接失败，请稍后重试');
    } finally {
      setNewsLoading(false);
    }
  };

  // 用户登录成功后获取新闻
  useEffect(() => {
    if (user) {
      fetchNews();
    }
  }, [user]);

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
    setNewsList([]);
    setNewsError('');
  };

  // 格式化热度数值
  const formatHeat = (heat: number): string => {
    if (heat >= 10000000) {
      return `${(heat / 10000000).toFixed(1)}千万`;
    } else if (heat >= 10000) {
      return `${(heat / 10000).toFixed(1)}万`;
    }
    return heat.toString();
  };

  // 获取AI相关度颜色
  const getRelevanceColor = (relevance: string): string => {
    switch (relevance) {
      case '高': return 'bg-red-100 text-red-800';
      case '中': return 'bg-yellow-100 text-yellow-800';
      case '低': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取新闻来源颜色
  const getSourceColor = (source: string): string => {
    const colors = {
      '知乎热榜': 'bg-blue-100 text-blue-800',
      '36氪热榜': 'bg-purple-100 text-purple-800',
      'IT新闻': 'bg-green-100 text-green-800',
      '百度热点': 'bg-red-100 text-red-800',
      'B站热榜': 'bg-pink-100 text-pink-800'
    };
    return colors[source as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* 顶部导航栏 */}
        <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <h1 className="text-xl font-bold text-gray-800">AI新闻助手</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  欢迎，{user.name}
                </div>
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  退出登录
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 用户信息卡片 */}
          {isNewUser && (
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 mb-8 text-white">
              <h2 className="text-2xl font-bold mb-2">🎉 欢迎加入AI新闻助手！</h2>
              <p className="text-green-100">您的账户已成功创建，开始探索AI世界的最新动态吧！</p>
            </div>
          )}

          {/* AI工具区域 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-3">🚀</span>
              AI工具箱
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {AI_TOOLS.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 cursor-pointer relative"
                >
                  {tool.comingSoon && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      即将上线
                    </div>
                  )}
                  <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center text-2xl mb-3 mx-auto`}>
                    {tool.icon}
                  </div>
                  <h3 className="font-medium text-gray-800 text-center mb-1 text-sm">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-gray-500 text-center">
                    {tool.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 新闻区域 */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-3">📰</span>
                AI热点新闻
              </h2>
              <button
                onClick={fetchNews}
                disabled={newsLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <span>{newsLoading ? '刷新中...' : '刷新'}</span>
                <span className="text-lg">🔄</span>
              </button>
            </div>

            {newsError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">{newsError}</p>
              </div>
            )}

            {newsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">加载中...</span>
              </div>
            ) : (
              <div className="grid gap-6">
                {newsList.map((news) => (
                  <div
                    key={news.id}
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                          {news.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {news.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(news.source)}`}>
                          {news.source}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(news.aiRelevance)}`}>
                          AI相关度: {news.aiRelevance}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          🔥 {formatHeat(news.heat)}热度
                        </span>
                      </div>
                      
                      <a
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                      >
                        立即查看
                      </a>
                    </div>
                  </div>
                ))}

                {newsList.length === 0 && !newsLoading && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📰</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">暂无新闻</h3>
                    <p className="text-gray-500">点击刷新按钮获取最新AI新闻</p>
                  </div>
                )}
              </div>
            )}
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI新闻助手</h1>
          <p className="text-gray-600">基于飞书多维表格的AI新闻展示系统</p>
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
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                认证中...
              </div>
            ) : (
              '登录 / 注册'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>✨ 自动检测用户状态，新用户自动注册</p>
          <p className="mt-1">🔒 数据安全存储在飞书多维表格</p>
        </div>
      </div>
    </div>
  );
} 
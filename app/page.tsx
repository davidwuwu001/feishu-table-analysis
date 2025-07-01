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

interface LoginFormProps {
  onLogin: (phone: string) => void;
  isLoading: boolean;
  error: string | null;
}

function LoginForm({ onLogin, isLoading, error }: LoginFormProps) {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) {
      onLogin(phone.trim());
    }
  };

  // 检查是否是配置错误
  const isConfigError = error?.includes('用户数据表结构不匹配') || 
                       error?.includes('用户表配置缺失') || 
                       error?.includes('FieldNameNotFound');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo 和标题 */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">AI</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI新闻助手</h1>
          <p className="text-gray-600">智能新闻聚合，洞察AI前沿</p>
        </div>

        {/* 配置错误提示 */}
        {isConfigError && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  需要初始化用户认证表
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>系统检测到用户认证表尚未配置，请按照以下步骤初始化：</p>
                  <ol className="mt-2 list-decimal list-inside space-y-1">
                    <li>访问 <a href="https://base.feishu.cn/" target="_blank" rel="noopener noreferrer" className="underline">飞书多维表格</a></li>
                    <li>创建新应用："用户认证数据库"</li>
                    <li>按照<a href="/docs/setup-user-table.md" target="_blank" className="underline">详细指南</a>创建用户表</li>
                    <li>更新 .env.local 文件中的表格配置</li>
                    <li>重启开发服务器</li>
                  </ol>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => window.open('https://base.feishu.cn/', '_blank')}
                    className="text-sm font-medium text-yellow-800 underline hover:text-yellow-900"
                  >
                    前往飞书多维表格 →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 登录表单 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                手机号码
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入您的手机号"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                disabled={isLoading || isConfigError}
                maxLength={11}
              />
            </div>

            {error && !isConfigError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !phone.trim() || isConfigError}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  验证中...
                </span>
              ) : (
                '立即登录'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              首次使用将自动创建账户
            </p>
          </div>
        </div>

        {/* 功能介绍 */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>智能认证</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <span>AI新闻</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <span>工具箱</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <LoginForm onLogin={handleAuth} isLoading={loading} error={error} />
  );
} 
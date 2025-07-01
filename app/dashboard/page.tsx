'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/feishu';
import Link from 'next/link';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishTime: string;
  category: string;
  url: string;
  isHot?: boolean;
}

interface QuickTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  category: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [quickTools] = useState<QuickTool[]>([
    {
      id: '1',
      name: '思维导图生成',
      description: '一键将文本转换为可视化思维导图',
      icon: '🧠',
      href: '/tools/mindmap',
      category: '可视化'
    },
    {
      id: '2', 
      name: 'AI对话助手',
      description: '智能对话，支持多种大模型',
      icon: '💬',
      href: '/tools/chat',
      category: '对话'
    },
    {
      id: '3',
      name: '文档写作助手', 
      description: '智能生成和优化文档内容',
      icon: '✍️',
      href: '/tools/writing',
      category: '写作'
    },
    {
      id: '4',
      name: '代码生成器',
      description: '自然语言转代码，支持多种语言',
      icon: '💻',
      href: '/tools/code',
      category: '编程'
    },
    {
      id: '5',
      name: '图片处理',
      description: 'AI图片生成、编辑和优化',
      icon: '🖼️',
      href: '/tools/image',
      category: '图像'
    },
    {
      id: '6',
      name: 'Prompt模板库',
      description: '精选提示词模板，提升AI使用效果',
      icon: '📝',
      href: '/tools/prompts',
      category: '模板'
    }
  ]);

  useEffect(() => {
    // 获取用户信息
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    // 获取最新AI新闻
    fetchLatestNews();
  }, []);

  const fetchLatestNews = async () => {
    try {
      const response = await fetch('/api/news/latest');
      const data = await response.json();
      if (data.success) {
        setLatestNews(data.news.slice(0, 5)); // 显示最新5条
      }
    } catch (error) {
      console.error('获取新闻失败:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      '可视化': 'bg-blue-100 text-blue-800',
      '对话': 'bg-green-100 text-green-800', 
      '写作': 'bg-purple-100 text-purple-800',
      '编程': 'bg-orange-100 text-orange-800',
      '图像': 'bg-pink-100 text-pink-800',
      '模板': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 顶部欢迎区域 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🚀 AI工具平台
              </h1>
              <p className="text-gray-600 mt-1">
                {user ? `欢迎回来，${user.name}` : '欢迎使用AI工具集成平台'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/news"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                查看更多新闻 →
              </Link>
              <Link
                href="/profile"
                className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium"
              >
                {user?.name?.charAt(0) || 'U'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：快捷工具 */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                ⚡ 快捷工具
                <span className="ml-2 text-sm text-gray-500 font-normal">解决AI使用痛点</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    className="group bg-white rounded-xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md hover:border-blue-200 transition-all duration-200"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{tool.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {tool.description}
                        </p>
                        <div className="mt-3">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${getCategoryColor(tool.category)}`}>
                            {tool.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 使用统计 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                📊 今日使用概览
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-gray-500">工具使用次数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-sm text-gray-500">新闻阅读数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">5</div>
                  <div className="text-sm text-gray-500">保存模板数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-sm text-gray-500">分享内容数</div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：最新AI新闻 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/50 h-fit sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                📰 最新AI动态
                <span className="ml-auto">
                  <Link
                    href="/news"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    查看全部 →
                  </Link>
                </span>
              </h3>
              
              {latestNews.length > 0 ? (
                <div className="space-y-4">
                  {latestNews.map((news) => (
                    <div key={news.id} className="group cursor-pointer">
                      <div className="flex items-start space-x-3">
                        {news.isHot && (
                          <span className="text-red-500 text-sm">🔥</span>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 transition-colors">
                            {news.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {news.summary}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">{news.source}</span>
                            <span className="text-xs text-gray-400">{news.publishTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">📡</div>
                  <p className="text-gray-500 text-sm">正在获取最新AI资讯...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 底部导航 - 移动端 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 sm:hidden">
        <div className="flex justify-around">
          <Link href="/dashboard" className="flex flex-col items-center text-blue-600">
            <span className="text-xl">🏠</span>
            <span className="text-xs mt-1">首页</span>
          </Link>
          <Link href="/news" className="flex flex-col items-center text-gray-500">
            <span className="text-xl">📰</span>
            <span className="text-xs mt-1">新闻</span>
          </Link>
          <Link href="/tools" className="flex flex-col items-center text-gray-500">
            <span className="text-xl">🔧</span>
            <span className="text-xs mt-1">工具</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500">
            <span className="text-xl">👤</span>
            <span className="text-xs mt-1">我的</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 
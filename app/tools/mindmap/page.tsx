'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MindMapNode {
  id: string;
  text: string;
  children: MindMapNode[];
  level: number;
}

export default function MindMapGenerator() {
  const [inputText, setInputText] = useState('');
  const [mindMap, setMindMap] = useState<MindMapNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateMindMap = async () => {
    if (!inputText.trim()) {
      setError('请输入要转换的内容');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 模拟AI生成思维导图的过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 生成示例思维导图结构
      const generatedMap: MindMapNode = {
        id: 'root',
        text: extractMainTopic(inputText),
        level: 0,
        children: generateSubNodes(inputText)
      };

      setMindMap(generatedMap);
    } catch (err) {
      setError('生成失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const extractMainTopic = (text: string): string => {
    // 简单的主题提取逻辑
    const sentences = text.split(/[。！？.!?]/);
    return sentences[0]?.substring(0, 20) + '...' || '主题';
  };

  const generateSubNodes = (text: string): MindMapNode[] => {
    // 简单的子节点生成逻辑
    const sentences = text.split(/[。！？.!?]/).filter(s => s.trim());
    
    return sentences.slice(0, 5).map((sentence, index) => ({
      id: `node-${index}`,
      text: sentence.trim().substring(0, 15) + '...',
      level: 1,
      children: []
    }));
  };

  const renderMindMapNode = (node: MindMapNode, isRoot = false) => {
    const baseClasses = "relative p-4 rounded-lg border-2 transition-all duration-200";
    const levelColors = {
      0: "bg-blue-100 border-blue-300 text-blue-800", // 根节点
      1: "bg-green-100 border-green-300 text-green-800", // 一级节点
      2: "bg-purple-100 border-purple-300 text-purple-800" // 二级节点
    };

    return (
      <div key={node.id} className={`${isRoot ? 'text-center' : ''}`}>
        <div className={`${baseClasses} ${levelColors[node.level as keyof typeof levelColors]} 
          ${isRoot ? 'text-lg font-bold' : 'text-sm'} hover:shadow-md cursor-pointer`}>
          {node.text}
        </div>
        
        {node.children.length > 0 && (
          <div className={`mt-4 ${isRoot ? 'flex justify-center' : ''}`}>
            <div className={`${isRoot ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}`}>
              {node.children.map(child => renderMindMapNode(child))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 顶部导航 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← 返回首页
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">🧠 思维导图生成器</h1>
                <p className="text-gray-600 text-sm">将文本内容转换为可视化思维导图</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：输入区域 */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/50">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📝 输入内容</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    文本内容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="请输入您想要转换为思维导图的内容..."
                    className="w-full h-40 px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  onClick={generateMindMap}
                  disabled={loading || !inputText.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>生成中...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>生成思维导图</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 使用提示 */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 使用提示</h3>
              <ul className="text-blue-800 text-sm space-y-2">
                <li>• 输入任何文本内容，系统会自动提取关键信息</li>
                <li>• 支持中文和英文内容处理</li>
                <li>• 建议输入100-500字的内容获得最佳效果</li>
                <li>• 生成的思维导图可以导出为图片格式</li>
              </ul>
            </div>
          </div>

          {/* 右侧：思维导图显示区域 */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/50 min-h-[500px]">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">🎯 生成结果</h2>
              
              {mindMap ? (
                <div className="space-y-6">
                  {renderMindMapNode(mindMap, true)}
                  
                  <div className="flex justify-center space-x-4 pt-6 border-t border-gray-200">
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                      📥 导出PNG
                    </button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                      📋 复制链接
                    </button>
                    <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm">
                      💾 保存到我的
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <div className="text-6xl mb-4">🧠</div>
                  <p className="text-lg font-medium mb-2">准备生成思维导图</p>
                  <p className="text-sm">在左侧输入内容后点击生成按钮</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 底部导航 - 移动端 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 sm:hidden">
        <div className="flex justify-around">
          <Link href="/dashboard" className="flex flex-col items-center text-gray-500">
            <span className="text-xl">🏠</span>
            <span className="text-xs mt-1">首页</span>
          </Link>
          <Link href="/news" className="flex flex-col items-center text-gray-500">
            <span className="text-xl">📰</span>
            <span className="text-xs mt-1">新闻</span>
          </Link>
          <Link href="/tools" className="flex flex-col items-center text-blue-600">
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
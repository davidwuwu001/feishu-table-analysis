import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: 在配置好飞书表格后，从飞书多维表格获取真实数据
    // const newsData = await feishuService.getNewsFromTable('NEWS_TABLE_ID');
    
    // 当前返回模拟数据
    const mockNews = [
      {
        id: 'mock-1',
        title: 'OpenAI发布GPT-4 Turbo最新版本',
        summary: '新版本在推理能力和响应速度上有显著提升，同时降低了API调用成本。',
        source: 'OpenAI官方',
        publishTime: '2小时前',
        category: '产品发布',
        url: 'https://openai.com',
        isHot: true
      },
      {
        id: 'mock-2', 
        title: 'Google Gemini Ultra在多模态理解上取得突破',
        summary: '最新研究显示Gemini Ultra在图像理解和文本生成的结合上表现出色。',
        source: 'Google DeepMind',
        publishTime: '4小时前',
        category: '技术更新',
        url: 'https://deepmind.google',
        isHot: false
      },
      {
        id: 'mock-3',
        title: '微软Copilot集成到更多Office应用',
        summary: 'Copilot现已支持PowerPoint和Excel的高级自动化功能。',
        source: '微软官方',
        publishTime: '6小时前',
        category: '产品发布',
        url: 'https://microsoft.com',
        isHot: false
      },
      {
        id: 'mock-4',
        title: 'AI绘画工具Midjourney V6正式发布',
        summary: '新版本支持更精细的图像控制和更快的生成速度。',
        source: 'Midjourney',
        publishTime: '1天前',
        category: '产品发布',
        url: 'https://midjourney.com',
        isHot: true
      },
      {
        id: 'mock-5',
        title: '欧盟通过AI法案最终版本',
        summary: '新法案将在2024年生效，对AI应用制定了严格的监管框架。',
        source: '欧盟委员会',
        publishTime: '2天前',
        category: '政策法规',
        url: 'https://ec.europa.eu',
        isHot: false
      },
      {
        id: 'mock-6',
        title: 'Claude 3发布，多模态能力大幅提升',
        summary: 'Anthropic发布的Claude 3在文本理解和推理能力上有重大突破。',
        source: 'Anthropic',
        publishTime: '3天前',
        category: '技术更新',
        url: 'https://anthropic.com',
        isHot: true
      },
      {
        id: 'mock-7',
        title: 'Meta推出Code Llama编程助手',
        summary: '专为编程任务优化的大语言模型，支持多种编程语言。',
        source: 'Meta AI',
        publishTime: '4天前',
        category: '产品发布',
        url: 'https://ai.meta.com',
        isHot: false
      },
      {
        id: 'mock-8',
        title: '国内AI大模型市场竞争加剧',
        summary: '百度、阿里、腾讯等科技公司纷纷发布自研大模型产品。',
        source: '科技日报',
        publishTime: '5天前',
        category: '行业动态',
        url: 'https://tech.com',
        isHot: false
      }
    ];

    return NextResponse.json({
      success: true,
      news: mockNews
    });

  } catch (error) {
    console.error('获取新闻失败:', error);
    
    return NextResponse.json({
      success: false,
      error: '获取新闻失败，请稍后重试'
    }, { status: 500 });
  }
}

// 格式化相对时间
function formatRelativeTime(timestamp: string): string {
  if (!timestamp) return '未知时间';
  
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return '刚刚';
  if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}小时前`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}天前`;
  
  return time.toLocaleDateString('zh-CN');
} 
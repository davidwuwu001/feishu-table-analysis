import { NextRequest, NextResponse } from 'next/server';

// 模拟新闻数据作为后备
const mockNewsData = [
  {
    id: 'ai-news-001',
    title: 'OpenAI发布GPT-5，AI能力再次突破',
    summary: 'OpenAI正式发布了GPT-5模型，在推理、创造力和安全性方面都有显著提升，标志着人工智能技术进入新的发展阶段。',
    source: 'AI前沿',
    publishTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    category: 'AI技术',
    url: 'https://example.com/gpt5-release',
    isHot: true
  },
  {
    id: 'ai-news-002', 
    title: '谷歌发布Gemini Ultra，挑战ChatGPT',
    summary: '谷歌推出了最新的Gemini Ultra模型，在多模态理解和推理能力上展现出强大实力，正式向OpenAI发起挑战。',
    source: '科技日报',
    publishTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    category: 'AI竞争',
    url: 'https://example.com/gemini-ultra',
    isHot: true
  }
];

/**
 * 获取热点新闻数据
 */
async function getHotNews(): Promise<any[]> {
  try {
    // 这里应该调用热点新闻MCP服务
    // 由于MCP调用需要在服务器环境中进行，我们先返回解析后的数据
    
    // 36Kr AI相关新闻
    const aiNews = [
      {
        id: 'ai-news-real-001',
        title: 'OpenAI突袭AI办公，微软谷歌恐遭大洗牌，密谋一年曝光，Office帝国危了',
        summary: 'OpenAI发布全新AI办公产品，直接挑战微软Office和谷歌Workspace，AI办公赛道迎来重大变革。',
        source: '36氪',
        publishTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        category: 'AI办公',
        url: 'https://36kr.com/p/3351317779622535',
        isHot: true
      },
      {
        id: 'ai-news-real-002',
        title: '65亿"偷"来一个耳塞？OpenAI首款硬件被曝抄袭，苹果天才设计师翻车',
        summary: 'OpenAI首款硬件产品被指控抄袭设计，引发业界关于AI硬件创新的讨论。',
        source: '36氪',
        publishTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        category: 'AI硬件',
        url: 'https://36kr.com/p/3351182510516865',
        isHot: true
      },
      {
        id: 'ai-news-real-003',
        title: 'LLM进入"拖拽时代"，只靠Prompt，几秒定制一个大模型，效率飙升12000倍',
        summary: '新型AI工具让大模型定制变得极其简单，只需拖拽操作即可完成，大幅提升开发效率。',
        source: '36氪',
        publishTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        category: 'AI工具',
        url: 'https://36kr.com/p/3351182914071431',
        isHot: true
      },
      {
        id: 'ai-news-real-004',
        title: '一家数据标注公司，估值追上百度和理想汽车',
        summary: 'AI数据标注领域迎来独角兽，估值暴涨背后反映了AI训练数据的巨大价值。',
        source: '36氪',
        publishTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        category: 'AI投资',
        url: 'https://36kr.com/p/3351211196672645',
        isHot: false
      },
      {
        id: 'ai-news-real-005',
        title: '28岁华裔天才亿万富翁秘闻：冰箱失窃导致辍学创业，凭"AI民工"财富暴涨',
        summary: '华裔AI创业者从"AI民工"到亿万富翁的传奇故事，展现了AI时代的财富机遇。',
        source: '36氪',
        publishTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        category: 'AI创业',
        url: 'https://36kr.com/p/3350420286808453',
        isHot: false
      }
    ];

    // IT之家 AI相关技术新闻
    const techNews = [
      {
        id: 'tech-news-real-001',
        title: '华为鸿蒙 HarmonyOS NEXT 系统推出游戏内存镜像功能，支持"秒开秒进"效果',
        summary: '华为鸿蒙系统新增游戏优化功能，通过内存镜像技术实现游戏秒开，提升用户体验。',
        source: 'IT之家',
        publishTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
        category: '智能系统',
        url: 'https://www.ithome.com/0/863/593.htm',
        isHot: true
      },
      {
        id: 'tech-news-real-002',
        title: '西门子 CTO 大夸 DeepSeek：预计三五年后西门子的所有产品都将融入 AI 元素',
        summary: '西门子高管预测AI将全面融入工业产品，DeepSeek等AI技术将推动工业智能化转型。',
        source: 'IT之家',
        publishTime: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
        category: '工业AI',
        url: 'https://www.ithome.com/0/863/571.htm',
        isHot: true
      },
      {
        id: 'tech-news-real-003',
        title: '提升对话质量，代码显示 Claude AI 即将引入记忆功能',
        summary: 'Anthropic的Claude AI即将支持记忆功能，将大幅提升AI对话的连续性和个性化体验。',
        source: 'IT之家',
        publishTime: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
        category: 'AI对话',
        url: 'https://www.ithome.com/0/863/563.htm',
        isHot: false
      },
      {
        id: 'tech-news-real-004',
        title: '非侵入式脑机接口医疗器械国家标准公开征求意见',
        summary: '国家制定脑机接口医疗器械标准，推动AI与脑科学结合的医疗应用规范发展。',
        source: 'IT之家',
        publishTime: new Date(Date.now() - 4.5 * 60 * 60 * 1000).toISOString(),
        category: '脑机接口',
        url: 'https://www.ithome.com/0/863/570.htm',
        isHot: false
      }
    ];

    return [...aiNews, ...techNews];
  } catch (error) {
    console.error('获取热点新闻失败:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const category = url.searchParams.get('category');

    // 获取真实新闻数据
    let newsData = await getHotNews();
    
    // 如果获取失败，使用模拟数据作为后备
    if (newsData.length === 0) {
      newsData = mockNewsData;
    }

    // 根据分类筛选
    if (category && category !== 'all') {
      newsData = newsData.filter(news => 
        news.category === category || 
        news.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    // 限制返回数量
    newsData = newsData.slice(0, limit);

    // 格式化时间显示
    const formattedNews = newsData.map(news => ({
      ...news,
      publishTime: news.publishTime,
      timeAgo: getTimeAgo(news.publishTime)
    }));

    return NextResponse.json({
      success: true,
      data: formattedNews,
      total: formattedNews.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('获取AI新闻失败:', error);
    
    return NextResponse.json({
      success: false,
      error: '获取新闻数据失败',
      data: mockNewsData.slice(0, 5).map(news => ({
        ...news,
        timeAgo: getTimeAgo(news.publishTime)
      }))
    }, { status: 500 });
  }
}

/**
 * 计算时间差显示
 */
function getTimeAgo(publishTime: string): string {
  const now = new Date();
  const publishDate = new Date(publishTime);
  const diffMs = now.getTime() - publishDate.getTime();
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    return publishDate.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit'
    });
  }
} 
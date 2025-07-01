import { NextRequest, NextResponse } from 'next/server';
import { feishuService } from '@/lib/feishu';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const pageToken = searchParams.get('pageToken') || undefined;

    // 获取新闻列表
    const result = await feishuService.getNewsList(pageSize, pageToken);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('获取新闻列表失败:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '获取新闻失败，请稍后重试' 
      },
      { status: 500 }
    );
  }
}

// 处理 OPTIONS 请求（CORS 预检）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 
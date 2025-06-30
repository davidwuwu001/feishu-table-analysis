import { NextRequest, NextResponse } from 'next/server';
import { feishuService } from '@/lib/feishu';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, name, userType } = body;

    // 验证必需字段
    if (!phone) {
      return NextResponse.json(
        { success: false, error: '手机号不能为空' },
        { status: 400 }
      );
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, error: '请输入正确的手机号格式' },
        { status: 400 }
      );
    }

    // 验证用户类型
    const validUserTypes = ['老师', '家长', '管理员'];
    if (userType && !validUserTypes.includes(userType)) {
      return NextResponse.json(
        { success: false, error: '用户类型不正确' },
        { status: 400 }
      );
    }

    // 进行用户认证（登录或注册）
    const result = await feishuService.authenticateUser(
      phone,
      name || undefined,
      userType || '家长'
    );

    if (result.user) {
      return NextResponse.json({
        success: true,
        user: result.user,
        isNewUser: result.isNewUser
      });
    } else {
      return NextResponse.json(
        { success: false, error: '认证失败，请稍后重试' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('认证API错误:', error);
    
    // 根据错误类型返回不同的错误信息
    if (error instanceof Error) {
      if (error.message.includes('获取访问令牌失败')) {
        return NextResponse.json(
          { success: false, error: '飞书应用配置有误，请联系管理员' },
          { status: 500 }
        );
      }
      
      if (error.message.includes('网络')) {
        return NextResponse.json(
          { success: false, error: '网络连接失败，请检查网络后重试' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: '系统内部错误，请稍后重试' },
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 
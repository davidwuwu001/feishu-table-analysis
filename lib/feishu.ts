/**
 * 飞书API集成服务
 * 提供用户认证、数据查询等功能
 */

import { NextRequest } from 'next/server';

// 飞书API基础配置
const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis';

// 飞书应用配置
const FEISHU_CONFIG = {
  APP_ID: process.env.FEISHU_APP_ID || '',
  APP_SECRET: process.env.FEISHU_APP_SECRET || '',
  USER_TABLE_APP_TOKEN: process.env.FEISHU_USER_TABLE_APP_TOKEN || '',
  USER_TABLE_ID: process.env.FEISHU_USER_TABLE_ID || '',
  // 新增新闻数据库配置
  NEWS_APP_TOKEN: process.env.FEISHU_NEWS_APP_TOKEN || '',
  NEWS_TABLE_ID: process.env.FEISHU_NEWS_TABLE_ID || '',
  API_BASE_URL: 'https://open.feishu.cn/open-apis'
};

// 数据类型定义
export interface FeishuUser {
  id: string;
  phone: string;
  name: string;
  city: string;
  businessUnit: string;
  userType: string;
  registrationTime: string;
  lastLoginTime: string;
  status: string;
  wechat?: string;
  email?: string;
}

// 新增新闻数据类型
export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  heat: number;
  crawlTime: string;
  aiRelevance: '高' | '中' | '低' | '未分类';
  summary: string;
}

export interface ConsumerRecord {
  id: string;
  customerName: string;
  teacherName: string;
  businessType: string;
  serviceAmount: number;
  rechargeMoney: number;
  transferMoney: number;
  remainingBalance: number;
  serviceStatus: string;
  uploadStatus: string;
  uploadFileUrl?: string;
  createTime: string;
  updateTime: string;
}

export interface FeishuApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

// 用户类型定义
export interface User {
  id: string;
  phone: string;
  name: string;
  userType: '老师' | '家长' | '管理员';
  createdTime: string;
  lastLoginTime: string;
}

/**
 * 飞书API服务类 - 支持用户认证和新闻管理
 */
export class FeishuService {
  private accessToken: string | null = null;
  private tokenExpireTime: number = 0;

  /**
   * 获取访问令牌
   */
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpireTime) {
      return this.accessToken;
    }

    try {
      const response = await fetch(`${FEISHU_CONFIG.API_BASE_URL}/auth/v3/tenant_access_token/internal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_id: FEISHU_CONFIG.APP_ID,
          app_secret: FEISHU_CONFIG.APP_SECRET,
        }),
      });

      const data = await response.json();
      
      if (data.code !== 0) {
        throw new Error(`获取访问令牌失败: ${data.msg}`);
      }

      this.accessToken = data.tenant_access_token;
      this.tokenExpireTime = Date.now() + (data.expire - 60) * 1000; // 提前60秒过期
      
      return this.accessToken!; // 使用非空断言，因为我们刚刚赋值
    } catch (error) {
      console.error('获取飞书访问令牌失败:', error);
      throw error;
    }
  }

  /**
   * 发送API请求的通用方法
   */
  private async apiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = await this.getAccessToken();
    
    const response = await fetch(`${FEISHU_CONFIG.API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();
    
    if (data.code !== 0) {
      console.error('飞书API错误:', data);
      throw new Error(`飞书API请求失败: ${data.msg}`);
    }

    return data;
  }

  /**
   * 检查用户是否存在
   */
  async checkUserExists(phone: string): Promise<User | null> {
    try {
      console.log('检查用户是否存在:', phone);
      
      // 检查必要的配置是否存在
      if (!FEISHU_CONFIG.USER_TABLE_APP_TOKEN || !FEISHU_CONFIG.USER_TABLE_ID) {
        console.error('用户表配置缺失');
        throw new Error('用户表配置缺失，请检查环境变量');
      }
      
      const response = await this.apiRequest(
        `/bitable/v1/apps/${FEISHU_CONFIG.USER_TABLE_APP_TOKEN}/tables/${FEISHU_CONFIG.USER_TABLE_ID}/records/search`,
        {
          method: 'POST',
          body: JSON.stringify({
            filter: {
              conjunction: 'and',
              conditions: [{
                field_name: 'phone',
                operator: 'is',
                value: [phone]
              }]
            }
          })
        }
      );

      if (response.data?.items && response.data.items.length > 0) {
        const record = response.data.items[0];
        return {
          id: record.record_id,
          phone: record.fields['phone'] || record.fields['手机号'],
          name: record.fields['name'] || record.fields['姓名'] || '未设置',
          userType: record.fields['user_type'] || record.fields['用户类型'] || '家长',
          createdTime: record.fields['created_time'] || record.fields['创建时间'] || new Date().toISOString(),
          lastLoginTime: record.fields['last_login_time'] || record.fields['最后登录时间'] || new Date().toISOString()
        };
      }

      return null;
    } catch (error: any) {
      console.error('检查用户存在性失败:', error);
      
      // 特殊处理字段名不存在的错误
      if (error.message && error.message.includes('field_name')) {
        console.error('字段名不存在，可能需要创建用户表或更新字段结构');
        throw new Error('用户数据表结构不匹配，请联系管理员初始化用户表');
      }
      
      // 其他错误直接抛出
      throw new Error(`用户认证服务暂时不可用: ${error.message}`);
    }
  }

  /**
   * 创建新用户
   */
  async createUser(phone: string, name?: string, userType: '老师' | '家长' | '管理员' = '家长'): Promise<User> {
    try {
      console.log('创建新用户:', { phone, name, userType });
      
      const now = new Date().toISOString();
      const userName = name || `用户${phone.slice(-4)}`;
      
      const response = await this.apiRequest(
        `/bitable/v1/apps/${FEISHU_CONFIG.USER_TABLE_APP_TOKEN}/tables/${FEISHU_CONFIG.USER_TABLE_ID}/records`,
        {
          method: 'POST',
          body: JSON.stringify({
            fields: {
              'phone': phone,
              'name': userName,
              'user_type': userType,
              'created_time': now,
              'last_login_time': now,
              'status': '正常'
            }
          })
        }
      );

      return {
        id: response.data.record.record_id,
        phone,
        name: userName,
        userType,
        createdTime: now,
        lastLoginTime: now
      };
    } catch (error) {
      console.error('创建用户失败:', error);
      throw error;
    }
  }

  /**
   * 更新用户登录时间
   */
  async updateUserLoginTime(userId: string): Promise<void> {
    try {
      await this.apiRequest(
        `/bitable/v1/apps/${FEISHU_CONFIG.USER_TABLE_APP_TOKEN}/tables/${FEISHU_CONFIG.USER_TABLE_ID}/records/${userId}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            fields: {
              'last_login_time': new Date().toISOString()
            }
          })
        }
      );
    } catch (error) {
      console.error('更新用户登录时间失败:', error);
      // 不抛出错误，因为这不是关键操作
    }
  }

  /**
   * 用户认证（登录或注册）
   */
  async authenticateUser(phone: string, name?: string, userType?: '老师' | '家长' | '管理员'): Promise<{
    user: User;
    isNewUser: boolean;
  }> {
    try {
      // 检查用户是否存在
      let user = await this.checkUserExists(phone);
      let isNewUser = false;

      if (user) {
        // 更新登录时间
        await this.updateUserLoginTime(user.id);
        user.lastLoginTime = new Date().toISOString();
      } else {
        // 创建新用户
        user = await this.createUser(phone, name, userType || '家长');
        isNewUser = true;
      }

      return { user, isNewUser };
    } catch (error) {
      console.error('用户认证失败:', error);
      throw error;
    }
  }

  /**
   * 获取AI新闻列表
   */
  async getNewsList(pageSize: number = 20, pageToken?: string): Promise<{
    items: NewsItem[];
    hasMore: boolean;
    nextPageToken?: string;
  }> {
    try {
      console.log('获取新闻列表');
      
      const response = await this.apiRequest(
        `/bitable/v1/apps/${FEISHU_CONFIG.NEWS_APP_TOKEN}/tables/${FEISHU_CONFIG.NEWS_TABLE_ID}/records/search`,
        {
          method: 'POST',
          body: JSON.stringify({
            page_size: pageSize,
            page_token: pageToken,
            sort: [{
              field_name: '抓取时间',
              desc: true // 按时间降序排列，最新的在前
            }]
          })
        }
      );

      const newsItems: NewsItem[] = [];
      
      if (response.data?.items) {
        for (const record of response.data.items) {
          const fields = record.fields;
          newsItems.push({
            id: record.record_id,
            title: fields['新闻标题'] || '无标题',
            source: fields['新闻来源'] || '未知来源',
            url: fields['新闻链接']?.link || '',
            heat: fields['热度'] || 0,
            crawlTime: fields['抓取时间'] ? new Date(fields['抓取时间']).toISOString() : new Date().toISOString(),
            aiRelevance: fields['AI相关度'] || '未分类',
            summary: fields['新闻摘要'] || '暂无摘要'
          });
        }
      }

      return {
        items: newsItems,
        hasMore: response.data?.has_more || false,
        nextPageToken: response.data?.page_token
      };
    } catch (error) {
      console.error('获取新闻列表失败:', error);
      throw error;
    }
  }

  /**
   * 保存新闻到数据库
   */
  async saveNews(newsItem: Omit<NewsItem, 'id'>): Promise<NewsItem> {
    try {
      console.log('保存新闻:', newsItem.title);
      
      const response = await this.apiRequest(
        `/bitable/v1/apps/${FEISHU_CONFIG.NEWS_APP_TOKEN}/tables/${FEISHU_CONFIG.NEWS_TABLE_ID}/records`,
        {
          method: 'POST',
          body: JSON.stringify({
            fields: {
              '新闻标题': newsItem.title,
              '新闻来源': newsItem.source,
              '新闻链接': {
                link: newsItem.url,
                text: '立即查看'
              },
              '热度': newsItem.heat,
              '抓取时间': new Date(newsItem.crawlTime).getTime(),
              'AI相关度': newsItem.aiRelevance,
              '新闻摘要': newsItem.summary
            }
          })
        }
      );

      return {
        id: response.data.record.record_id,
        ...newsItem
      };
    } catch (error) {
      console.error('保存新闻失败:', error);
      throw error;
    }
  }
}

// 导出服务实例
export const feishuService = new FeishuService();

// 导出工具函数
export const formatCurrency = (amount: number): string => {
  return `¥${amount.toFixed(2)}`;
};

export const formatDate = (timestamp: number | string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN');
};

export const getStatusColor = (status: string): string => {
  const statusColors: { [key: string]: string } = {
    '激活': 'text-green-600',
    '未激活': 'text-yellow-600',
    '已停用': 'text-red-600',
    '已完成': 'text-green-600',
    '进行中': 'text-blue-600',
    '待确认': 'text-yellow-600',
    '已上传': 'text-green-600',
    '未上传': 'text-gray-600',
  };
  return statusColors[status] || 'text-gray-600';
}; 
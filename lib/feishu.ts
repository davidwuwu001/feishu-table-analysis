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
 * 飞书API服务类 - 简化版（仅用户认证）
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
      
      const response = await this.apiRequest(
        `/bitable/v1/apps/${FEISHU_CONFIG.USER_TABLE_APP_TOKEN}/tables/${FEISHU_CONFIG.USER_TABLE_ID}/records/search`,
        {
          method: 'POST',
          body: JSON.stringify({
            filter: {
              conjunction: 'and',
              conditions: [{
                field_name: '手机号',
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
          phone: record.fields['手机号'],
          name: record.fields['姓名'] || '未设置',
          userType: record.fields['用户类型'] || '家长',
          createdTime: record.fields['创建时间'] || new Date().toISOString(),
          lastLoginTime: record.fields['最后登录时间'] || new Date().toISOString()
        };
      }

      return null;
    } catch (error) {
      console.error('检查用户存在性失败:', error);
      return null;
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
              '手机号': phone,
              '姓名': userName,
              '用户类型': userType,
              '创建时间': now,
              '最后登录时间': now,
              '状态': '正常'
            }
          })
        }
      );

      const record = response.data.record;
      return {
        id: record.record_id,
        phone: record.fields['手机号'],
        name: record.fields['姓名'],
        userType: record.fields['用户类型'],
        createdTime: record.fields['创建时间'],
        lastLoginTime: record.fields['最后登录时间']
      };
    } catch (error) {
      console.error('创建用户失败:', error);
      throw new Error('创建用户失败，请稍后重试');
    }
  }

  /**
   * 更新用户最后登录时间
   */
  async updateUserLoginTime(userId: string): Promise<void> {
    try {
      await this.apiRequest(
        `/bitable/v1/apps/${FEISHU_CONFIG.USER_TABLE_APP_TOKEN}/tables/${FEISHU_CONFIG.USER_TABLE_ID}/records/${userId}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            fields: {
              '最后登录时间': new Date().toISOString()
            }
          })
        }
      );
    } catch (error) {
      console.error('更新登录时间失败:', error);
      // 不抛出错误，因为这不是关键功能
    }
  }

  /**
   * 用户登录/注册统一接口
   */
  async authenticateUser(phone: string, name?: string, userType?: '老师' | '家长' | '管理员'): Promise<{
    user: User;
    isNewUser: boolean;
  }> {
    // 检查用户是否存在
    let user = await this.checkUserExists(phone);
    let isNewUser = false;

    if (!user) {
      // 用户不存在，创建新用户
      user = await this.createUser(phone, name, userType);
      isNewUser = true;
      console.log('创建新用户成功:', user);
    } else {
      // 用户存在，更新登录时间
      await this.updateUserLoginTime(user.id);
      console.log('用户登录成功:', user);
    }

    return { user, isNewUser };
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
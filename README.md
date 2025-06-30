# 飞书认证模块

> 基于飞书多维表格的用户认证系统，专为快速集成到其他应用而设计

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8)
![飞书API](https://img.shields.io/badge/飞书API-支持-00d4aa)

## ✨ 功能特性

- 🔐 **智能认证**：自动检测用户是否存在，新用户自动注册，老用户直接登录
- 📱 **移动优先**：响应式设计，完美适配手机和桌面端
- 🚀 **易于集成**：模块化设计，可快速集成到其他Next.js应用
- 🔒 **数据安全**：所有用户数据安全存储在飞书多维表格中
- ⚡ **性能优化**：基于Next.js 14 App Router，支持SSR和缓存优化
- 🛠️ **TypeScript**：完整类型支持，开发体验更好

## 🏗️ 项目结构

```
feishu-auth-module/
├── app/
│   ├── api/auth/          # 认证API路由
│   ├── page.tsx           # 登录/注册页面
│   ├── layout.tsx         # 根布局
│   └── globals.css        # 全局样式
├── lib/
│   └── feishu.ts          # 飞书API服务
├── env.template           # 环境变量模板
└── README.md              # 项目文档
```

## 🚀 快速开始

### 1. 环境准备

确保你的开发环境已安装：
- Node.js 18+
- npm 9+

### 2. 克隆项目

```bash
git clone https://github.com/your-username/feishu-auth-module.git
cd feishu-auth-module
```

### 3. 安装依赖

```bash
npm install
```

### 4. 配置环境变量

复制环境变量模板并填入你的飞书应用信息：

```bash
cp env.template .env.local
```

在 `.env.local` 中填入以下信息：

```env
# 飞书应用配置
FEISHU_APP_ID=your_app_id
FEISHU_APP_SECRET=your_app_secret

# 飞书多维表格配置
FEISHU_USER_TABLE_APP_TOKEN=your_table_app_token
FEISHU_USER_TABLE_ID=your_user_table_id
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看认证模块。

## 📋 飞书配置

### 1. 创建飞书应用

1. 访问 [飞书开放平台](https://open.feishu.cn/)
2. 创建企业自建应用
3. 获取 App ID 和 App Secret

### 2. 配置权限

为应用添加以下权限：
- `bitable:app` - 多维表格应用权限
- `bitable:app:read` - 读取多维表格
- `bitable:app:write` - 写入多维表格

### 3. 创建用户表

在飞书多维表格中创建用户表，包含以下字段：

| 字段名 | 字段类型 | 说明 |
|--------|----------|------|
| 手机号 | 单行文本 | 用户手机号（主键） |
| 姓名 | 单行文本 | 用户姓名 |
| 用户类型 | 单选 | 老师/家长/管理员 |
| 创建时间 | 日期时间 | 账户创建时间 |
| 最后登录时间 | 日期时间 | 最后登录时间 |
| 状态 | 单选 | 正常/禁用 |

## 🔌 API 接口

### POST /api/auth

用户认证接口，支持登录和注册。

**请求参数：**
```json
{
  "phone": "13800138000",
  "name": "张三",
  "userType": "老师"
}
```

**响应格式：**
```json
{
  "success": true,
  "user": {
    "id": "rec123456",
    "phone": "13800138000", 
    "name": "张三",
    "userType": "老师",
    "createdTime": "2025-01-01T00:00:00Z",
    "lastLoginTime": "2025-01-01T00:00:00Z"
  },
  "isNewUser": false
}
```

## 🧩 集成到其他应用

### 1. 复制核心文件

将以下文件复制到你的Next.js项目：
- `lib/feishu.ts` - 飞书API服务
- `app/api/auth/route.ts` - 认证API

### 2. 使用认证服务

```typescript
import { feishuService } from '@/lib/feishu';

// 用户认证
const result = await feishuService.authenticateUser(
  phone, 
  name, 
  userType
);

if (result.user) {
  console.log('认证成功:', result.user);
  console.log('是否新用户:', result.isNewUser);
}
```

### 3. 前端集成

```typescript
// 发送认证请求
const response = await fetch('/api/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phone, name, userType })
});

const data = await response.json();
```

## 🎨 自定义样式

本项目使用 Tailwind CSS，你可以：

1. 修改 `app/globals.css` 调整全局样式
2. 修改 `app/page.tsx` 自定义登录页面样式
3. 更新 `tailwind.config.js` 添加自定义主题

## 📦 构建部署

### 构建生产版本

```bash
npm run build
```

### 部署到Vercel

1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 配置环境变量
4. 一键部署

## 🔧 开发

### 类型检查

```bash
npm run type-check
```

### 代码规范

```bash
npm run lint
```

## 📝 更新日志

### v1.0.0 (2025-06-30)

- ✨ 简化项目结构，专注认证功能
- 🔐 完善的用户认证系统
- 📱 移动端优化界面
- 🛠️ 完整的TypeScript支持
- 📚 详细的集成文档

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](LICENSE)

## 🙋‍♂️ 支持

如有问题，请：
1. 查看本文档
2. 提交 GitHub Issue
3. 联系开发者

---

**✨ 这是一个专注、可靠的飞书认证模块，助力你的应用快速实现用户管理功能！** 
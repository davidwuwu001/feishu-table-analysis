# AI新闻助手

> 基于飞书多维表格的智能新闻展示系统，集成用户认证、新闻获取、AI工具展示于一体

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8)
![飞书API](https://img.shields.io/badge/飞书API-支持-00d4aa)
![状态](https://img.shields.io/badge/状态-第一阶段完成-green)

## ✨ 功能特性

### 🔐 智能认证系统
- **自动识别**：智能检测用户是否存在，新用户自动注册，老用户直接登录
- **手机号登录**：基于手机号的简洁认证方式
- **用户类型管理**：支持老师、家长、管理员三种角色
- **数据安全**：所有用户数据安全存储在飞书多维表格中

### 📰 AI新闻展示
- **热点获取**：实时获取知乎热榜、36氪热榜、IT新闻等多源AI资讯
- **智能筛选**：自动识别和分类AI相关新闻内容
- **热度排序**：按照新闻热度和时间智能排序展示
- **相关度标识**：AI相关度（高/中/低）彩色标签显示
- **即时刷新**：一键刷新获取最新AI资讯

### 🚀 AI工具箱
- **工具预览**：6大AI工具类型展示（即将上线）
  - 🧠 智能思维导图
  - 💬 AI对话助手  
  - ✍️ AI写作助手
  - 🌐 AI翻译工具
  - 📝 AI内容总结
  - 📊 AI数据分析

### 📱 用户体验
- **移动优先**：响应式设计，完美适配手机和桌面端
- **现代界面**：渐变背景、毛玻璃效果、流畅动画
- **交互友好**：加载状态、错误提示、成功反馈
- **一键操作**：简洁的操作流程，降低学习成本

## 🏗️ 技术架构

### 前端技术栈
- **框架**：Next.js 14 (App Router)
- **语言**：TypeScript 5.3
- **样式**：Tailwind CSS 3.3
- **状态管理**：React Hooks
- **UI组件**：自定义组件系统

### 后端服务
- **API路由**：Next.js API Routes
- **数据存储**：飞书多维表格
- **新闻源**：HotNews MCP工具
- **认证服务**：飞书开放平台API

### 数据库设计

#### 用户信息表
| 字段名 | 类型 | 说明 |
|--------|------|------|
| 手机号 | 文本 | 用户唯一标识 |
| 姓名 | 文本 | 用户姓名 |
| 用户类型 | 单选 | 老师/家长/管理员 |
| 创建时间 | 日期时间 | 注册时间 |
| 最后登录时间 | 日期时间 | 活跃度追踪 |
| 状态 | 单选 | 正常/禁用 |

#### AI新闻数据表
| 字段名 | 类型 | 说明 |
|--------|------|------|
| 新闻标题 | 文本 | 新闻标题 |
| 新闻来源 | 单选 | 知乎热榜/36氪热榜/IT新闻等 |
| 新闻链接 | URL | 新闻原文链接 |
| 热度 | 数字 | 新闻热度值 |
| 抓取时间 | 日期时间 | 数据获取时间 |
| AI相关度 | 单选 | 高/中/低/未分类 |
| 新闻摘要 | 文本 | 新闻内容摘要 |

## 🚀 快速开始

### 1. 环境准备

确保你的开发环境已安装：
- Node.js 18+
- npm 9+

### 2. 克隆项目

```bash
git clone https://github.com/your-username/feishu-table-analysis.git
cd feishu-table-analysis
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

# 用户数据表配置
FEISHU_USER_TABLE_APP_TOKEN=your_user_table_app_token
FEISHU_USER_TABLE_ID=your_user_table_id

# 新闻数据表配置
FEISHU_NEWS_APP_TOKEN=your_news_app_token
FEISHU_NEWS_TABLE_ID=your_news_table_id
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看AI新闻助手。

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

### 3. 创建数据表

#### 用户信息表
在飞书多维表格中创建用户表，包含以下字段：
- 手机号（文本） - 用户登录凭证
- 姓名（文本） - 用户姓名
- 用户类型（单选） - 老师/家长/管理员
- 创建时间（日期时间） - 注册时间
- 最后登录时间（日期时间） - 活跃度追踪
- 状态（单选） - 正常/禁用

#### AI新闻数据表
创建新闻数据表，包含以下字段：
- 新闻标题（文本） - 新闻标题
- 新闻来源（单选） - 数据来源标识
- 新闻链接（URL） - 原文链接
- 热度（数字） - 热度数值
- 抓取时间（日期时间） - 获取时间
- AI相关度（单选） - 相关度分类
- 新闻摘要（文本） - 内容摘要

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

### GET /api/news

获取AI新闻列表接口。

**查询参数：**
- `pageSize` (可选) - 每页条数，默认20
- `pageToken` (可选) - 分页令牌

**响应格式：**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "rec123456",
        "title": "AI新闻标题",
        "source": "知乎热榜",
        "url": "https://example.com",
        "heat": 1000000,
        "crawlTime": "2025-01-01T00:00:00Z",
        "aiRelevance": "高",
        "summary": "新闻摘要内容"
      }
    ],
    "hasMore": true,
    "nextPageToken": "next_token"
  }
}
```

## 🎯 项目亮点

### 技术创新
- **飞书表格作为数据库**：创新性地使用飞书多维表格作为数据存储方案
- **实时新闻聚合**：集成多个新闻源，实时获取AI相关资讯
- **智能内容分类**：自动识别和分类AI相关新闻内容

### 用户体验
- **零学习成本**：手机号即可登录，无需复杂注册流程
- **响应式设计**：一套界面适配所有设备
- **即时反馈**：实时的加载状态和操作反馈

### 开发效率
- **类型安全**：完整的TypeScript类型定义
- **组件化开发**：可复用的组件系统
- **自动化部署**：支持Vercel一键部署

## 📦 构建部署

### 本地构建

```bash
npm run build
```

### 部署到Vercel

1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 配置环境变量
4. 一键部署

### 环境变量配置

在Vercel中配置以下环境变量：
```
FEISHU_APP_ID=your_app_id
FEISHU_APP_SECRET=your_app_secret
FEISHU_USER_TABLE_APP_TOKEN=your_user_table_app_token
FEISHU_USER_TABLE_ID=your_user_table_id
FEISHU_NEWS_APP_TOKEN=your_news_app_token
FEISHU_NEWS_TABLE_ID=your_news_table_id
```

## 🔧 开发

### 类型检查

```bash
npm run type-check
```

### 代码规范

```bash
npm run lint
```

### 本地开发

```bash
npm run dev
```

## 📝 更新日志

### v1.0.0 (2025-06-30) - 第一阶段完成

#### ✨ 新增功能
- 🔐 完整的用户认证系统（飞书表格存储）
- 📰 AI新闻展示功能（多源聚合）
- 🚀 AI工具箱界面（6大工具预览）
- 📱 移动端适配优化
- 🎨 现代化UI设计（渐变背景、动画效果）

#### 🏗️ 技术架构
- ⚡ Next.js 14 App Router架构
- 🛡️ TypeScript完整类型支持
- 🎨 Tailwind CSS样式系统
- 📊 飞书多维表格数据存储
- 🔄 实时新闻获取API

#### 📊 数据管理
- 👥 用户信息表（认证数据）
- 📰 AI新闻数据表（新闻内容）
- 🔗 飞书API集成（数据同步）

## 🎯 功能演示

### 登录前界面
- 🎨 渐变背景设计
- 📱 移动端友好布局
- 🔐 简洁的登录表单
- ✨ 用户类型选择

### 登录后界面
- 👋 个性化欢迎信息
- 🚀 AI工具箱展示
- 📰 AI新闻热点列表
- 🔄 一键刷新功能

### 新闻卡片展示
- 📰 新闻标题和摘要
- 🏷️ 来源和相关度标签
- 🔥 热度数值显示
- 🔗 立即查看按钮

## 🔮 路线图

### 第二阶段规划
- 🧠 智能思维导图功能实现
- 💬 AI对话助手集成
- ✍️ AI写作助手开发
- 🌐 AI翻译工具构建

### 第三阶段规划
- 📝 AI内容总结功能
- 📊 AI数据分析工具
- 🔔 个性化新闻推荐
- 📱 PWA移动应用支持

### 功能增强
- 🔍 新闻搜索功能
- 📚 收藏和标签系统
- 📈 用户行为分析
- 🔔 实时通知推送

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发规范
- 遵循TypeScript严格模式
- 使用ESLint代码规范
- 提交前进行类型检查
- 编写清晰的提交信息

## 📄 许可证

[MIT License](LICENSE)

## 🙋‍♂️ 支持

如有问题，请：
1. 查看本文档
2. 提交 GitHub Issue
3. 联系开发者

## 🏆 项目成就

- ✅ **第一阶段开发完成** - 基础功能全部实现
- ✅ **用户认证系统** - 飞书多维表格集成
- ✅ **新闻展示功能** - 实时AI资讯获取
- ✅ **移动端适配** - 响应式设计完成
- ✅ **现代化UI** - 渐变效果和动画
- ✅ **TypeScript支持** - 完整类型定义
- ✅ **API接口完善** - 用户和新闻管理

---

**✨ 这是一个专业、现代、易用的AI新闻展示应用，为用户提供最新AI资讯和即将到来的AI工具体验！** 
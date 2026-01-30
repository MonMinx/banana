# NanoGen - AI 图像生成器

NanoGen 是一个全栈 Web 应用程序，模仿了 NanoBanana Pro 的功能。它允许用户生成 AI 图像、管理个人资料和购买积分。

## 功能特性

-   **AI 图像生成**: 集成 Nano Banana API（支持流式响应）。
-   **用户管理**: 注册、登录（演示版）和个人中心管理。
-   **积分系统**: 按次付费模式，集成模拟支付功能。
-   **响应式 UI**: 基于 Tailwind CSS 构建的现代深色主题界面，高度还原设计图。

## 快速链接

-   [安装指南 (初学者适用)](./INSTALL.md)
-   [用户手册](./USAGE.md)

## 技术栈

-   **前端**: Next.js 16 (React), Tailwind CSS
-   **后端**: Next.js API Routes
-   **数据库**: SQLite with Prisma ORM
-   **语言**: TypeScript

## 项目结构

-   `app/`: 主要应用程序代码（页面、API 路由、组件）。
-   `prisma/`: 数据库架构和配置。

## 快速开始

1.  `npm install`
2.  `npx prisma migrate dev --name init`
3.  `npm run dev`

详细说明请参阅 `INSTALL.md`。

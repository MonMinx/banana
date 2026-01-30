# NanoGen 安装指南

欢迎使用 NanoGen！本指南将帮助您在计算机或服务器上安装和设置本网站。本指南专为初学者设计。

## 前置条件

在开始之前，您需要在计算机上安装以下软件：

1.  **Node.js**: 这是运行网站的环境。
    -   请从 [nodejs.org](https://nodejs.org/) 下载并安装 "LTS" 版本。
2.  **Git**: (可选) 用于下载代码。
    -   请从 [git-scm.com](https://git-scm.com/) 下载。

## 第一步：下载项目

如果您已经有了项目文件夹，请打开终端（Windows 上的命令提示符，Mac/Linux 上的终端）并导航到项目文件夹：

```bash
cd 项目文件夹路径
```

## 第二步：安装依赖

运行以下命令安装所有必要的库。这可能需要几分钟。

```bash
npm install
```

## 第三步：配置数据库

本项目使用本地 SQLite 数据库，因此无需安装任何外部数据库软件。

1.  **创建环境文件**:
    在根文件夹（`package.json` 所在的文件夹）中创建一个名为 `.env` 的文件。
    将以下内容添加到其中：

    ```env
    DATABASE_URL="file:./dev.db"
    NANO_API_KEY="sk-5bcff1f3bfd34e7788d1210688f9a38f"
    ```
    *(注意：如果您有自己的 API 密钥，请替换它)*

2.  **设置数据库表**:
    运行此命令以创建数据库文件 (`dev.db`) 并设置表结构：

    ```bash
    npx prisma migrate dev --name init
    ```

    您应该会看到一条消息，说明数据库现在与架构同步。

## 第四步：运行应用程序

现在您可以启动网站了！

1.  **启动开发服务器**:

    ```bash
    npm run dev
    ```

2.  **打开浏览器**:
    访问 `http://localhost:3000`。

    您应该能看到 NanoGen 首页！

## 故障排除

-   **"Command not found" (找不到命令)**: 确保已安装 Node.js 并重新启动了终端。
-   **数据库错误**: 尝试删除 `dev.db` 文件，然后再次运行 `npx prisma migrate dev --name init`。
-   **端口被占用**: 如果端口 3000 被占用，应用程序将尝试 3001。请查看终端输出。

## 生产环境构建

如果您想在公共服务器上运行此程序：

1.  运行 `npm run build`
2.  运行 `npm start`

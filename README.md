# 航班购票系统

这是一个完整的航班购票网站，包含Spring Boot 3.5.0后端和React前端。

## 项目结构

```
flight-booking-system/
├── backend/                 # Spring Boot 后端
│   ├── src/main/java/com/flightbooking/
│   │   ├── entity/         # 实体类
│   │   ├── repository/     # 数据访问层
│   │   ├── service/        # 业务逻辑层
│   │   ├── controller/     # 控制器层
│   │   ├── config/         # 配置类
│   │   └── dto/           # 数据传输对象
│   ├── src/main/resources/
│   │   └── application.yml # 配置文件
│   └── pom.xml            # Maven 依赖
└── frontend/               # React 前端
    ├── src/
    │   ├── components/     # React 组件
    │   ├── contexts/       # React 上下文
    │   ├── services/       # API 服务
    │   ├── types/          # TypeScript 类型定义
    │   └── utils/          # 工具函数
    └── package.json        # NPM 依赖
```

## 功能特性

### 用户功能
- ✅ 用户注册和登录
- ✅ 航班搜索（支持航班号和机场搜索）
- ✅ 航班预订
- ✅ 查看个人订单
- ✅ 登录状态保持

### 管理员功能
- ✅ 机场管理（添加、删除）
- ✅ 航班管理（添加、删除、查看）
- ✅ 订单管理（查看所有订单）
- ✅ 查看航班乘客信息

### 技术特性
- ✅ Spring Security + JWT 认证
- ✅ MySQL 数据库
- ✅ JPA 数据访问
- ✅ React + TypeScript
- ✅ 响应式设计
- ✅ 不使用 TailwindCSS（使用原生 CSS 类名风格）

## 快速开始

### 后端启动

1. 确保已安装 Java 17+ 和 Maven
2. 数据库已配置（MySQL）
3. 进入后端目录：
   ```bash
   cd backend
   ```
4. 运行应用：
   ```bash
   mvn spring-boot:run
   ```

后端将在 http://localhost:8080 启动

### 前端启动

1. 确保已安装 Node.js 16+
2. 进入前端目录：
   ```bash
   cd frontend
   ```
3. 安装依赖：
   ```bash
   npm install
   ```
4. 启动开发服务器：
   ```bash
   npm run dev
   ```

前端将在 http://localhost:5173 启动

## 数据库配置

数据库配置信息在 `backend/src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://47.117.64.72:3306/JavaFullStackTraining
    username: JavaFullStackTrainingAdmin
    password: 8xchWheZpKiiQxnX
```

## API 接口

### 认证接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册

### 航班接口
- `POST /api/flights/search` - 搜索航班
- `GET /api/flights/{id}` - 获取航班详情

### 机场接口
- `GET /api/airports` - 获取所有机场

### 订票接口
- `POST /api/bookings` - 创建订单
- `GET /api/bookings/my` - 获取用户订单

### 管理员接口
- `POST /admin/airports` - 添加机场
- `DELETE /admin/airports/{id}` - 删除机场
- `GET /admin/flights` - 获取所有航班
- `POST /admin/flights` - 添加航班
- `DELETE /admin/flights/{id}` - 删除航班
- `GET /admin/bookings` - 获取所有订单
- `GET /admin/flights/{flightId}/passengers` - 获取航班乘客

## 默认管理员账户

系统需要手动在数据库中创建管理员用户，将用户的 `role` 字段设置为 `ADMIN`。

## 注意事项

1. 确保 MySQL 数据库服务正在运行
2. 确保后端先启动，前端再启动
3. 首次运行时，JPA 会自动创建数据表
4. 需要手动添加一些机场和航班数据进行测试

## 技术栈

### 后端
- Spring Boot 3.5.0
- Spring Security
- Spring Data JPA
- MySQL
- JWT
- Maven

### 前端
- React 18
- TypeScript
- Vite
- Axios
- React Router
- 原生 CSS（类似 TailwindCSS 的工具类）

## 开发说明

本项目严格按照要求实现：
- 不使用 Lombok
- 不使用 TailwindCSS
- 使用指定的数据库连接信息
- 实现了所有需求的功能
- 包含完整的前后端分离架构

## 测试数据

系统已包含测试数据：

### 测试账户
- 普通用户：`testuser/testpass`
- 管理员：`admin2024/admin123`

### 机场数据
包含10个主要机场：北京首都机场(PEK)、上海虹桥机场(SHA)、上海浦东机场(PVG)、广州白云机场(CAN)等

### 航班数据
包含3个测试航班：
- CA1234: 北京→上海 (¥800)
- MU5678: 上海虹桥→上海浦东 (¥600)
- CZ9999: 上海浦东→广州 (¥450)

项目完全可用，支持用户注册、登录、搜索航班、预订航班等完整功能。

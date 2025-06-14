# 🐳 航班购票系统 Docker 部署指南

本文档说明如何使用 GitHub Actions 自动构建 Docker 镜像并部署航班购票系统。

## 📋 系统架构

- **前端**: React + TypeScript + Vite (由 Spring Boot 内嵌 Tomcat 提供静态文件服务)
- **后端**: Spring Boot + JPA + Spring Security + Actuator
- **容器**: OpenJDK 17 + Spring Boot 内嵌 Tomcat
- **端口**: 统一使用 8080 端口提供前后端服务

## 🚀 快速开始

### 使用 Docker Compose（推荐）

1. 复制环境变量配置文件：
   ```bash
   cp env.example .env
   # 编辑 .env 文件，修改数据库密码和其他敏感信息
   ```

2. 启动服务：
   ```bash
   docker-compose up -d
   ```

3. 访问应用：http://localhost:8080

### 手动部署

#### 1. 创建 Release 触发构建

要触发自动构建，请创建一个新的 git 标签：

```bash
# 创建标签
git tag v1.0.0

# 推送标签到远程仓库
git push origin v1.0.0
```

#### 2. 手动触发构建

也可以在 GitHub Actions 页面手动触发工作流。

#### 3. 拉取并运行镜像

构建完成后，可以从 GitHub Container Registry 拉取镜像：

```bash
# 拉取最新镜像
docker pull ghcr.io/your-username/flight-booking-system:latest

# 运行容器
docker run -d \
  --name flight-booking-system \
  -p 8080:8080 \
  ghcr.io/your-username/flight-booking-system:latest
```

## 🌐 访问应用

- **前端应用**: http://localhost:8080
- **后端 API**: http://localhost:8080/api
- **健康检查**: http://localhost:8080/actuator/health

## 🔧 环境变量配置

### 基本数据库配置

如果需要自定义数据库连接等配置，可以通过环境变量传递：

```bash
docker run -d \
  --name flight-booking-system \
  -p 8080:8080 \
  -e DB_URL="jdbc:mysql://your-db:3306/flight_booking" \
  -e DB_USERNAME="your-username" \
  -e DB_PASSWORD="your-password" \
  ghcr.io/your-username/flight-booking-system:latest
```

### 完整配置示例

```bash
docker run -d \
  --name flight-booking-system \
  -p 8080:8080 \
  -e DB_URL="jdbc:mysql://mysql-server:3306/flight_booking" \
  -e DB_USERNAME="flightuser" \
  -e DB_PASSWORD="securepassword" \
  -e DB_DDL_AUTO="validate" \
  -e DB_SHOW_SQL="false" \
  -e JWT_SECRET="your-very-secure-jwt-secret-key-that-should-be-at-least-64-characters-long" \
  -e JWT_EXPIRATION="86400000" \
  -e ADMIN_USERNAME="admin" \
  -e ADMIN_PASSWORD="secureadminpass" \
  -e SERVER_PORT="8080" \
  -e LOG_LEVEL="INFO" \
  ghcr.io/your-username/flight-booking-system:latest
```

### 支持的环境变量

| 环境变量 | 描述 | 默认值 | 必需 |
|---------|------|--------|------|
| `DB_URL` | 数据库JDBC连接地址 | 默认测试数据库 | 生产环境必需 |
| `DB_USERNAME` | 数据库用户名 | 默认用户名 | 生产环境必需 |
| `DB_PASSWORD` | 数据库密码 | 默认密码 | 生产环境必需 |
| `DB_DDL_AUTO` | JPA DDL模式 | `update` | 否 |
| `DB_SHOW_SQL` | 是否显示SQL语句 | `true` | 否 |
| `JWT_SECRET` | JWT签名密钥 | 默认密钥 | 生产环境强烈建议 |
| `JWT_EXPIRATION` | JWT过期时间(毫秒) | `86400000` (24小时) | 否 |
| `ADMIN_USERNAME` | 管理员用户名 | `admin` | 否 |
| `ADMIN_PASSWORD` | 管理员密码 | `admin123` | 生产环境必需 |
| `SERVER_PORT` | 服务器端口 | `8080` | 否 |
| `LOG_LEVEL` | 日志级别 | `DEBUG` | 否 |

### 生产环境安全建议

1. **必须修改的配置**：
   - `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`: 使用专用数据库
   - `JWT_SECRET`: 使用强随机密钥 (至少64字符)
   - `ADMIN_PASSWORD`: 使用强密码

2. **推荐修改的配置**：
   - `DB_DDL_AUTO`: 生产环境建议设为 `validate` 或 `none`
   - `DB_SHOW_SQL`: 生产环境建议设为 `false`
   - `LOG_LEVEL`: 生产环境建议设为 `INFO` 或 `WARN`

## 📁 Docker 镜像结构

```
/app/app.jar                     # Spring Boot 应用（包含内嵌 Tomcat）
/app/static/                     # 前端静态文件
```

## 🔍 故障排除

### 查看容器日志

```bash
# 查看所有日志
docker logs flight-booking-system

# 查看实时日志
docker logs -f flight-booking-system

# 进入容器查看应用状态
docker exec -it flight-booking-system bash
ps aux | grep java
```

### 常见问题

1. **端口冲突**: 确保本地 8080 端口未被占用
2. **内存不足**: Spring Boot 应用需要至少 512MB 内存
3. **数据库连接**: 确保数据库服务可访问且配置正确
4. **静态资源**: 前端路由由 Spring Boot 处理，支持 SPA 单页应用

## 📊 Docker Compose 部署

### 基础版本

如果需要同时部署数据库，可以使用以下 `docker-compose.yml`:

```yaml
version: '3.8'
services:
  flight-booking:
    image: ghcr.io/your-username/flight-booking-system:latest
    ports:
      - "8080:8080"
    environment:
      - DB_URL=jdbc:mysql://mysql:3306/flight_booking
      - DB_USERNAME=root
      - DB_PASSWORD=password
      - JWT_SECRET=your-production-jwt-secret-key-should-be-very-long-and-secure
      - ADMIN_PASSWORD=secureadminpass
      - DB_DDL_AUTO=update
      - LOG_LEVEL=INFO
    depends_on:
      mysql:
        condition: service_healthy
    restart: unless-stopped
    
  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=flight_booking
      - MYSQL_CHARACTER_SET_SERVER=utf8mb4
      - MYSQL_COLLATION_SERVER=utf8mb4_unicode_ci
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10
    restart: unless-stopped

volumes:
  mysql_data:
```

### 生产环境版本（使用 secrets）

```yaml
version: '3.8'
services:
  flight-booking:
    image: ghcr.io/your-username/flight-booking-system:latest
    ports:
      - "8080:8080"
    environment:
      - DB_URL=jdbc:mysql://mysql:3306/flight_booking
      - DB_USERNAME=flightuser
      - DB_PASSWORD_FILE=/run/secrets/db_password
      - JWT_SECRET_FILE=/run/secrets/jwt_secret
      - ADMIN_PASSWORD_FILE=/run/secrets/admin_password
      - DB_DDL_AUTO=validate
      - DB_SHOW_SQL=false
      - LOG_LEVEL=WARN
    secrets:
      - db_password
      - jwt_secret
      - admin_password
    depends_on:
      mysql:
        condition: service_healthy
    restart: unless-stopped
    
  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD_FILE=/run/secrets/mysql_root_password
      - MYSQL_DATABASE=flight_booking
      - MYSQL_USER=flightuser
      - MYSQL_PASSWORD_FILE=/run/secrets/db_password
      - MYSQL_CHARACTER_SET_SERVER=utf8mb4
      - MYSQL_COLLATION_SERVER=utf8mb4_unicode_ci
    secrets:
      - mysql_root_password
      - db_password
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10
    restart: unless-stopped

secrets:
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
  admin_password:
    file: ./secrets/admin_password.txt
  mysql_root_password:
    file: ./secrets/mysql_root_password.txt

volumes:
  mysql_data:
```

运行命令：
```bash
# 基础版本
docker-compose up -d

# 生产环境版本（需要先创建 secrets 目录和文件）
mkdir -p secrets
echo "your-secure-db-password" > secrets/db_password.txt
echo "your-very-long-jwt-secret-key-for-production-use" > secrets/jwt_secret.txt
echo "your-secure-admin-password" > secrets/admin_password.txt
echo "your-mysql-root-password" > secrets/mysql_root_password.txt
chmod 600 secrets/*.txt
docker-compose -f docker-compose.prod.yml up -d
```

访问应用：http://localhost:8080

### 环境变量验证

部署后可以通过以下方式验证环境变量是否正确加载：

```bash
# 查看应用日志
docker-compose logs -f flight-booking

# 进入容器检查环境变量（仅开发环境）
docker exec -it flight-booking-system env | grep -E "(DB_|JWT_|ADMIN_)"
```

## 🔄 CI/CD 工作流程

1. **代码推送**: 推送标签到 GitHub
2. **自动构建**: GitHub Actions 自动构建前后端
3. **Docker 打包**: 创建多架构 Docker 镜像
4. **推送镜像**: 推送到 GitHub Container Registry
5. **创建 Release**: 自动创建 GitHub Release
6. **部署**: 拉取镜像进行部署

## 📋 支持的架构

- linux/amd64
- linux/arm64

## 🏷️ 标签策略

- `latest`: 主分支最新构建
- `v1.0.0`: 特定版本标签
- `main-abc1234`: 主分支特定提交 
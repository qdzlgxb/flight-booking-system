# 🐳 航班购票系统 Docker 部署指南

本文档说明如何使用 GitHub Actions 自动构建 Docker 镜像并部署航班购票系统。

## 📋 系统架构

- **前端**: React + TypeScript + Vite (由 Spring Boot 内嵌 Tomcat 提供静态文件服务)
- **后端**: Spring Boot + JPA + Spring Security + Actuator
- **容器**: OpenJDK 17 + Spring Boot 内嵌 Tomcat
- **端口**: 统一使用 8080 端口提供前后端服务

## 🚀 快速开始

### 1. 创建 Release 触发构建

要触发自动构建，请创建一个新的 git 标签：

```bash
# 创建标签
git tag v1.0.0

# 推送标签到远程仓库
git push origin v1.0.0
```

### 2. 手动触发构建

也可以在 GitHub Actions 页面手动触发工作流。

### 3. 拉取并运行镜像

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

如果需要自定义数据库连接等配置，可以通过环境变量传递：

```bash
docker run -d \
  --name flight-booking-system \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL="jdbc:mysql://your-db:3306/flight_booking" \
  -e SPRING_DATASOURCE_USERNAME="your-username" \
  -e SPRING_DATASOURCE_PASSWORD="your-password" \
  ghcr.io/your-username/flight-booking-system:latest
```

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

如果需要同时部署数据库，可以使用以下 `docker-compose.yml`:

```yaml
version: '3.8'
services:
  flight-booking:
    image: ghcr.io/your-username/flight-booking-system:latest
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/flight_booking
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=password
    depends_on:
      - mysql
    restart: unless-stopped
    
  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=flight_booking
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped

volumes:
  mysql_data:
```

运行命令：
```bash
docker-compose up -d
```

访问应用：http://localhost:8080

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
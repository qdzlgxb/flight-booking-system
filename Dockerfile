# 多阶段构建：前端构建阶段
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# 后端构建阶段
FROM maven:3.9.6-eclipse-temurin-17 AS backend-build
WORKDIR /app/backend
COPY backend/pom.xml ./
RUN mvn dependency:go-offline -B
COPY backend/src ./src
RUN mvn clean package -DskipTests

# 最终运行阶段：使用Spring Boot内嵌Tomcat
FROM openjdk:17-jdk-slim
LABEL maintainer="Flight Booking System"
LABEL description="航班购票系统 - 基于Spring Boot的Docker镜像"

# 环境变量配置说明
# 可以通过以下环境变量覆盖应用配置：
# DB_URL: 数据库连接地址
# DB_USERNAME: 数据库用户名
# DB_PASSWORD: 数据库密码
# DB_DDL_AUTO: JPA DDL 自动模式 (create, update, validate, none)
# DB_SHOW_SQL: 是否显示SQL语句 (true/false)
# ADMIN_USERNAME: 管理员用户名
# ADMIN_PASSWORD: 管理员密码
# SERVER_PORT: 服务器端口 (默认: 8080)
# JWT_SECRET: JWT签名密钥
# JWT_EXPIRATION: JWT过期时间 (毫秒)
# LOG_LEVEL: 日志级别 (DEBUG, INFO, WARN, ERROR)

# 创建非root用户
RUN groupadd -r spring && useradd -r -g spring spring

# 创建应用目录
WORKDIR /app

# 复制后端jar包
COPY --from=backend-build /app/backend/target/*.jar app.jar

# 创建静态资源目录并复制前端构建结果
RUN mkdir -p /app/static
COPY --from=frontend-build /app/frontend/dist/ /app/static/

# 安装curl用于健康检查
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

# 更改文件所有者
RUN chown -R spring:spring /app

# 切换到非root用户
USER spring

# 暴露端口 - Spring Boot在8080端口同时提供前端和API服务
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# 启动Spring Boot应用，添加生产环境优化参数
CMD ["java", "-server", "-Xms512m", "-Xmx1024m", "-XX:+UseG1GC", "-XX:+UseContainerSupport", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"] 
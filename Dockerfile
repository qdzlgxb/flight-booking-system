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

# 启动Spring Boot应用
CMD ["java", "-jar", "app.jar"] 
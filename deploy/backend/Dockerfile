# ===== build stage =====
# 使用 Java 8 与 pom.xml 中 java.version=1.8 保持一致
FROM maven:3.9.9-eclipse-temurin-8 AS builder
WORKDIR /build

COPY pom.xml .
COPY src ./src

# 强制使用 Maven Central（https），避免镜像/环境里的镜像源配置导致依赖下载失败
RUN mkdir -p /root/.m2 && printf '<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 https://maven.apache.org/xsd/settings-1.0.0.xsd"><mirrors><mirror><id>central</id><name>Maven Central</name><url>https://repo.maven.apache.org/maven2</url><mirrorOf>*</mirrorOf></mirror></mirrors></settings>' > /root/.m2/settings.xml
RUN mvn -s /root/.m2/settings.xml -B -U -DskipTests clean package

# ===== runtime stage =====
FROM eclipse-temurin:8-jre
WORKDIR /app
COPY --from=builder /build/target/*.jar /app/app.jar

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]

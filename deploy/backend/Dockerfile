# 后端运行时镜像（CI 会先执行 mvn 打包，再把 target/*.jar 打进镜像）
FROM eclipse-temurin:8-jre
WORKDIR /app

COPY target/*.jar /app/app.jar

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]

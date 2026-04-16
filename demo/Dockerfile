# 1. Aşama: Maven ile projeyi derle
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
# Sadece pom.xml kopyalayarak bağımlılıkları önbelleğe al (Hız kazandırır)
COPY pom.xml .
RUN mvn dependency:go-offline
# Kodları kopyala ve paketle
COPY src ./src
RUN mvn clean package -DskipTests

# 2. Aşama: Çalıştırma ortamı
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# Uygulamanın çalışacağı port
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
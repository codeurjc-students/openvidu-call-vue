FROM node:18-alpine as node_compiler

WORKDIR /usr/share/node/app

COPY openvidu-call-vuetify-frontend/src /usr/share/node/app/src 
COPY openvidu-call-vuetify-frontend/package.json /usr/share/node/app/package.json

RUN npm install

RUN npm run build

FROM maven:3.8.4-openjdk-17 as maven_compiler

WORKDIR /usr/share/app

COPY openvidu-call-back-java/pom.xml /usr/share/app/pom.xml
COPY openvidu-call-back-java/src /usr/share/app/src
COPY --from=node_compiler /usr/share/node/app/dist/* /usr/share/app/src/main/resources/static/
RUN mvn clean install package

FROM openjdk:11-jre-slim

WORKDIR /usr/share/app

COPY --from=maven_compiler /usr/share/app/target/openvidu-call-back-java.jar /usr/share/app/openvidu-call-back-java.jar

EXPOSE 5000

CMD ["java", "-jar", "openvidu-call-back-java.jar"]
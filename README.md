# openvidu-call-vue

This project changes the original Angular fronted to a Vue one imitating the original and some of their basic features.

## Installation

Use git to install the project in your choosed folder:

```bash
git clone https://github.com/codeurjc-students/openvidu-call-vue.git
```

## Run instructions
1. Run OpenVidu deployment:

```bash
docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=MY_SECRET openvidu/openvidu-dev:2.27.0
```

Another option would be not to use the Docker image and connect the backend to the OpenVidu deployment from demos. To do that it is necessary to change the next param: 
```bash
OPENVIDU_URL: ${OPENVIDU_URL:http://localhost:4443} 
```

from /openvidu-call-vue/openvidu-call-back-java/src/main/resources/application.properties to:

```bash
OPENVIDU_URL: https://demos.openvidu.io
```

2. Initiate java backend using maven:

```bash
cd openvidu-call-vue/openvidu-call-back-java
mvn install
mvn spring-boot:run
```

3. Run the client application using NPM:
   
```bash
cd openvidu-call-vue/openvidu-call-vuetify-frontend
npm install
npm run dev
```

4. Start using your aplication in the page [http://127.0.0.1:3000/](http://127.0.0.1:3000/). 

5. Use the next user and password to dive into the rest of the application: 

   **User:** admin
   
   **Password:** MY_SECRET

## Run Docker
To run the web application only using Docker follow the next steps:
1. Create Docker image:
   
```bash
cd openvidu-call-vue/docker
docker build -f Dockerfile -t openvidu-vue ../
```

The name "openvidu-vue" can be substitute to another one, but it would be neccessary to change the docker-compose file from the next step, so it is not recommended to change the name of the image.

2. Run docker compose:

```bash
docker-compose up
```

3. Start using your aplication in the page [http://localhost:5000/](http://localhost:5000/). If it does not work it is recommended to access to the same port via Docker Desktop if you are in Windows.

4. Use the next user and password to dive into the rest of the application: 

   **User:** admin
   
   **Password:** MY_SECRET

## Dependencies
* 	[Git](https://git-scm.com/download/win)
* 	[Docker](https://www.docker.com/)
* 	[Java](https://www.java.com/en/) version >11
* 	[Maven](https://maven.apache.org/)
* 	[NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* 	[Docker](https://www.docker.com/)



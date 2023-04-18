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
docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=MY_SECRET openvidu/openvidu-dev:2.26.0
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

## Dependencies
* 	[Git](https://git-scm.com/download/win)
* 	[Docker](https://www.docker.com/)
* 	[Java](https://www.java.com/en/) version >11
* 	[Maven](https://maven.apache.org/)
* 	[NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

<template>
<!-- Shared with JOIN -->
  <div class="background_component">  

    <div class="logout_style" v-if="isUserLogged">
        <label>Hi {{ username }}, do you want to logout?</label>
        <v-btn icon variant="flat" class="transparent" @click="logout">
          <v-icon color="white">mdi-logout</v-icon>
        </v-btn>
    </div>

    <v-container fluid class="margin_element">
      <v-row>
        <v-col class="d-flex justify-center">
          <v-card flat class="transparent" href="https://openvidu.io/">
                <v-img class="image_style transparent" src="@/assets/openvidu_logo.png"/>           
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-sheet>
            <h4 class="subtitle_style">Videoconference rooms in one click</h4>
          </v-sheet>
        </v-col>
      </v-row>

      <!-- LOGIN -->
      <div v-if="!isUserLogged" class="margin_block">
        <v-row>
          <v-col>
            <v-sheet>
              <v-text-field @keydown.enter="login" variant="plain" class="element_col bg-surface-variant rounded-lg "
                v-model="username" label="Username">
                <template v-slot:prepend>
                  <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-icon class="ml-3" v-bind:="props" icon="mdi-account"/>
                    </template>
                    Username
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-sheet>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-sheet>
              <v-text-field @keydown.enter="login" variant="plain" class="element_col bg-surface-variant rounded-lg"
                v-model="password" label="Password" type="password">
                <template v-slot:prepend>
                  <v-tooltip location="bottom" >
                    <template v-slot:activator="{ props }">
                      <v-icon class="ml-3" v-bind:="props" icon="mdi-lock"/>
                    </template>
                    Password
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-sheet>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div class="roomError" v-if="loginError">
              Authentication failed. Try again.
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-sheet>
              <v-btn class="element_col rounded-lg" variant="tonal"
                :disabled="isButtonDisabled" @click="login">LOGIN</v-btn>
            </v-sheet>
          </v-col>
        </v-row>
      </div>

      <!-- JOIN -->
      <div v-else class="margin_block">
        <v-row>
            <v-col>
              <v-sheet>
                <v-form @keydown.enter="goToVideoCall" validate-on="submit" @submit.prevent="goToVideoCall">
                  <v-text-field v-model="sessionName" :rules="rules" label="Session Name">
                    <template v-slot:prepend-inner>
                      <v-tooltip location="bottom" >
                        <template v-slot:activator="{ props }">
                          <v-icon v-bind:="props" icon="mdi-video-account"/>
                        </template>
                        Session name
                      </v-tooltip>
                    </template>

                    <template v-slot:append-inner>
                      <v-tooltip location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-icon v-bind:="props" icon="mdi-cached" @click="generateSessionName"/>
                        </template>
                        Generate new session name
                      </v-tooltip>
                    </template>
                  </v-text-field>
                  
                  <v-btn type="submit" class="element_col rounded-lg" variant="tonal">
                    JOIN
                  </v-btn>
                </v-form>
              </v-sheet>
            </v-col>
          </v-row>
      </div>
    </v-container>
  </div>  
</template>

<script>
import router from '@/router';
import { animals, colors, countries, names, uniqueNamesGenerator } from 'unique-names-generator';

import AuthService from '@/api/AuthService'
import { Subscription } from 'rxjs';

  export default{
      data() {
          return{
            authService: new AuthService(),
            loginSubscription: Subscription,
            username: "",
            password: "",
            isUserLogged: false,
            loginError: false,

            sessionName: "",
            validationForm: false,
            rules: [
              value => {
                if (value && value?.length >= 6) {
                  this.validationForm = true;
                  return true
                } else {
                  this.validationForm = false;
                  if (value?.length < 6) {
                    return 'Session name is too short!'
                  } else {
                    return "Session name is required"
                  }                  
                }
              }
            ]
          }
      }, 
      async mounted() {
        this.subscribeToLogin();
        await this.authService.loginUsingLocalStorageData();
        this.username = this.authService.getUsername();
        this.password = this.authService.getPassword();
      },
      created: function() {
        this.generateSessionName();
      },
      computed: {
        isButtonDisabled() {
          return (this.username == "" || this.password == "") ;
        }
      },
      methods: {
        async login() {
          this.loginError = false;
          await this.authService.login(this.username, this.password);
        },
        subscribeToLogin() {
          this.loginSubscription = this.authService.isLoggedObs.subscribe((isLogged) => {
            this.isUserLogged = isLogged;
            this.loginError = this.authService.hadLoginError();
          });
        },
        logout() {
          this.username = "";
          this.password = "";
          this.loginError = false;
          this.authService.logout();
        },
        goToVideoCall () {
          if (this.validationForm) {
            this.sessionName = this.sessionName.replace(/ /g, '-');
            router.push({path: '/' + this.sessionName})
          }
        },
        generateSessionName() {          
          const randomName = uniqueNamesGenerator({ 
            dictionaries: [names, countries, colors, animals],
            separator: '-',
            style: 'lowerCase'
          });

          this.sessionName = randomName;
        }
      },
      
  };
</script>

<style>
.v-sheet {
  background: transparent !important;
}
.background_component {
  background: linear-gradient(
    rgba(255,255,255,.2),
    rgba(255,255,255,.2)),
    url('@/assets/background_mountain.jpg') top center no-repeat;
  background-size: cover;
  height: 100%;
  text-align: center;
  position: relative;
}
.transparent {
  background: transparent !important;
}
.image_style {
  max-width: 290px;
  margin-right: 10px;
  margin-top: 10px;
  padding: 15px;
  width: 290px;
}
.subtitle_style {
  font-size: 25px !important;
  font-weight: 300 !important;
  color: #fff;
  position: relative;
  padding-bottom: 5px;

  font: 400 15px/24px Roboto,Helvetica Neue,sans-serif;
  letter-spacing: normal;
  margin: 0 0 16px;
}
.margin_block {
  inline-size: 90%;
  margin-inline: auto;
  max-inline-size: 26rem;
}
.margin_element {
  margin-top: 8%;
}
.element_col {
  width: 100%;
  height: 50px;
}
.logout_style {
  right: 15px;
  position: absolute;
  font-size: 13px;
  color: #fff;
}
.roomError {
	font-size: 14px;
	color: #700;	
	text-align: left;
	font-weight: 600;
}
</style>
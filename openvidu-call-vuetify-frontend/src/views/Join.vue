<template>
  <!-- Compartición con JOIN -->
    <div class="background_component">  
      <div class="logout_style">
        <label>Hi admin, do you want to logout?</label>
        <v-btn icon variant="flat" class="transparent" to="/">
          <v-icon color="white">mdi-logout</v-icon>
        </v-btn>
      </div>
      
      <v-container fluid class="margin_element" >
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
  
        <v-row class="margin_row">
          <v-col>
            <v-sheet>
              <v-form validate-on="submit" @submit.prevent="submit">
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
                    <v-tooltip location="bottom" >
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind:="props" icon="mdi-cached" @click="generateNameOnClick"/>
                      </template>
                      Generate new session name
                    </v-tooltip>
                  </template>
                </v-text-field>
                <v-btn type="submit" class="element_col rounded-lg" variant="tonal"
                >JOIN</v-btn>
              </v-form>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </div>  
  </template>
  
<script>
import router from '@/router';

  export default{
      data() {
          return{
            sessionName: "",
            validationForm: false,
            rules: [
              value => {
                if (value) {
                  this.validationForm = true;
                  return true
                } else {
                  this.validationForm = false;
                  return "Session name is required"
                }
              }
            ]
          }
      },
      methods: {
        submit (event) {
          if (this.validationForm) {
            router.push({path: '/joinSession'})
          }
        },
        generateNameOnClick() {
          this.sessionName = "Prueba";
        }
      }
  };
</script>
  
<style>
  .logout_style {
    right: 15px;
    position: absolute;
    font-size: 13px;
    color: #fff;
  }
</style>


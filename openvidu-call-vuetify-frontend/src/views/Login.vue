<template>
<!-- Compartición con JOIN -->
  <div class="background_component">  
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
            <v-text-field variant="plain" class="element_col bg-surface-variant rounded-lg "
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
      <v-row class="margin_row">
        <v-col>
          <v-sheet>
            <v-text-field variant="plain" class="element_col bg-surface-variant rounded-lg"
              v-model="password" label="Password">
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
      <v-row class="margin_row">
        <v-col>
          <v-sheet>
            <v-btn class="element_col rounded-lg" variant="tonal"
              :disabled="isButtonDisabled" to="/join">LOGIN</v-btn>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>  
</template>

<script>
  export default{
      data() {
          return{
            username: "",
            password: ""
          }
      },
      computed: {
        isButtonDisabled() {
          return (this.username == "" || this.password == "") ;
        }
      }
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
.margin_row {
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

</style>
<template >
    <v-container class="bg-surface-variant display_session" fluid>
        <v-row>
            <v-col class="max_width_523" v-for="user in list_users">   
                <v-sheet rounded class="white">   
                    <v-img class="image_cam" src="@/assets/user_image.png">

                        <div class="tag_style background_tonal">{{user}}</div>

                        <div class="button_options">
                            <v-btn class="background_tonal" variant="tonal" icon>
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </div>
                    </v-img>
                </v-sheet>   
            </v-col>       
        </v-row>

        <v-row align="end" align-self="end" no-gutters >
            <v-col class="name_logo_style">
                <div class="display_name">
                    <v-img class="image_style transparent small_image" src="@/assets/logo.png"/>           
                    <div align-center class="text-subtitle-1" >{{list_users[0]}} </div>
                </div>
            </v-col>
            <v-col class="buttons_style">
                <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn class="mx-2" variant="tonal" icon @click="audio_activate = !audio_activate" v-bind:="props">
                            <v-icon>{{ audio_activate ? icon='mdi-microphone' : icon='mdi-microphone-off'}}</v-icon>
                        </v-btn>
                    </template>
                    {{ audio_activate ? 'Mute your audio' : 'Unmute your audio'}}                    
                </v-tooltip>
                <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn class="mx-2" variant="tonal" icon @click="video_activate = !video_activate" v-bind:="props">
                            <v-icon>{{ video_activate ? icon='mdi-video' : icon='mdi-video-off'}}</v-icon>
                        </v-btn>
                    </template>
                    {{ video_activate ? 'Mute your video' : 'Unmute your video'}}                    
                </v-tooltip>
                <v-btn class="mx-2" variant="tonal" icon>
                    <v-icon>mdi-monitor-share</v-icon>
                </v-btn>
                <v-btn class="mx-2" variant="tonal" icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
                <v-btn class="mx-2" color="red" variant="flat" rounded="normal" to="/join" >
                    <v-icon>mdi-phone-hangup</v-icon>
                </v-btn>
            </v-col>
        </v-row>    
        
    </v-container>
</template>

<script>
    export default{
        data() {
            return{
                list_users: ['Cam 1', 'Cam 2'],
                audio_activate: true,
                video_activate: true,
            }
        }
    }
</script>

<style>
.max_width_523 {
    max-width: 523px !important;
}
.white {
    color:white;
}
.image_cam {
    left: 0px;
    top: 0px;
    width: 500px;
    height: 500px;
}
.tag_style {
    position: absolute; z-index: 999;
    padding: 5px;
    font-weight: 700;
    border-radius: 5px 
}
.button_options {
    position: absolute;
    bottom: 0;
    z-index: 10;
    text-align: center;
    right: 0px;
}
.background_tonal {
    background-color: rgb(66 66 66);
}
.display_session {
    display: grid;
    height: 100%;
}
.small_image {
    max-width: 35px;
    max-height: 35px;
}
.display_name {
    display: flex;
    align-items: center;
}
.name_logo_style {
    place-content: center flex-start;
    align-items: center;
    flex-direction: row;
    box-sizing: border-box;
    display: flex;
    flex: 1 1 100%;
    max-width: 20%;
    margin-right: 40px;
    position: absolute;
}
.buttons_style {
    margin-right: 40px;
    place-content: center;
    align-items: center;
    flex-direction: row;
    box-sizing: border-box;
    display: flex;
    flex: 1 1 100%;
    order: 2;
    max-height: 60%;
}
</style>
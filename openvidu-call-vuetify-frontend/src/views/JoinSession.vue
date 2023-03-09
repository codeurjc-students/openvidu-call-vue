<template>    
    <v-container fluid class="margin_auto">
        <v-row>
            <v-col>
                <v-sheet class="pa-5">
                    <v-img src="@/assets/user_image.png"/>
                </v-sheet>
            </v-col>
            <v-col class="col_center">
                <v-sheet class="width_inherit pa-5">
                        <v-form >     
                            <v-banner class="banner_style" text="Set your nickname"/>                       
                            <v-text-field v-model="nickname" :rules="[notEmpty]" label="Nickname" prepend-icon="mdi-account"></v-text-field>
                            
                            <v-banner class="banner_style" text="Choose your devices"/>                            
                            <v-select v-model="camera" :items="cameras" item-text="name" label="Video device">
                                <template v-slot:prepend>
                                    <v-tooltip location="bottom" >
                                    <template v-slot:activator="{ props }">
                                            <v-icon @click="video_activate = !video_activate" v-bind:="props">
                                                {{ video_activate ? icon='mdi-video' : icon='mdi-video-off'}}
                                            </v-icon> 
                                    </template>
                                    Mute your video
                                    </v-tooltip>
                                </template>
                            </v-select>
                            <v-select v-model="microphone" :items="microphones" label="Audio device">
                                <template v-slot:prepend>
                                    <v-tooltip location="bottom" >
                                    <template v-slot:activator="{ props }">
                                        <v-icon @click="audio_activate = !audio_activate" v-bind:="props">
                                            {{ audio_activate ? icon='mdi-microphone': icon='mdi-microphone-off'}}
                                        </v-icon>
                                    </template>
                                    Mute your audio
                                    </v-tooltip>
                                </template>
                            </v-select>
                            <v-btn class="element_col rounded-lg" variant="tonal"
                            to="/session">Join session</v-btn>
                        </v-form>
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default{
        data() {
            return {
                nickname: 'Nick original', 
                nickFinal: 'Nick original',               
                cameras: ['OBS', 'Camara no tan buena'],
                camera: 'OBS',
                video_activate: true,
                audio_activate: true,
                microphones: ['Realteck', 'Micro de cámara'],
                microphone: 'Realteck',
            }
        }, methods: {
            notEmpty (value) {
                if (value != "") {
                    this.nickFinal = this.nickname;
                } else {
                    this.nickname = this.nickFinal;
                }
            }
        }
    }
</script>

<style>
.col_center {
    place-content: center;
    align-items: center;
    flex-direction: row;
    display: flex;
    box-sizing: border-box;
    flex: 1 1 100%;
    max-width: 55%;
}
.width_inherit {
    width: inherit;
}
.margin_auto {
    margin: auto;
}
.banner_style {
    margin-bottom: 10px;
    font-weight: 700;
}
</style>
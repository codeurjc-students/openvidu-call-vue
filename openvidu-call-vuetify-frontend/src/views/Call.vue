<template>   
    <!-- JOINSESSION --> 
    <v-container v-if="isChoosingOptions" fluid class="margin_auto">
        <v-row>
            <v-col>
                <v-sheet class="pa-5" v-if="session">
                    <user-video :stream-manager="mainStreamManager" /> 
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
                                    {{ video_activate ? 'Mute your video' : 'Unmute your video'}}
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
                                    {{ audio_activate ? 'Mute your audio' : 'Unmute your audio'}}
                                    </v-tooltip>
                                </template>
                            </v-select>
                            <v-btn class="element_col rounded-lg" variant="tonal" @click="changePage">
                                Join session
                            </v-btn>
                        </v-form>
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>

    <!-- SESSION -->
    <v-container v-else class="bg-surface-variant display_session" fluid>
        <v-row>
            <v-col class="max_width_523" id="video-container">   
                <v-sheet rounded class="white">   
                    <user-video :stream-manager="publisher" @click.native="updateMainVideoStreamManager(publisher)" />
                </v-sheet>   
            </v-col>     
            
            <v-col class="max_width_523" v-for="sub in subscribers">                
                <user-video  :key="sub.stream.connection.connectionId" :stream-manager="sub"
                    @click.native="updateMainVideoStreamManager(sub)" />
            </v-col>
        </v-row>

        <v-row align="end" align-self="end" no-gutters >
            <v-col class="name_logo_style">
                <div class="display_name">
                    <v-img class="image_style transparent small_image" src="@/assets/logo.png"/>           
                    <div align-center class="text-subtitle-1" >{{myUserName}} </div>
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
                <v-btn class="mx-2" color="red" variant="flat" rounded="normal" @click="changePage" >
                    <v-icon>mdi-phone-hangup</v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>

</template>

<script>
    import { OpenVidu } from "openvidu-browser";
    import UserVideo from "../components/UserVideo.vue";
    import SessionService from "@/api/SessionService";
    
    export default{
        components: {
            UserVideo,
        },
        data() {
            return {
                sessionService: new SessionService(),

                mySessionId: this.$route.params.roomName,
                nickname: 'Nick', 
                myUserName: this.nickname,     

                // OpenVidu objects
                OV: undefined,
                session: undefined,
                mainStreamManager: undefined,
                publisher: undefined,
                subscribers: [],

                // Control joinSession
                cameras: ['OBS', 'Camara no tan buena'],
                camera: 'OBS',
                video_activate: true,
                audio_activate: true,
                microphones: ['Realteck', 'Micro de cámara'],
                microphone: 'Realteck',

                recordingEnabled: false,
                recordingList: [],
                tokens: {
                    webcam: "",
                    screen: "",
                },

                // Control session
                isChoosingOptions: true,

            }
        }, 
        created() {
            this.myUserName = this.nickname;

            // Initialize different components
            this.OV = new OpenVidu();

            this.session = this.OV.initSession();

            // Specify session´s behavior
            this.session.on("streamCreated", ({ stream }) => {
                const subscriber = this.session.subscribe(stream);
                this.subscribers.push(subscriber);                
            });

            this.session.on("streamDestroyed", ({ stream }) => {
                const index = this.subscribers.indexOf(stream.streamManager, 0);
                if (index >= 0) {
                    this.subscribers.splice(index, 1);
                }
            });

            this.session.on("exception", ({ exception }) => {
                console.warn(exception);
            });

            let publisher = this.OV.initPublisher(undefined, {
                audioSource: undefined, 
                videoSource: undefined, 
                publishAudio: true, 
                publishVideo: true, 
                resolution: "523x480", 
                frameRate: 30, 
                insertMode: "APPEND", 
                mirror: false, 
            });

            this.mainStreamManager = publisher;

            this.publisher = publisher;
            
            window.addEventListener("beforeunload", this.leaveSession);
        },
        methods: {
            notEmpty (value) {
                if (value != "") {
                    this.myUserName = this.nickname;
                } else {
                    this.nickname = this.myUserName;
                }
            },
            connectToSession() {
                // Inicializate tokens and connect to session
                this.initializeTokens().then(() => {                
                    this.session.connect(this.tokens.webcam, { clientData: this.myUserName })
                        .then(() => {
                            let publisher = this.OV.initPublisher(undefined, {
                                audioSource: undefined, 
                                videoSource: undefined, 
                                publishAudio: true, 
                                publishVideo: true, 
                                resolution: "523x480", 
                                frameRate: 30, 
                                insertMode: "APPEND", 
                                mirror: false, 
                            });

                            this.mainStreamManager = publisher;

                            this.publisher = publisher;

                            this.session.publish(this.publisher);
                    })
                    .catch((error) => {
                        console.log("There was an error connecting to the session:", error.code, error.message);
                    });
                });
            },
            changePage() {
                this.connectToSession();
                this.isChoosingOptions = !this.isChoosingOptions;                             
            },      
            leaveSession() {
                // --- 7) Leave the session by calling 'disconnect' method over the Session object ---
                if (this.session) this.session.disconnect();

                // Empty all properties...
                this.session = undefined;
                this.mainStreamManager = undefined;
                this.publisher = undefined;
                this.subscribers = [];
                this.OV = undefined;

                // Remove beforeunload listener
                window.removeEventListener("beforeunload", this.leaveSession);
            },      
            updateMainVideoStreamManager(stream) {
                if (this.mainStreamManager === stream) return;
                this.mainStreamManager = stream;
            },
            async initializeTokens() {
                var nick = "";
                const response = await this.sessionService.getTokens(this.mySessionId, nick);
                this.recordingEnabled = response.recordingEnabled;
                this.recordingList = response.recordings;
                this.tokens = {
                    webcam: response.cameraToken,
                    screen: response.screenToken
                };
            },    
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
    .max_width_523 {
        max-width: 523px !important;
    }
    .white {
        color:white;
    }
    #video-container video {
        position: relative;
        float: left;
        cursor: pointer;
    }
    #video-container p {
        position: absolute; 
        z-index: 999;
        padding: 5px;
        font-weight: 700;
        border-radius: 5px;

        background-color: rgb(66 66 66);
        padding-right: 5px;
        padding-left: 5px;
        color: white;
        font-weight: bold;
        border-bottom-right-radius: 4px;
    }
    video {
        width: 100%;
        height: auto;
    }
    .button_options {
        position: absolute;
        bottom: 0;
        z-index: 10;
        text-align: center;
        right: 0px;
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
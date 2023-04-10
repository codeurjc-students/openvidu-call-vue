<template>    
    <v-container fluid class="margin_auto">
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
                            <v-btn class="element_col rounded-lg" variant="tonal" @click="joinSession">
                                Join session
                            </v-btn>
                        </v-form>
                </v-sheet>
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
                nickname: 'Nick original', 
                myUserName: this.nickname,     

                // OpenVidu objects
                OV: undefined,
                session: undefined,
                mainStreamManager: undefined,
                publisher: undefined,
                subscribers: [],

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
            }
        }, methods: {
            notEmpty (value) {
                if (value != "") {
                    this.nickFinal = this.nickname;
                } else {
                    this.nickname = this.myUserName;
                }
            },
            joinSession() {                
                this.OV = new OpenVidu();

                this.session = this.OV.initSession();

                // --- 3) Specify the actions when events take place in the session ---

                // On every new Stream received...
                this.session.on("streamCreated", ({ stream }) => {
                    const subscriber = this.session.subscribe(stream);
                    this.subscribers.push(subscriber);
                });

                // On every Stream destroyed...
                this.session.on("streamDestroyed", ({ stream }) => {
                    const index = this.subscribers.indexOf(stream.streamManager, 0);
                    if (index >= 0) {
                        this.subscribers.splice(index, 1);
                    }
                });

                // On every asynchronous exception...
                this.session.on("exception", ({ exception }) => {
                    console.warn(exception);
                });

                this.initializeTokens(this.mySessionId, this.myUserName).then(() => {
                    this.session.connect(this.tokens.webcam, { clientData: this.myUserName })
                        .then(() => {
                            let publisher = this.OV.initPublisher(undefined, {
                                audioSource: undefined, // The source of audio. If undefined default microphone
                                videoSource: undefined, // The source of video. If undefined default webcam
                                publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                                publishVideo: true, // Whether you want to start publishing with your video enabled or not
                                resolution: "640x480", // The resolution of your video
                                frameRate: 30, // The frame rate of your video
                                insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
                                mirror: false, // Whether to mirror your local video or not
                            });

                            
                            // Set the main video in the page to display our webcam and store our Publisher
                            this.mainStreamManager = publisher;

                            this.publisher = publisher;

                            // --- 6) Publish your stream ---
                            this.session.publish(this.publisher);
                    })
                    .catch((error) => {
                        console.log("There was an error connecting to the session:", error.code, error.message);
                    });
                });
                             
            },            
            updateMainVideoStreamManager(stream) {
                if (this.mainStreamManager === stream) return;
                this.mainStreamManager = stream;
            },
            async initializeTokens(sessionId, nickname) {
                const response = await this.sessionService.getTokens(sessionId, nickname);
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
</style>
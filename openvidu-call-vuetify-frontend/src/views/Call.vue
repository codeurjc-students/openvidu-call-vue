<template>   
    <!-- JOINSESSION --> 
    <v-container v-if="isChoosingOptions" fluid class="margin_auto">
        <v-row>
            <v-col>
                <v-sheet class="pa-5" v-if="sessionPublisher">
                    <user-video :stream-manager="mainStreamManager" :key="mainStreamManager"/>                     
                </v-sheet>
            </v-col>
            <v-col class="col_center">
                <v-sheet class="width_inherit pa-5">
                        <v-form >     
                            <v-banner class="banner_style" text="Set your nickname"/>                       
                            <v-text-field v-model="nickname" :rules="[notEmpty]" label="Nickname" prepend-icon="mdi-account"></v-text-field>
                            
                            <v-banner class="banner_style" text="Choose your devices"/>                            
                            <v-select v-model="camera" :items="cameras" item-title="name" item-value="id" label="Video device" @update:modelValue="updateInputSource">
                                <template v-slot:prepend>
                                    <v-tooltip location="bottom">
                                        <template v-slot:activator="{ props }">
                                            <v-avatar v-bind:="props" @click="changeActiveVideo" :color="setBackgroundColorVideo">                                                 
                                                <v-icon>
                                                    {{ video_activate ? icon='mdi-video' : icon='mdi-video-off'}}
                                                </v-icon> 
                                            </v-avatar>                                            
                                        </template>
                                        {{ video_activate ? 'Mute your video' : 'Unmute your video'}}
                                    </v-tooltip>
                                </template>
                            </v-select>
                            <v-select v-model="microphone" :items="microphones" item-title="name" item-value="id" label="Audio device" @update:modelValue="updateInputSource">
                                <template v-slot:prepend>
                                    <v-tooltip location="bottom" >
                                        <template v-slot:activator="{ props }">
                                            <v-avatar v-bind:="props" @click="changeActiveAudio" :color="setBackgroundColorAudio">
                                                <v-icon>
                                                    {{ audio_activate ? icon='mdi-microphone': icon='mdi-microphone-off'}}
                                                </v-icon>
                                            </v-avatar>
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
                    <user-video :stream-manager="publisher" :key="publisher" @click.native="updateMainVideoStreamManager(publisher)" />
                </v-sheet>   
            </v-col>
            
            <v-col class="max_width_523" v-for="(sub, indexSub) in subscribers" :key="indexSub" id="video-container">   
                <div class="container-video-button">           
                    <user-video :key="sub.stream.connection.connectionId" :stream-manager="sub"
                        @click.native="updateMainVideoStreamManager(sub)" />
                    <div class="circles_options left" v-if="!hasAudioActive(indexSub)">
                        <v-avatar size="small" color="red">
                            <v-icon size="small" icon="mdi-microphone-off"/>
                        </v-avatar>   
                    </div>
                    <div class="circles_options right">
                        <v-menu>
                            <template v-slot:activator="{ props }">
                                <v-btn class="background_tonal" variant="tonal" size="x-small" icon="mdi-dots-vertical" v-bind="props"/>
                            </template>
                            <v-list>
                                <v-list-item v-for="(option, i) in optionsSubscriber[indexSub]" :key="i" :value="option" @click.stop="actionListOptionsSubscriber(option, sub)">
                                    <template v-slot:prepend v-if="option.name == 'mute'">
                                        <v-icon :icon="option.activatedLocal ? 'mdi-volume-high' : 'mdi-volume-off'"/>
                                        <v-list-item-title v-text="option.activatedLocal ? 'Mute sound' : 'Unmute sound'"/> 
                                    </template>                                    
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </div>
                </div>
            </v-col>
        </v-row>

        <v-row align="end" align-self="end" no-gutters >
            <v-col class="name_logo_style">
                <div class="display_name">
                    <v-img class="image_style transparent small_image" src="@/assets/logo.png"/>           
                    <div align-center class="text-style-session-name" >{{myUserName}} </div>
                </div>
            </v-col>
            <v-col class="buttons_style">
                <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn class="mx-2" :variant="setVariantAudio" icon @click="changeMidSessionAudio" v-bind:="props" :color="setBackgroundColorAudio">
                            <v-icon>{{ audio_activate ? icon='mdi-microphone' : icon='mdi-microphone-off'}}</v-icon>
                        </v-btn>
                    </template>
                    {{ audio_activate ? 'Mute your audio' : 'Unmute your audio'}}                    
                </v-tooltip>
                <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn class="mx-2" :variant="setVariantVideo" icon @click="changeMidSessionVideo" v-bind:="props" :color="setBackgroundColorVideo">
                            <v-icon>{{ video_activate ? icon='mdi-video' : icon='mdi-video-off'}}</v-icon>
                        </v-btn>
                    </template>
                    {{ video_activate ? 'Mute your video' : 'Unmute your video'}}                    
                </v-tooltip>

                <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn class="mx-2" :variant="setVariantShareScreen" icon @click="shareScreen" v-bind:="props" :color="setBackgroundColorShareScreen">
                            <v-icon>mdi-monitor-share</v-icon>
                        </v-btn>
                    </template>
                    {{ screen_activate ? 'Disable screen share' : 'Enable screen share' }}                    
                </v-tooltip>

                
                <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn class="mx-2" color="red" variant="flat" rounded="normal" @click="goToHome" v-bind:="props">
                            <v-icon>mdi-phone-hangup</v-icon>
                        </v-btn>
                    </template>
                    Leave the session                    
                </v-tooltip>

            </v-col>
        </v-row>
    </v-container>

</template>

<script>
    import router from '@/router';
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
                nickname: 'OpenVidu_User' + Math.floor(Math.random() * 100), 
                myUserName: '',     

                // OpenVidu objects publisher
                OVPublisher: undefined,
                sessionPublisher: undefined,
                mainStreamManager: undefined,
                publisher: undefined,
                subscribers: [],

                // OpenVidu objects screen share                
                OVScreenShare: undefined,
                sessionScreenShare: undefined,
                publisherScreen: undefined,
                screen_activate: false,

                // Control JoinSession
                cameras: [],
                camera: undefined,
                microphones: [],
                microphone: undefined,
                video_activate: true,
                audio_activate: true,
                
                // Response initializeTokens
                broadcastingEnabled: false,
                recordingEnabled: false,
                recordingList: [],
                tokens: {
                    webcam: "",
                    screen: "",
                },
                isRecordingActive: false,
                isBroadcastingActive: false,

                // Control session
                isChoosingOptions: true,
                optionsSubscriber: []

            }
        },        
        created() {
            // Initialize different components
            this.myUserName = this.nickname;

            this.OVPublisher = new OpenVidu();
            this.OVScreenShare = new OpenVidu();

            this.sessionPublisher = this.OVPublisher.initSession();
            this.sessionScreenShare = this.OVScreenShare.initSession();

            // Specify session´s publisher behavior
            this.sessionPublisher.on("streamCreated", ({ stream }) => {
                const subscriber = this.sessionPublisher.subscribe(stream);
                this.subscribers.push(subscriber); 
                this.optionsSubscriber.push(
                    [
                        {name: "mute",
                        activated: subscriber.stream.audioActive,
                        activatedLocal: true}
                    ]
                );              
            });

            this.sessionPublisher.on("streamDestroyed", ({ stream }) => {
                const index = this.subscribers.indexOf(stream.streamManager, 0);
                if (index >= 0) {
                    this.subscribers.splice(index, 1);
                    this.optionsSubscriber.splice(index, 1);
                }                
            });

            this.sessionPublisher.on("exception", ({ exception }) => {
                console.warn(exception);
            });

            this.sessionPublisher.on("streamPropertyChanged", ({changedProperty, stream}) => {
                if (changedProperty === 'audioActive') {
                    // Find the index of the stream that changed the property
                    var indexSubscriber = this.subscribers.findIndex((element) => element.stream.streamId == stream.streamId);
                    // Change the activated property in options mute of that subscriber
                    if (indexSubscriber != -1) {
                        var muteOptionOfSubscriber = this.optionsSubscriber[indexSubscriber].find((element) => element.name == 'mute');
                        muteOptionOfSubscriber.activated = !muteOptionOfSubscriber.activated;
                    }
                }           
            })

            // Specify session´s screen share behavior
            this.sessionScreenShare.on("streamDestroyed", ({ stream }) => {
                const index = this.subscribers.indexOf(stream.streamManager, 0);
                if (index >= 0) {
                    this.subscribers.splice(index, 1);
                }                
            });

            this.sessionScreenShare.on("exception", ({ exception }) => {
                console.warn(exception);
            });

            // Get input sources
            this.OVPublisher.getDevices().then(devices => {
                var videoDevices = devices.filter(device => device.kind === 'videoinput');
                for (var numDevice in videoDevices) {
                    this.cameras.push({name: videoDevices[numDevice].label , id: videoDevices[numDevice].deviceId});
                }

                var microphoneDevices = devices.filter(device => device.kind === 'audioinput');
                for (var numDevice in microphoneDevices) {
                    this.microphones.push({name: microphoneDevices[numDevice].label , id: microphoneDevices[numDevice].deviceId});
                }

                this.camera = this.cameras[0].id;
                this.microphone = this.microphones[0].id;
                this.updateInputSource();
                
            });            
            
            window.addEventListener("beforeunload", this.leaveSession);
        },
        computed: {
            setBackgroundColorVideo() {
                if (this.video_activate) {
                    return "";
                } else {
                    return "red";
                }   
            },
            setVariantVideo() {
                if (this.video_activate) {
                    return 'tonal'
                } else {
                    return 'flat';
                }
            },
            setBackgroundColorAudio() {
                if (this.audio_activate) {
                    return "";
                } else {
                    return "red";
                }   
            },
            setVariantAudio() {
                if (this.audio_activate) {
                    return 'tonal'                    
                } else {
                    return 'flat';
                }
            },
            setBackgroundColorShareScreen() {
                if (this.screen_activate) {
                    return "blue";
                } else {
                    return "";
                }   
            },
            setVariantShareScreen() {
                if (this.screen_activate) {
                    return 'flat';                    
                } else {
                    return 'tonal';
                }
            }
        },
        methods: {
            notEmpty (value) {
                if (value != "") {
                    this.myUserName = this.nickname;
                } else {
                    this.nickname = this.myUserName;
                }
            },
            changeActiveVideo() {
                this.video_activate = !this.video_activate;
                this.updateInputSource();
            },
            changeActiveAudio() {
                this.audio_activate = !this.audio_activate;
                this.updateInputSource();                
            },
            actionListOptionsSubscriber(option, subscriber) {
                switch (option.name){
                    case 'mute': 
                        option.activatedLocal = !option.activatedLocal;
                        subscriber.subscribeToAudio(option.activatedLocal);
                        break;
                }           
            },
            updateInputSource() {
                let publisher = this.OVPublisher.initPublisher(undefined, {
                    audioSource: this.microphone, 
                    videoSource: this.camera, 
                    publishAudio: this.audio_activate, 
                    publishVideo: this.video_activate, 
                    resolution: "523x480", 
                    frameRate: 30, 
                    insertMode: "APPEND", 
                    mirror: false, 
                });

                this.mainStreamManager = publisher;

                this.publisher = publisher;
            },
            changeMidSessionAudio() {
                this.audio_activate = !this.audio_activate;
                this.publisher.publishAudio(this.audio_activate);
            },
            changeMidSessionVideo() {
                this.video_activate = !this.video_activate;
                this.publisher.publishVideo(this.video_activate);
            },
            hasAudioActive(index) {
                var muteOptionOfSubscriber = this.optionsSubscriber[index].find((element) => element.name == 'mute');
                if (muteOptionOfSubscriber.activated) {
                    return true;
                } else {
                    return false;
                }                
            },
            connectToSession() {
                // Inicializate tokens and connect to session
                this.initializeTokens().then(() => {
                    this.sessionPublisher.connect(this.tokens.webcam, { clientData: this.myUserName }).then(() => {                            
                            this.sessionPublisher.publish(this.publisher);
                    })
                    .catch((error) => {
                        console.log("There was an error connecting to the session:", error.code, error.message);
                    });

                    this.sessionScreenShare.connect(this.tokens.screen, { clientData: this.myUserName })
                    .catch((error) => {
                        console.log("There was an error connecting to the session:", error.code, error.message);
                    });
                });
            },
            shareScreen() {                
                if (!this.screen_activate) {                    
                    this.publisherScreen = this.OVScreenShare.initPublisher(undefined, {
                        videoSource: "screen", 
                        publishAudio: false, 
                        resolution: "523x480", 
                        frameRate: 30, 
                        insertMode: "APPEND", 
                    });                        
            
                    this.publisherScreen.once('accessAllowed', (event)=> {
                        this.publisherScreen.stream.getMediaStream().getVideoTracks()[0].addEventListener('ended', () => {
                            console.log('User pressed the "Stop sharing button"');
                            this.sessionScreenShare.unpublish(this.publisherScreen);
                            this.publisherScreen = undefined;

                            this.screen_activate = false;
                        });
                        
                        this.sessionScreenShare.publish(this.publisherScreen);
                    });


                    this.publisherScreen.once('accessDenied', (event) => {
                        console.warn('ScreenShare: Access Denied');
                    });                    
                } else {
                    this.sessionScreenShare.unpublish(this.publisherScreen);
                    this.publisherScreen = undefined;
                }                
                
                this.screen_activate = !this.screen_activate;
            },
            changePage() {
                this.isChoosingOptions = false;
                this.connectToSession();                                    
            },      
            goToHome() {
                this.leaveSession();
                router.push({path: '/' })
            },
            leaveSession() {
                if (this.sessionPublisher) this.sessionPublisher.disconnect();
                if (this.sessionScreenShare) this.sessionScreenShare.disconnect();

                this.sessionPublisher = undefined;
                this.sessionScreenShare = undefined;
                this.mainStreamManager = undefined;
                this.publisher = undefined;
                this.publisherScreen = undefined;
                this.subscribers = [];
                this.OVPublisher = undefined;
                this.OVScreenShare = undefined;

                window.removeEventListener("beforeunload", this.leaveSession);
            },      
            updateMainVideoStreamManager(stream) {
                if (this.mainStreamManager === stream) return;
                this.mainStreamManager = stream;
            },
            async initializeTokens() {
                var nick = "";
                const response = await this.sessionService.getTokens(this.mySessionId, nick);
                this.broadcastingEnabled = response.broadcastingEnabled;
                this.recordingEnabled = response.recordingEnabled;
                this.recordingList = response.recordings;
                this.tokens = {
                    webcam: response.cameraToken,
                    screen: response.screenToken
                };
                this.isRecordingActive = response.isRecordingActive;
                this.isBroadcastingActive = response.isBroadcastingActive;
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
    .container-video-button {
        position: relative;
        float: left;
    }
    .circles_options {
        position: absolute;
        bottom: 0;
        z-index: 10;
        text-align: center;
    }
    .right {
        right: 0px;
    }
    .left {
        left: 0px;
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
    .text-style-session-name {
        font-family: Ubuntu,sans-serif;
        font-weight: 700;
        font-size: 15px;
        height: fit-content;
        padding: 0 15px;
        margin-top: 8px;
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
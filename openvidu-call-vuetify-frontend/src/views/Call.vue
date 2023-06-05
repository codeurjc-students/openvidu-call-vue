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
    <v-container v-else class="bg-surface-variant display_session" fluid style="flex-direction: column;">
        <v-row style="height: 100%;">            
            <v-col id="video-container" style="height: 100%; width: 100%">     
                <div id="layout" class="layout"> 
                    <user-video class="OT_root OT_publisher" :stream-manager="publisher" :key="publisher" @click.native="updateMainVideoStreamManager(publisher)" />
                    
                    <div class="OT_root OT_subscriber" v-for="(sub, indexSub) in subscribers" :key="indexSub">
                        <user-video :key="sub.stream.connection.connectionId" :stream-manager="sub"
                            @click.native="updateMainVideoStreamManager(sub)" style="height: 100%;"/>
                        <div class="circles_options left" v-if="!hasAudioActive(indexSub)">
                            <v-avatar size="x-small" color="red">
                                <v-icon size="x-small" icon="mdi-microphone-off"/>
                            </v-avatar>   
                        </div>
                        <div class="circles_options right">
                            <v-menu>
                                <template v-slot:activator="{ props }">
                                    <v-btn class="background_tonal" variant="tonal" size="x-small" icon v-bind="props">
                                        <v-icon size="x-small" icon="mdi-dots-vertical"/>
                                    </v-btn>
                                </template>
                                <v-list size="x-small">
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
                </div>    
            </v-col>
        </v-row>
   
        <v-row align="end" align-self="end" no-gutters>
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
    import initLayoutContainer from 'opentok-layout-js'
    
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
                optionsSubscriber: [],
                layout: undefined

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
            this.sessionPublisher.on("streamCreated", async ({ stream }) => {
                const subscriber = this.sessionPublisher.subscribe(stream);
                this.subscribers.push(subscriber); 
                await this.optionsSubscriber.push(
                    [
                        {name: "mute",
                        activated: subscriber.stream.audioActive,
                        activatedLocal: true}
                    ]
                );          
                this.updateLayout();    
            });

            this.sessionPublisher.on("streamDestroyed", async ({ stream }) => {
                const index = this.subscribers.indexOf(stream.streamManager, 0);
                if (index >= 0) {
                    this.subscribers.splice(index, 1);
                    await this.optionsSubscriber.splice(index, 1);
                    this.updateLayout();  
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
            async changePage() {
                this.isChoosingOptions = false;
                await this.connectToSession();       
                this.initiateOpentokLayout();                     
            },    
            initiateOpentokLayout() {
                window.onresize = () => {
                    this.updateLayout();
                }

                var layoutContainer = document.getElementById("layout");
                var layoutOptions = {
                    maxRatio: 3 / 2,      // The narrowest ratio that will be used (default 2x3)
                    minRatio: 9 / 20,     // The widest ratio that will be used (default 16x9)
                    fixedRatio: false,    /* If this is true then the aspect ratio of the video is maintained
                    and minRatio and maxRatio are ignored (default false) */
                    bigClass: 'OV_big',   // The class to add to elements that should be sized bigger
                    bigPercentage: 0.8,   // The maximum percentage of space the big ones should take up
                    bigFixedRatio: false, // fixedRatio for the big ones
                    bigMaxRatio: 3 / 2,   // The narrowest ratio to use for the big elements (default 2x3)
                    bigMinRatio: 9 / 16,  // The widest ratio to use for the big elements (default 16x9)
                    bigFirst: true,       // Whether to place the big one in the top left (true) or bottom right
                    smallAlignItems: 'center', // How to align the small row or column of items if there is a big one
                };

                this.layout = initLayoutContainer(layoutContainer, layoutOptions);
                this.layout.layout();
            },
            updateLayout() {
                this.layout.layout();
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
                withScopeId.updateLayout();
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
  .layout {
      position: relative;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      min-width: 350px !important;
      min-height: 100%;
      width: inherit;
      height: 100% !important;
      max-height: 100%;
  }
  .OT_root,
  .OT_root * {
      color: #ffffff;
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      vertical-align: baseline;
      max-height: 100%;
  }
  .OT_publisher,
  .OT_subscriber {
      position: relative;
      min-width: 0px;
      min-height: 0px;
      padding: 3px;      
      transition-duration: 0.5s;
      transition-timing-function: ease-in-out;
  }
  .OT_publisher .OT_video-element,
  .OT_subscriber .OT_video-element {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform-origin: 0 0;
  }
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
        height: 100%;
    }
    .circles_options {
        position: absolute;
        bottom: 0;
        z-index: 10;
        text-align: center;
        width: 25px;
        height: 25px;
    }
    .right {
        right: 0px;
    }
    .left {
        left: 0px;
    }
    .display_session {
        display: flex;
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
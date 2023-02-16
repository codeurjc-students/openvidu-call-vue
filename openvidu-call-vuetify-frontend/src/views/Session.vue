<template>
    <v-container>
        <v-row>
            <v-col v-for="user in list_users">                
                {{user}}
                <p>Imagen de la cámara</p>
                <v-btn variant="tonal" icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
            </v-col>       
        </v-row>
    </v-container>
    <v-container>
        <v-row>
            <v-col>Logo </v-col>
            <v-col>{{list_users[0]}} </v-col>
            <v-col>
                <v-btn variant="tonal" icon>
                    <v-icon>mdi-microphone</v-icon>
                </v-btn>
            </v-col>
            <v-col>
                <v-btn variant="tonal" icon>
                    <v-icon>mdi-video</v-icon>
                </v-btn>
            </v-col>
            <v-col>
                <v-btn variant="tonal" icon>
                    <v-icon>mdi-monitor-share</v-icon>
                </v-btn>
            </v-col>
            <v-col>
                <v-btn variant="tonal" icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
            </v-col>
            <v-col>
                <v-btn color="red" variant="flat" rounded="normal" to="/join" >
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
                list_users: ['Cam 1', 'Cam 2']
            }
        }
    }
</script>

<style>
    
</style>
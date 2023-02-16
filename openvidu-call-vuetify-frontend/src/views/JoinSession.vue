<template>    
    <v-container>
        <v-text-field v-model="user_nick"></v-text-field>
        <v-combobox :items="cameras"/>
        <v-combobox :items="microphones"/>
        <v-btn variant="tonal" to="/session">Join session</v-btn>
    </v-container>
</template>

<script>
    export default{
        data() {
            return {
                user_nick: 'Nick original',
                cameras: ['OBS', 'Camara no tan buena'],
                microphones: ['Realteck', 'Micro de cámara']
            }
        },
    }
</script>
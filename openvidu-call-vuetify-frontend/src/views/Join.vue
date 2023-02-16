<template>
  <h1>Logo openVidu</h1>
  <h2>Videoconference rooms in one click</h2>

  <input v-model="chat_room"/>
  <button>Generate new session name</button>
  <v-btn variant="tonal" to="/joinSession">JOIN</v-btn>
  <v-btn to="/">Hi admin, do you want to logout?</v-btn>

</template>

<script setup>
  
</script>

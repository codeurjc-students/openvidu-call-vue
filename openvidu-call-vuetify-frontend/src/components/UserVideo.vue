<template>
<div v-if="streamManager">
	<ov-video class="OT_video-element" :stream-manager="streamManager"/>
	<div><p>{{ clientData }}</p></div>
</div>
</template>

<script>
import OvVideo from './OvVideo';

export default {
	name: 'UserVideo',

	components: {
		OvVideo,
	},

	props: {
		streamManager: Object,
	},

	computed: {
		clientData () {
			const { clientData } = this.getConnectionData();
			return clientData;
		},
	},

	methods: {
		getConnectionData () {
			const { connection } = this.streamManager.stream;
			if (connection != undefined) {
				var nickname = connection.data.toString().replace('%/%{}', '');
				return JSON.parse(nickname);
			} else {
				return '';
			}		
		},
	},
};
</script>

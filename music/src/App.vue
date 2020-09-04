<template>
  <div id="app">
    <router-view />
    <audio controls ref="audio" :src="audioSrc"></audio>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const {
  mapState: musicState,
  mapActions: musicActions,
} = createNamespacedHelpers("musicStore");
export default {
  created() {
    this.$nextTick(() => {
      
      this.setAudio(this.$refs.audio);
    });
  },
  computed: {
    ...musicState(["audioSrc", "audio", "status"]),
  },
  methods: {
    ...musicActions(["setAudio"]),
  },
};
</script>

<style lang="less">
body {
  background-color:#0c0c0c;
}
#app {
  .auto-img {
    width: 100%;
    display: block;
  }
  audio {
    opacity: 0;
    position: fixed;
    z-index: -1;
  }
  .clearfix::after {
    content: "";
    display: block;
    clear: both;
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
}
</style>

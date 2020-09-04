<template>
  <div class="todaysongs">
    <div class="songsdan-box">
    <van-nav-bar title="新歌推荐" left-arrow @click-left="onClickLeft" fixed />
    <div class="songsdan-s-box">
        <!-- 歌单列表 -->
        <div class="songsdan-list-box">
          <van-sticky :offset-top="48">
            <div class="playAll clearfix">
              <div class="img-box fl">
                <img class="auto-img" src="../assets/images/play-w.png" alt />
              </div>
              <div class="text-box fl">
                播放全部
                <span class="text-num">(共{{trackCount}}首)</span>
              </div>
            </div>
          </van-sticky>
            <div class="songsdan-list clearfix" v-for="(item,index) in songsListData" :key="index" @click="getSongId(item)">
              <div class="paiming fl">{{index+1}}</div>
              <div class="songs-detail fl">
                <div class="songs-name">{{item.name}}</div>
                <div class="songs-ar">
                  <span v-for="(v,i) in item.ar" :key="i">{{v.name}}</span> -
                  <span>{{item.al.name}}</span>
                </div>
              </div>
              <div class="play-img-box fr">
                <img class="auto-img" src="../assets/images/nowplay.png" alt />
              </div>
            </div>
        </div>
      </div>
  </div>
  </div>
</template>

<script>
import "../assets/less/ToDaySongs.less";
import { createNamespacedHelpers } from "vuex";
const {
  mapState: musicState,
  mapActions: musicActions,
} = createNamespacedHelpers("musicStore");
export default {
  data() {
    return {
      songsListData:[],
      trackCount:0,
      danData:[],
      creatorData:[]
    };
  },
  created() {
      this.getRecommendNew()
  },
  computed: {
    ...musicState([
      "nowSongId"
    ]),
  },
  methods: {
    onClickLeft() {
      this.$router.back();
    },
    getRecommendNew() {
      this.axios({
        method: "GET",
        url: "http://localhost:3000/top/list?",
        params: {
          id:3779629
        },
      }).then(result =>{
          // 
          this.songsListData = result.data.playlist.tracks
          this.trackCount = result.data.playlist.trackCount
          this.danData= result.data.playlist
          this.creatorData = result.data.playlist.creator
          
      });
    },
    getSongId(item){
      this.$router.push({ name: "PlaySong"});
      this.getNowId(item.id);
      this.addPlayedMusic(item);
       this.axios({
        method: "GET",
        url: "http://localhost:3000/song/url",
        params: {
          id: this.nowSongId,
        },
      })
        .then((result) => {
          let url = result.data.data[0].url;
          this.changeAudioSrc(url).then((audio) => {
            audio.load();
            audio.play();
          });
          this.sliderTime();
        })
        .catch((err) => {
          
        });
    },
    ...musicActions(["changeAudioSrc", "addPlayedMusic", "getNowId"]),
  },
};
</script>

<style lang="less" scoped>
</style>
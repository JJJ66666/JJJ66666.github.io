<template>
  <div class="singerdetail">
    <div class="singerdetail-bg" :style="{backgroundImage:`url('${singerData.picUrl}')`}"></div>
    <div class="singerdetail-box">
      <div class="title-box">
        <div class="title-bg"></div>
        <van-nav-bar :title="singerData.name" left-arrow @click-left="goback" fixed />
      </div>
      <div class="singerdetail-s-box">
        <div class="singer-img-box">
          <div class="img-box">
            <img class="auto-img" :src="singerData.picUrl" alt />
          </div>
          <div class="singer-text">
            <div class="singer-name">{{singerData.name}}</div>
          </div>
        </div>
        <!-- 歌单列表 -->
        <div class="singerdetail-list-box">
          <van-sticky :offset-top="48">
            <div class="playAll clearfix">
              <div class="img-box fl">
                <img class="auto-img" @click="clickAllSongs" src="../assets/images/play-w.png" alt />
              </div>
              <div class="text-box fl">
                播放全部
                <span class="text-num">(共{{singerSong.length}}首)</span>
              </div>
            </div>
          </van-sticky>
          <div class="singerdetail-list clearfix" v-for="(item,index) in singerSong" :key="index" @click=" getSongsId(item)">
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
import "../assets/less/SingerDetail.less";
import { createNamespacedHelpers } from "vuex";
const {
  mapState: musicState,
  mapActions: musicActions,
} = createNamespacedHelpers("musicStore");
export default {
  data() {
    return {
      singerData: [],
      singerSong: [],
    };
  },
  created() {
    this.getSingerData(this.$route.query.id);
  },
    computed: {
    ...musicState(["playedMusicList","nowSongId"]),
  },
  methods: {
    goback() {
      this.$router.back();
    },
    // 获取歌曲ID
    getSongsId(item){
      this.addPlayedMusic(item)
      this.getNowId(item.id)
      this.$router.push({name:'PlaySong'})
       this.axios({
        method: "GET",
        url: "http://localhost:3000/song/url",
        params: {
          id: this.nowSongId,
        },
      }).then(result =>{
        let url = result.data.data[0].url;
        this.changeAudioSrc(url).then((audio) => {
            audio.load();
            audio.play();
          });
      }).catch(err =>{
        
      })
    },
    //点击全部播放
    clickAllSongs(){
      let random = Math.floor(Math.random() * this.singerSong.length)
      this.toggleMusicList(this.singerSong)
      this.getNowId(this.singerSong[random].id)
      this.$router.push({name:'PlaySong'})
       this.axios({
        method: "GET",
        url: "http://localhost:3000/song/url",
        params: {
          id: this.nowSongId,
        },
      }).then(result =>{
        let url = result.data.data[0].url;
        this.changeAudioSrc(url).then((audio) => {
            audio.load();
            audio.play();
          });
      }).catch(err =>{
        
      })
    },
    //获取歌手数据
    getSingerData(id) {
      this.axios({
        method: "GET",
        url: "http://localhost:3000/artists?",
        params: {
          id: id,
        },
      })
        .then((result) => {
          
          this.singerData = result.data.artist;
          this.singerSong = result.data.hotSongs;
        })
        .catch((err) => {
          
        });
    },
    ...musicActions(["changeAudioSrc","addPlayedMusic","getNowId","toggleMusicList"]),
  },
};
</script>

<style lang="less" scoped>
</style>
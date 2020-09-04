<template>
  <div class="songsdan">
    <div class="songsdan-bg" :style="{backgroundImage:`url('${danData.coverImgUrl}')`}"></div>
    <div class="songsdan-box">
      <van-sticky @scroll="scroll">
        <div class="title-box">
          <div class="title-bg" :style="{opacity:opacityNum}"></div>
          <van-nav-bar :title="danData.name" left-arrow @click-left="goback" fixed />
        </div>
      </van-sticky>
      <div class="songsdan-s-box">
        <!-- 歌单信息 -->
        <div class="songsdan-desc clearfix">
          <div class="img-box fl">
            <img class="auto-img" :src="danData.coverImgUrl" alt />
          </div>
          <div class="text-box fl">
            <div class="text-title">{{danData.name}}</div>
            <div class="user-box clearfix">
              <div class="user-img fl">
                <img class="auto-img" :src="userHeader.avatarUrl" alt />
              </div>
              <div class="user-name fl">{{userHeader.nickname}}</div>
            </div>
            <div class="text-desc clearfix">
              <div class="jieshao fl" @click="showPopup">{{danData.description}}</div>
              <div class="icon-box fr">
                <van-icon name="arrow" />
              </div>
            </div>
          </div>
        </div>
        <!-- 歌单列表 -->
        <div class="songsdan-list-box">
          <van-sticky :offset-top="48">
            <div class="playAll clearfix">
              <div class="img-box fl">
                <img @click="clickAllSongs" class="auto-img" src="../assets/images/play-w.png" alt />
              </div>
              <div class="text-box fl">
                播放全部
                <span class="text-num">(共{{danData.trackCount}}首)</span>
              </div>
            </div>
          </van-sticky>
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <div class="songsdan-list clearfix" v-for="(item,index) in songsDanData" :key="index" @click=" getSongsId(item)">
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
          </van-list>
        </div>
      </div>
      <van-popup v-model="show" closeable position="bottom" :style="{ height: '90%' }">
        <div class="pop-box">
          <div class="pop-bg" :style="{backgroundImage:`url('${danData.coverImgUrl}')`}"></div>
          <div class="pop-content-box">
            <div class="pop-header">
              <div class="img-box">
                <img class="auto-img" :src="danData.coverImgUrl" alt />
              </div>
              <div class="text-box">{{danData.name}}</div>
            </div>
            <div class="pop-content">
              <div class="label">
                标签:
                <span v-for="(item,index) in danData.tags" :key="index">{{item}}</span>
              </div>
              <div class="content-text">{{danData.description}}</div>
            </div>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import "../assets/less/SongsDan.less";
import { createNamespacedHelpers } from "vuex";
const {
  mapState: musicState,
  mapActions: musicActions,
} = createNamespacedHelpers("musicStore");
export default {
  data() {
    return {
      loading: false,
      finished: false,
      userHeader: "",
      danData: [],
      songsDanData: [],
      opacityNum: 0,
      show: false,
    };
  },
  created() {
    this.getSongsDan(this.$route.query.id);
  },
  computed: {
    ...musicState(["playedMusicList","nowSongId"]),
  },
  methods: {
    //获取歌单列表
    getSongsDan(id) {
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: "加载中...",
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "http://localhost:3000/playlist/detail?",
        params: {
          id: id,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            this.danData = result.data.playlist;
            this.userHeader = this.danData.creator;
            let d = [];
            result.data.playlist.trackIds.map((v) => {
              this.axios({
                method: "GET",
                url: "http://localhost:3000/song/detail?",
                params: {
                  ids: v.id,
                },
              })
                .then((res) => {
                  d.push(res.data.songs[0]);
                })
                .catch((errr) => {
                  
                });
            });
            this.$toast.clear();
            this.songsDanData = d;
          }
        })
        .catch((err) => {
          
        });
    },
    onLoad() {

        this.loading = false;

        if (this.songsDanData.length >= 40) {
          this.finished = true;
        }
    },
    //
    goback() {
      this.$router.back();
    },
    scroll(res) {
      // 
      this.opacityNum = res.scrollTop / 250;
    },
    showPopup() {
      this.show = true;
    },
    //点击播放
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
      let random = Math.floor(Math.random() * this.songsDanData.length)
      this.toggleMusicList(this.songsDanData)
      this.getNowId(this.songsDanData[random].id)
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
    ...musicActions(["changeAudioSrc","addPlayedMusic","getNowId","toggleMusicList"]),
  },
};
</script>

<style lang="less" scoped>
</style>
<template>
  <div class="playsong">
    <div class="playsong-bg" :style="{backgroundImage:`url('${songAl.picUrl}')`}"></div>
    <div class="playsong-box">
      <van-nav-bar left-arrow @click-left="goback" fixed />
      <div class="playsong-content">
        <div class="playsong-img">
          <div class="img-bg">
            <div class="needle-box" :class="status == 1 ?'' :'active'">
              <img class="auto-img" src="../assets/images/needle.png" alt />
            </div>
            <div class="img-box" :class="status == 1? 'active' : ''">
              <img class="auto-img" :src="songAl.picUrl" alt />
            </div>
          </div>
        </div>
        <div class="playsong-text">
          <div class="playsong-name">
            <span class="name">{{songDetailData.name}}</span> --
            <span class="ar" v-for="(item,index) in songDetailData.ar" :key="index">{{item.name}}</span>
          </div>
        </div>
        <div class="jindutiao clearfix">
          <div class="start fl">
            <input type="text" v-model="start" disabled />
          </div>
          <div class="slider fl">
            <van-slider
              v-model="value"
              @change="changeSlider"
              :max="dt"
              bar-height="4px"
              active-color="rgba(255, 255, 255, 0.33)"
              inactive-color="rgba(59, 58, 58, 0.361)"
            />
          </div>
          <div class="end fr">{{end}}</div>
        </div>
        <div class="playsong-button clearfix">
          <div class="play-way fl">
            <img class="auto-img" src="../assets/images/round.png" alt />
          </div>
          <div class="last fl">
            <img class="auto-img" @click="lastSong" src="../assets/images/last.png" alt />
          </div>
          <div class="play-status fl">
            <img
              class="auto-img"
              @click="qiehuan"
              :src="status==1? require('../assets/images/nowplay-11.png'):require('../assets/images/play-w.png')"
              alt
            />
          </div>
          <div class="next fl">
            <img @click="nextSong" class="auto-img" src="../assets/images/next.png" alt />
          </div>
          <div class="play-list fl">
            <img class="auto-img" @click="showPopup" src="../assets/images/newlist.png" alt />
          </div>
        </div>
        <van-popup v-model="show" closeable position="bottom" :style="{ height: '70%' }">
          <div class="pop-box">
            <div class="music-list">
              <h3>
                当前播放
                <span>({{playedMusicList.length}})</span>
              </h3>
              <van-cell v-for="(item,index) in nowSongList" :key="index">
                <template #right-icon>
                  <van-icon @click="deleteSong(item,index)" name="cross" class="cross" />
                </template>
                <template #title>
                  <div class="song-detail" @click="getPopId(item)">
                    <span class="name">{{item.name}}</span> --
                    <span v-for="(v,i) in item.artists" :key="i">{{v.name}}</span>
                  </div>
                </template>
              </van-cell>
            </div>
          </div>
        </van-popup>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/PlaySong.less";
import { createNamespacedHelpers } from "vuex";
const {
  mapState: musicState,
  mapActions: musicActions,
} = createNamespacedHelpers("musicStore");
export default {
  data() {
    return {
      songDetailData: [],
      songAl: [],
      value: 0,
      dt: "",
      end: "",
      start: 0,
      show: false,
      //当前播放列表里的song
      nowSongList: [],
    };
  },
  created() {
    this.getSongDetail(this.nowSongId);
    this.sliderTime();
    for (let i = 0; i < this.playedMusicList.length; i++) {
      if (this.playedMusicList[i].song != undefined) {
        this.nowSongList.push(this.playedMusicList[i].song);
      } else if (!this.playedMusicList[i].song) {
        this.nowSongList.push(this.playedMusicList[i]);
        this.nowSongList[i].artists = this.playedMusicList[i].ar;
      }
    }
  },
  computed: {
    ...musicState([
      "status",
      "audio",
      "audioSrc",
      "nowSongId",
      "playedMusicList",
    ]),
  },
  methods: {
    getPopId(item) {
      this.getNowId(item.id);
      this.getSongDetail(this.nowSongId);
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
        .catch((err) => {});
    },
    //删除歌曲
    deleteSong(item, index) {
      if (item.id == this.nowSongId) {
        this.nowSongList.splice(index, 1);
        if (this.nowSongList.length == 0) {
          this.play(0);
          //暂停歌曲
          this.audio.pause();
          //删除当前播放歌曲的ID
          this.getNowId("");
          //清空audioSrc
          this.changeAudioSrc("");
          // 返回上一步
          this.goback();
        }
        this.nextSong();
        this.playedMusicList.splice(index, 1);

        return;
      }
      this.playedMusicList.splice(index, 1);
      this.nowSongList.splice(index, 1);
      //判断是否删除当前播放歌曲 是则播放下一首
    },
    //展示当前列表
    showPopup() {
      this.show = true;
    },
    //返回
    goback() {
      this.$router.back();
    },
    //拿到ID
    getSongDetail(id) {
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: "加载中...",
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "http://localhost:3000/song/detail?",
        params: {
          ids: id,
        },
      })
        .then((result) => {
          this.songDetailData = result.data.songs[0];
          this.songAl = result.data.songs[0].al;
          this.dt = Math.floor(result.data.songs[0].dt / 1000);
          let end1 =
            Math.floor(result.data.songs[0].dt / 1000 / 60) >= 10
              ? Math.floor(result.data.songs[0].dt / 1000 / 60)
              : "0" + Math.floor(result.data.songs[0].dt / 1000 / 60);
          let end2 =
            Math.floor((result.data.songs[0].dt / 1000) % 60) >= 10
              ? Math.floor((result.data.songs[0].dt / 1000) % 60)
              : "0" + Math.floor((result.data.songs[0].dt / 1000) % 60);
          this.end = end1 + ":" + end2;
          this.$toast.clear();
        })
        .catch((err) => {});
    },
    //进度条跟随时间
    sliderTime() {
      setInterval(() => {
        this.value = this.audio.currentTime;
        if (this.audio.currentTime >= 60) {
          let start1 =
            Math.floor(this.audio.currentTime / 60) > 10
              ? Math.floor(this.audio.currentTime / 60)
              : "0" + Math.floor(this.audio.currentTime / 60);
          let start2 =
            Math.floor(this.audio.currentTime % 60) > 10
              ? Math.floor(this.audio.currentTime % 60)
              : "0" + Math.floor(this.audio.currentTime % 60);
          this.start = start1 + ":" + start2;
        } else {
          let start3 =
            Math.floor(this.audio.currentTime) >= 10
              ? Math.floor(this.audio.currentTime)
              : "0" + Math.floor(this.audio.currentTime);
          this.start = "00:" + start3;
        }
      }, 800);
    },
    //改变进度条
    changeSlider() {
      this.audio.currentTime = Math.floor(this.value);
    },
    //点击暂停/播放
    qiehuan() {
      let status = this.status == 1 ? 0 : 1;
      this.play(status);
      if (this.status == 1) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    },
    //上一首
    lastSong() {
      for (let i = 0; i < this.playedMusicList.length; i++) {
        if (this.playedMusicList[i].id == this.nowSongId) {
          if (i == 0) {
            i = this.playedMusicList.length - 1;
            this.getNowId(this.playedMusicList[i].id);
            this.getSongDetail(this.nowSongId);
          } else {
            this.getNowId(this.playedMusicList[i - 1].id);
            this.getSongDetail(this.nowSongId);
          }

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
            .catch((err) => {});
          break;
        }
      }
    },
    //下一首
    nextSong() {
      for (let i = 0; i < this.playedMusicList.length; i++) {
        if (this.playedMusicList[i].id == this.nowSongId) {
          if (i == this.playedMusicList.length - 1) {
            i = 0;
            this.getNowId(this.playedMusicList[i].id);
            this.getSongDetail(this.nowSongId);
          } else {
            this.getNowId(this.playedMusicList[i + 1].id);
            this.getSongDetail(this.nowSongId);
          }

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
            .catch((err) => {});
          break;
        }
      }
    },
    ...musicActions(["changeAudioSrc", "play", "getNowId", "toggleMusicList"]),
  },
};
</script>

<style lang="less" scoped>
</style>
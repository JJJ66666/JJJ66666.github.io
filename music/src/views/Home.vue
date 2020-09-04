<template>
  <div class="home">
    <van-search
      shape="round"
      input-align="center"
      show-action
      background="#0c0c0c"
      :placeholder="dateinit"
      @focus="goSearch"
    >
      <template #action>
        <div class="round" v-if="playedMusicList.length" @click="goPlaySong">
          <van-circle
            v-model="currentRate"
            layer-color="#555"
            color="#fff"
            :stroke-width="60"
            :rate="rate"
            size="22px"
          >
            <template #default>
              <div class="img-box" :class="status==1? 'active' : ''">
                <img class="auto-img" :src="nowSongData.picUrl" alt />
              </div>
            </template>
          </van-circle>
        </div>
      </template>
    </van-search>
    <div class="home-box">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(item,index) in bannersData" :key="index">
          <img class="auto-img search-img" :src="item.imageUrl" alt />
        </van-swipe-item>
      </van-swipe>

      <div class="recommend-list clearfix">
        <div
          class="list-box fl"
          v-for="(item,index) in recommendData"
          :key="index"
          @click=" clickRecommend(item)"
        >
          <div class="song-box">
            <img class="auto-img" :src="item.imgUrl" alt />
          </div>
          <div class="list-name">{{item.title}}</div>
        </div>
      </div>
      <div class="songs-dan-box">
        <h2>推荐歌单</h2>
        <div class="list-dan clearfix">
          <div
            class="dan fl"
            v-for="(item,index) in danListData"
            :key="index"
            @click="clickDanId(item)"
          >
            <div class="dan-content">
              <div class="img-box" :style="{backgroundImage:`url('${item.picUrl}')`}">
                <div class="gaodu"></div>
              </div>
              <div class="dan-text">{{item.name}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="songs-list-box">
        <h2>推荐歌曲</h2>
        <div
          class="songs-box clearfix"
          v-for="(item,index) in songsListData"
          :key="index"
          @click="getSong(item,index)"
        >
          <div class="img-box fl">
            <img class="auto-img" :src="item.picUrl" alt />
          </div>
          <div class="songs-text fl">
            <div class="songs-name">{{item.name}}</div>
            <div class="songs-desc">
              <span class="singer" v-for="(v,i) in item.song.artists" :key="i">{{v.name}}</span>- -
              <span>{{item.song.album.name}}</span>
            </div>
          </div>
          <div class="songs-play fl">
            <img
              class="auto-img"
              ref="imgPlay"
              :src="item.status == 1 ? require('../assets/images/nowplay.png'):require('../assets/images/play-r.png')"
              alt
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/Home.less";
import { createNamespacedHelpers } from "vuex";
const {
  mapState: musicState,
  mapActions: musicActions,
} = createNamespacedHelpers("musicStore");
export default {
  data() {
    return {
      //推荐
      dateinit: "",
      //nowSongData
      nowSongData: [],
      //环形进度条当前进度
      currentRate: 0,
      //目的值
      rate: 0,
      // 推荐歌单数据
      danListData: [],
      // 推荐歌单数据
      songsListData: [],
      // 轮播图数据
      bannersData: [],
      // 小按钮
      recommendData: [
        {
          title: "每日推荐",
          imgUrl: require("../assets/images/everyday.png"),
          url: { name: "ToDaySongs" },
        },
        {
          title: "歌单",
          imgUrl: require("../assets/images/song-sheet.png"),
          url: { name: "AllSongsDan" },
        },
        {
          title: "排行榜",
          imgUrl: require("../assets/images/ranking.png"),
          url: { name: "TopList" },
        },
        {
          title: "歌手榜单",
          imgUrl: require("../assets/images/singer-top.png"),
          url: { name: "SingerTop" },
        },
      ],
    };
  },
  created() {
    this.getDanList();
    this.getBanners();
    this.getsongsList();
    this.sliderTime();
    //获取推荐搜索
    this.getDefault();
  },
  computed: {
    ...musicState([
      "status",
      "audio",
      "playedMusicList",
      "homeMusicList",
      "nowSongId",
    ]),
  },
  methods: {
    //获取推荐搜索
    getDefault() {
      this.axios({
        method: "GET",
        url: "http://localhost:3000/search/default",
      })
        .then((result) => {
          this.dateinit = result.data.data.showKeyword;
        })
        .catch((err) => {
          
        });
    },
    //点击搜索
    goSearch() {
      this.$router.push({ name: "Search" });
    },
    //进度条
    sliderTime() {
      if (this.nowSongId) {
        this.axios({
          method: "GET",
          url: "http://localhost:3000/song/detail?",
          params: {
            ids: this.nowSongId,
          },
        })
          .then((result) => {
            this.nowSongData = result.data.songs[0].al;
            this.rate = Math.floor(result.data.songs[0].dt / 1000);
          })
          .catch((err) => {
            
          });
        let timer = null;
        if (this.status == 1) {
          setInterval(() => {
            let t = this.audio.currentTime;
            this.currentRate = t;
          }, 800);
        } else {
          return;
        }
      }
    },
    //获取推荐
    getDanList() {
      this.axios({
        method: "GET",
        url: "http://localhost:3000/personalized?limit=6",
      })
        .then((result) => {
          if (result.data.code == 200) {
            this.danListData = result.data.result;
          }
        })
        .catch((err) => {
          
        });
    },
    //获取轮播图
    getBanners() {
      this.axios({
        method: "GET",
        url: "http://localhost:3000/banner?",
      })
        .then((result) => {
          if (result.data.code == 200) {
            this.bannersData = result.data.banners;
          }
        })
        .catch((err) => {
          
        });
    },
    //获取推荐歌曲
    getsongsList() {
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: "加载中...",
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "http://localhost:3000/personalized/newsong",
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 200) {
            this.songsListData = result.data.result;
            if (this.homeMusicList != null) {
              for (let i = 0; i < this.songsListData.length; i++) {
                if (this.songsListData[i].id == this.nowSongId) {
                  this.songsListData = this.homeMusicList;
                } else {
                  this.songsListData = result.data.result;
                }
              }
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    //播放添加当前点击的歌曲
    getSong(item, index) {
      let id = item.id;
      this.getNowId(id);
      this.addPlayedMusic(item);

      //克隆歌曲列表
      if (item.status == 1) {
        this.$router.push({ name: "PlaySong" });
        return;
      }
      let o = Object.assign({}, this.songsListData);
      for (const key in o) {
        o[key].status = 0;
      }
      o[index].status = 1;

      this.addHomeMusicList(o);
      this.songsListData = this.homeMusicList;
      this.axios({
        method: "GET",
        url: "http://localhost:3000/song/url",
        params: {
          id: item.id,
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
    //拿到当前点击的歌单ID
    clickDanId(item) {
      this.$router.push({ name: "SongsDan", query: { id: item.id } });
    },
    //点击recommend小图标
    clickRecommend(item) {
      this.$router.push(item.url);
    },
    goPlaySong() {
      this.$router.push({ name: "PlaySong", query: { id: this.nowSongId } });
    },
    ...musicActions([
      "changeAudioSrc",
      "addPlayedMusic",
      "getNowId",
      "addHomeMusicList",
    ]),
  },
};
</script>

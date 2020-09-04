<template>
  <div class="search">
    <van-search
      v-model="value"
      shape="round"
      input-align="center"
      show-action
      background="#0c0c0c"
      :placeholder="dateinit"
      @input="changeInput"
    >
      <template #left>
        <van-icon color="#999" size="16px" @click="goback" name="arrow-left" />
      </template>
      <template #action>
        <div class="round" v-if="nowSongId" @click="goPlaySong">
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
    <div class="search-hot" v-if="value.length == 0">
      <h3>热搜榜</h3>
      <div class="hot-song-box clearfix">
        <div
          class="hot-song clearfix fl"
          v-for="(item,index) in hotSongsData"
          :key="index"
          @click="clickHot(item)"
        >
          <div class="hot-top fl">{{index + 1}}</div>
          <div class="song-box fl">
            <div class="song-name clearfix">
              <div class="name fl">{{item.searchWord}}</div>
              <div class="img-box fl">
                <img :src="item.iconUrl" alt />
              </div>
            </div>
            <div class="song-desc">{{item.content}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="search-result" v-else>
        <h3>搜索结果</h3>
        <div class="result-list-box">
            <div class="result-list" v-for="(item,index) in searchResult" :key="index" @click="getSongId(item)">
                <div class="song-name">{{item.name}}</div>
                <div class="song-ar"><span v-for="(v,i) in item.artists" :key="i">{{v.name}} </span> -- <span>{{item.album.name}}</span></div>
                <div class="song-desc"><span v-for="(v,i) in item.alias" :key="i">{{v}}</span></div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/Search.less";
import { createNamespacedHelpers } from "vuex";
const {
  mapState: musicState,
  mapActions: musicActions,
} = createNamespacedHelpers("musicStore");
export default {
  data() {
    return {
      //nowSongData
      nowSongData: [],
      //环形进度条当前进度
      currentRate: 0,
      //目的值
      rate: 0,
      //输入框的值
      value: "",
      //热搜榜数据
      hotSongsData: [],
      //默认搜索
      dateinit: "",
      //搜索结果
      searchResult: [],
    };
  },
  created() {
    this.sliderTime();
    this.getHotSongs();
    this.getDefault();
  },
  computed: {
    ...musicState(["status","playedMusicList", "nowSongId", "audio"]),
  },
  methods: {
    //   返回
    goback() {
      this.$router.back();
    },
    //获取热搜榜
    getHotSongs() {
      this.axios({
        method: "GET",
        url: "http://localhost:3000/search/hot/detail",
      })
        .then((result) => {
          this.hotSongsData = result.data.data;
        })
        .catch((err) => {
          
        });
    },
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
    //搜索
    changeInput() {
      
      if (this.value.length != 0) {
        this.axios({
        method: "GET",
        url: "http://localhost:3000/search?",
        params: {
          keywords: this.value,
        },
      })
        .then((result) => {
         this.searchResult = result.data.result.songs

        })
        .catch((err) => {
          
        });
      } else {
        return;
      }
    },
    //点击热搜数据
    clickHot(item) {
      this.value = item.searchWord;
      this.axios({
        method: "GET",
        url: "http://localhost:3000/search?",
        params: {
          keywords: this.value ,
        },
      })
        .then((result) => {
         this.searchResult = result.data.result.songs
        })
        .catch((err) => {
          
        });
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
    //
    getSongId(item){
        this.addPlayedMusic(item)
        this.getNowId(item.id)
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
    //播放页面
    goPlaySong() {
      this.$router.push({ name: "PlaySong"});
    },
    ...musicActions(["changeAudioSrc", "addPlayedMusic", "getNowId"]),

  },
};
</script>

<style lang="less" scoped>
</style>
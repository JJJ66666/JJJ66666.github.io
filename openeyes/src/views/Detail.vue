<template>
  <div class="Detail">
    <van-nav-bar title="分类" left-text="返回" left-arrow fixed @click-left="goback">
      <template #title>
        <div class="nav">
          <div>{{navData.title}}</div>
          <div>{{navData.description}}</div>
        </div>
      </template>
    </van-nav-bar>
    <div class="detail-box">
      <div class="detail-list" v-for="(item,index) in detailData" :key="index">
        <div class="header clearfix">
          <div class="header-img fl">
            <img class="auto-img" :src="item.data.header.icon" alt />
          </div>
          <div class="header-text fl">
            <div class="text-name">{{item.data.content.data.author.name}}</div>
            <div class="text-decs">
              <span>{{item.releTime}}发布</span>
              <span class="decs">{{item.data.content.data.title}}</span>
            </div>
          </div>
        </div>
        <div class="detail-layout">
          <div class="detail-text">{{item.data.content.data.description}}</div>
          <div class="label">
            <span v-for="(v,i) in item.data.content.data.tags" :key="i">{{v.name}}</span>
          </div>
          <div class="detail-img" @click="getListDetail(item,index)">
            <img class="auto-img" :src="item.data.content.data.cover.feed" alt />
            <span>{{item.time}}</span>
          </div>
        </div>
      </div>
      <van-popup
        v-model="show"
        closeable
        @close="close"
        close-icon-position="top-left"
        position="bottom"
        :style="{ height: '80%'}"
      >
        <div class="details-box">
          <div class="video-details">
            <div class="video">
              <video class="auto-img" controls ref="video">
                <source :src="videoDataContent.playUrl" type="video/mp4" />
                <source :src="videoDataContent.playUrl" type="video/ogg" />
              </video>
            </div>
            <div class="author-box">
              <div class="author-title">
                <h3>{{videoDataContent.title}}</h3>
                <div class="title-desc">#{{videoDataContent.category}} / {{this.time}} / 开眼精选</div>
              </div>
              <div class="author-desc">{{videoDataContent.description}}</div>
              <div class="author-header clearfix">
                <div class="img-box fl">
                  <img class="auto-img" :src="author.icon" alt />
                </div>
                <div class="text-box fl">
                  <div class="text-name">{{author.name}}</div>
                  <div class="text-desc">{{author.description}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import "../assets/less/Detail.less";
export default {
  data() {
    return {
      navData: {},
      detailData: [],
      labelData: [],
      show: false,
      videoDetails: [],
      videoDataContent: [],
      author: [],
      time: 0,
    };
  },
  created() {
    this.navData = this.$route.query;
    this.getDetailData();
  },
  methods: {
    goback() {
      this.$router.back();
    },
    getDetailData() {
      this.axios({
        method: "GET",
        url: "https://api.apiopen.top/videoCategoryDetails?",
        params: {
          id: this.navData.id,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            this.detailData = result.data.result;
            this.detailData.map((v) => {
              
              let t = v.data.content;
              if (t !== undefined) {
                //获取发布时间
                let date = t.data.releaseTime
                let d = new Date(date).toLocaleDateString()
                let nowDate = new Date().toLocaleDateString()
                if (nowDate == d) {
                  let ho = new Date(date).getHours()<10? "0" + new Date(date).getHours()
                    : new Date(date).getHours();
                  let mi = new Date(date).getMinutes()<10? "0" + new Date(date).getMinutes()
                    : new Date(date).getMinutes();
                  v.releTime = ho + ':' + mi
                  return;
                }
                v.releTime = d
                // ======================

                let m =
                  Math.floor(t.data.duration / 60) < 10
                    ? "0" + Math.floor(t.data.duration / 60)
                    : Math.floor(t.data.duration / 60);
                let s =
                  t.data.duration % 60 < 10
                    ? "0" + (t.data.duration % 60)
                    : t.data.duration % 60;
                if (t.data.duration !== undefined) {
                  v.time = m + ":" + s;
                }
              }
            });
          }
        })
        .catch((err) => {
          
        });
    },
    close() {
      if (this.videoDetails.type == "pictureFollowCard") {
        return;
      }
      this.$nextTick(() => {
        let video = this.$refs.video;
        video.pause();
      });
    },
    //拿到id
    getListDetail(item, index) {
      this.videoDetails = [];
      this.showPopup();
      this.videoDetails = item;
      //获取data里面的content
      this.videoDataContent = item.data.content.data;
      this.author = this.videoDataContent.author;
      //获取时长
      let t = this.videoDataContent.duration;
      //分钟
      let m =
        Math.floor(t / 60) < 10 ? "0" + Math.floor(t / 60) : Math.floor(t / 60);
      //秒钟
      let s = t % 60 < 10 ? "0" + (t % 60) : t % 60;
      this.time = m + ":" + s;
      if (item.type == "pictureFollowCard") {
        return;
      }
      this.$nextTick(() => {
        this.$refs.video.load();
        let video = this.$refs.video;
        video.play();
      });
    },
    showPopup() {
      this.show = true;
    },
  },
};
</script>

<style lang="less" scoped>
</style>
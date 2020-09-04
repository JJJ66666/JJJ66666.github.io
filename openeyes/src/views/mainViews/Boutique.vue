<template>
  <div class="boutique">
    <van-nav-bar title="开眼精选" fixed>
    </van-nav-bar>
    <div class="video-list-box">
      <div class="video-list" v-for="(item,index) in toDayVideoData" :key="index">
        <h1>{{item.data.text==null ? '': item.data.text}}</h1>
        <div class="video-box" v-if="item.data.text==null">
          <div class="img-box" @click="videoId(item,index)">
            <div
              class="imgSrc"
              :style="{ backgroundImage: `url('${item.data.content.data.cover.feed}')`}"
            ></div>
            <span v-if="item.data.text==null">{{item.time}}</span>
          </div>
          <div class="author-box clearfix">
            <div class="author-img fl">
              <img class="auto-img" :src="item.data.header.icon" alt />
            </div>
            <div class="author-text fl">
              <div
                class="author-name"
              >{{item.data.header.issuerName==null?item.data.content.data.title:item.data.header.issuerName}}</div>
              <div
                class="author-decs"
                :style="{color:item.data.header.issuerName==null? '#999':'000'}"
              >{{item.type == 'pictureFollowCard'?item.data.content.data.description: item.data.header.description}}</div>
            </div>
          </div>
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
        <div class="img-details" v-if="videoDetails.type == 'pictureFollowCard'">
          <div class="img-details-box">
            <div class="img-details-swipe">
              <van-swipe @change="onChange">
                <van-swipe-item v-for="(item,index) in videoDataContent.urls" :key="index">
                  <div class="img-box">
                    <div class="imgSrc" :style="{backgroundImage:`url('${item}')`}"></div>
                  </div>
                </van-swipe-item>
                <template #indicator>0</template>
              </van-swipe>
            </div>
            <div
              class="custom-indicator"
              v-if="videoDataContent.urls.length>1"
            >{{ current + 1 }}/{{videoDataContent.urls.length}}</div>

            <div class="img-details-user">
              <div class="user-box clearfix">
                <div class="user-img fl">
                  <img class="auto-img" :src="videoDataContent.owner.avatar" alt />
                </div>
                <div class="user-text fl">
                  <div class="text-name">{{videoDataContent.owner.nickname}}</div>
                  <div class="text-decs">{{videoDataContent.owner.description}}</div>
                </div>
                <div class="user-location fr" v-if="videoDataContent.owner.city!==null">
                  <van-icon name="location" />
                  {{videoDataContent.owner.city}}
                </div>
              </div>
              <div class="title-box">
                <div class="title">{{videoDataContent.description}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="video-details" v-else>
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
</template>

<script>
import "../../assets/less/Boutique.less";
export default {
  data() {
    return {
      toDayVideoData: [],
      videoDetails: [],
      videoDataContent: [],
      author: [],
      show: false,
      current: 0,
      time: 0,
    };
  },
  created() {
    this.getTodayVideo();
  },
  methods: {
    onChange(index) {
      this.current = index;
    },
    getTodayVideo() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "https://api.apiopen.top/todayVideo",
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code === 200) {
            
            this.toDayVideoData = result.data.result;
            
            this.toDayVideoData.map((v) => {
              let t = v.data.content;
              if (t !== undefined) {
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
          this.$toast.clear();
          
        });
    },
    showPopup() {
      this.show = true;
    },
    // 关闭
    close() {
      // this.videoDetails = [];
      if (this.videoDetails.type == "pictureFollowCard") {
        return;
      }
      this.$nextTick(() => {
        let video = this.$refs.video;
        video.pause();
      });
    },
    //拿到id
    videoId(item, index) {
      this.videoDetails = [];
      this.showPopup();
      this.videoDetails = item;
      this.videoDataContent = item.data.content.data;
      this.author = this.videoDataContent.author;
      //获取时长
      let t = this.videoDataContent.duration;
      let m =
        Math.floor(t / 60) < 10 ? "0" + Math.floor(t / 60) : Math.floor(t / 60);
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
  },
};
</script>

<style lang="less" scoped>
</style>
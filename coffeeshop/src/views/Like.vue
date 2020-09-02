<template>
  <div class="like">
    <van-nav-bar title="我的收藏" left-text="返回" left-arrow @click-left="back" />

    <div class="like-warp">
      <div class="like-bg"></div>
      <div class="like-layout">
        <div class="like-head">
          <div class="head">
            <div class="listTitle">收藏信息</div>
            <div class="like-list" v-if="likeData.length>0">
              <div class="listData clearfix" v-for="(item,index) in likeData" :key="index">
                <div class="cancel">
                  <van-icon name="delete" @click="likeToggle(item,index)" />
                </div>
                <div class="card-center fl" @click="viewProductInfo(item.pid)">
                  <img class="auto-img" :src="item.smallImg" alt />
                </div>
                <div class="card-right fl" @click="viewProductInfo(item.pid)">
                  <div class="commodity clearfix">
                    <div class="com-name fl">
                      <div class="cn">{{item.name}}</div>
                      <div class="en">{{item.enname}}</div>
                      <div class="desc">{{item.desc}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <van-empty description="你的收藏空空如也">
                <van-button round color="#303CAA" @click="goMenu" class="bottom-button">快去收藏吧</van-button>
              </van-empty>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/css/Like.less";
import { utils } from "../assets/js/utils";
export default {
  data() {
    return {
      likeData: [],
      isLike: true,
    };
  },
  created() {
    this.getLikeData();
  },
  methods: {
    goMenu() {
      this.$router.push({ name: "Menu" });
    },
    back() {
      this.$router.back();
    },
    //获取收藏数据
    getLikeData() {
      this.likeData = [];
      let tokenString = localStorage.getItem("CSTK");
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "findAllLike",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      }).then((result) => {
        this.$toast.clear();
        if (result.data.code === 2000) {
          this.likeData = result.data.result;
        }
      });
    },
    //获取产品详情
    viewProductInfo(pid) {
      this.$router.push({ name: "Detail", query: { pid } });
    },
    //取消收藏
    likeToggle(item, index) {
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return this.$toast("你还未登录!");
      }

      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        pid: item.pid,
      });

      this.axios({
        method: "POST",
        url: "notlike",
        data,
      })
        .then((result) => {
          if (result.data.code == "900") {
            this.likeData.splice(index, 1);
          }
        })
        .catch((err) => {
          
        });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
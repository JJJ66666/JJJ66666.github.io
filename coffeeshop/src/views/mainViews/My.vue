<template>
  <div class="my">
    <div v-if="isShow">
      <div class="my-warp">
        <div class="my-bg" :style="{background:`url(${userData.userBg})`}">
          <van-uploader :after-read="changeBg" />
        </div>
        <div class="my-layout">
          <div class="my-title">我的</div>
          <div class="my-head">
            <div class="head clearfix">
              <div class="img-box fl">
                <img class="auto-img" :src="userData.userImg" alt />
              </div>
              <div class="name-box fl">
                <div class="name">{{userData.nickName}}</div>
                <div class="profile">{{userData.desc==''? '这个家伙很懒,什么都没留下':userData.desc}}</div>
              </div>
            </div>
            <van-cell-group>
              <van-cell v-for="(item,index) in cellData" :key="index" :title="item.title" :to="item.to"/>
            </van-cell-group>
          </div>
          <div class="bottom-img">
            <img class="auto-img" src="../../assets/imges/bottom-img.png" alt />
          </div>
        </div>
      </div>
    </div>
    <!-- 未登录 -->
    <div v-else>
      <div class="notlogin">
        <div class="layout-box">
          <van-empty image="error" description="您还未登录，快去登陆吧" />
          <div class="button-box">
            <van-button type="primary" to="../login">点击登陆</van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/css/My.less";
import { utils } from "../../assets/js/utils";
export default {
  data() {
    return {
      isShow: true,
      userData: [],
      cellData: [
        { title: "个人资料" ,to:{name:'Account'}},
        { title: "订单详细" ,to:{name:'Record'}},
        { title: "我的收藏" ,to:{name:'Like'}},
        { title: "地址管理" ,to:{name:'Address'}},
        { title: "安全中心" ,to:{name:'Safe'}},
      ],
    };
  },
  created() {
    this.isLogin();
    this.getUserData();
  },

  methods: {
    isLogin() {
      if (localStorage.getItem("CSTK") === null) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
    //获取个人数据
      getUserData() {
      let tokenString = localStorage.getItem("CSTK");
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          tokenString,
          appkey: this.appkey,
        },
      }).then((result) => {
        this.$toast.clear();
        // 
        if (result.data.code === "A001") {
          this.userData = result.data.result[0];
        }
      });
    },
    // 修改背景图片
    changeBg(file) {
      let tokenString = localStorage.getItem("CSTK");
      // 
      let type = file.file.type.split("/")[1];
      let imgType = ["png", "jpg", "gif", "jpeg"];
      if (imgType.indexOf(type) === -1) {
        this.$notify({
          message: "图片只支持" + imgType.join(","),
          color: "#fff",
          background: "#0C34BA",
        });
        return;
      }
      let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, "");
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        imgType: type,
        serverBase64Img: base64,
      });
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "POST",
        url: "/updateUserBg",
        data,
      }).then((result) => {
        this.$toast.clear();
        if (result.data.code === "I001") {
          this.userData.userBg = result.data.userBg;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
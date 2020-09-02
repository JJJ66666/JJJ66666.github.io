<template>
  <div class="safe">
    <van-nav-bar title="安全中心" left-text="返回" left-arrow @click-left="back" />
    <div class="safe-warp">
      <div class="safe-bg"></div>
      <div class="safe-layout">
        <div class="safe-head">
          <div class="head">
            <van-button @click="showPopup">修改密码</van-button>
            <van-button @click="removeID">注销账号</van-button>
            <van-button type="info" @click="logOut">退出登录</van-button>
            <van-popup v-model="show" closeable position="bottom">
              <div class="popue-eitd">
                <van-field v-model="oldPassword" type="text" placeholder="密码" label="旧密码" />
                <van-field
                  v-model="password"
                  :type="isEye? 'password' :'text'"
                  placeholder="密码"
                  :right-icon="isEye?'closed-eye':'eye-o'"
                  label="新密码"
                  @click-right-icon="clickEye"
                />
                <van-button type="info" @click="eitdPassword">确认修改</van-button>
              </div>
            </van-popup>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/css/Safe.less";
import { utils } from "../assets/js/utils";
import { validForm } from "../assets/js/validForm";

export default {
  data() {
    return {
      show: false,
      oldPassword: "",
      password: "",
      isEye: true,
    };
  },
  methods: {
    back() {
      this.$router.back();
    },
    showPopup() {
      this.show = true;
    },
    clickEye() {
      if (this.isEye) {
        this.isEye = false;
      } else {
        this.isEye = true;
      }
    },
    //修改密码
    eitdPassword() {
      let tokenString = localStorage.getItem("CSTK");
      let o = {
        oldPassword: {
          value: this.oldPassword,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码格式不正确",
        },
        password: {
          value: this.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码格式不正确",
        },
      };
      if (!validForm.valid(o)) {
        return;
      }
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        oldPassword: this.oldPassword,
        password: this.password,
      });
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "POST",
        url: "/updatePassword",
        data,
      }).then((result) => {
        this.$toast.clear();
        
        if (result.data.code === "E001") {
          localStorage.removeItem("CSTK");
          this.$router.push({ name: "Login" });
        }
      });
    },
    //注销账号
    removeID() {
      //确认窗口
      this.$dialog
        .confirm({
          message: "确认注销账号吗？",
        })
        .then(() => {
          //加载图标
          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0,
            loadingType: "spinner",
          });
          let tokenString = localStorage.getItem("CSTK");
          //获取data
          let data = utils.queryString({
            appkey: this.appkey,
            tokenString,
          });
          //链接端口
          this.axios({
            method: "POST",
            url: "/destroyAccount",
            data,
          }).then((result) => {
            //清除加载图标
            this.$toast.clear();
            
            if (result.data.code === "G001") {
              //移除token值
              localStorage.removeItem("CSTK");
              //跳转登陆页面
              this.$router.push({ name: "Login" });
            }
          });
        })
        .catch(() => {
          
        });
    },
    //退出登录
    logOut() {
      //确认窗口
      this.$dialog
        .confirm({
          message: "确认退出登陆吗？",
        })
        .then(() => {
          let tokenString = localStorage.getItem("CSTK");
          //加载图标
          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0,
            loadingType: "spinner",
          });
          //获取data
          let data = utils.queryString({
            appkey: this.appkey,
            tokenString,
          });
          //链接端口
          this.axios({
            method: "POST",
            url: "/logout",
            data,
          }).then((result) => {
            //清除加载图标
            this.$toast.clear();
            if (result.data.code === "F001") {
              //移除token值
              localStorage.removeItem("CSTK");
              //跳转登陆页面
              this.$router.push({ name: "Login" });
            }
          });
        })
        .catch(() => {
          
        });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
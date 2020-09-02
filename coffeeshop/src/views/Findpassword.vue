<template>
  <div class="findpassword">
    <van-nav-bar title="找回密码" left-text="返回" left-arrow @click-left="goLogin"/>
    <div class="findpassword-layout">
      <van-field v-model="phone" label="手机号" placeholder="请输入手机号码" />
      <van-field v-model="newPassword" center clearable label="新密码" placeholder="请输入6-15字符"></van-field>
      <van-field v-model="email" label="邮箱" placeholder="请输入邮箱" />
      <van-field v-model="test" center clearable label="邮箱验证码" placeholder="请输入邮箱验证码">
        <template #button>
          <van-button size="small" type="primary" color="#1989FA" @click="getCode">发送验证码</van-button>
        </template>
      </van-field>
      <div class="button-box">
        <van-button type="info" color="#303CAA" round @click="testCode">完成</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { validForm } from "../assets/js/validForm";
import { utils } from "../assets/js/utils";
export default {
  data() {
    return {
      email: "",
      test: "",
      phone: "",
      newPassword: "",
    };
  },
  methods: {
    // 返回上一步
    goLogin(){
      this.$router.back()
    },
    //获取验证码
    getCode() {
      let o = {
        email: {
          value: this.email,
          reg: /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/,
          errorMsg: "邮箱地址格式不正确",
        },
        phone: {
          value: this.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机号格式不正确",
        },
        password: {
          value: this.newPassword,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码格式不正确",
        },
      };
      if (!validForm.valid(o)) {
        return;
      }

      let data = utils.queryString({
        appkey: this.appkey,
        email: this.email,
      });

      this.axios({
        method: "POST",
        url: "/emailValidCode",
        data,
      })
        .then((result) => {
          if (result.data.code == "J001") {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          
        });
    },
    //修改密码
    changePassword() {
      let data = utils.queryString({
        appkey: this.appkey,
        phone: this.phone,
        password: this.newPassword,
      });

      this.axios({
        method: "POST",
        url: "/retrievePassword",
        data,
      })
        .then((result) => {
          
          if (result.data.code == "L001") {
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          
        });
    },
    //验证邮箱验证码
    testCode() {
      let data = utils.queryString({
        appkey: this.appkey,
        validCode: this.test,
      });

      this.axios({
        method: "POST",
        url: "/checkValidCode",
        data,
      })
        .then((result) => {
          if (result.data.code == "K001") {
            this.$router.push({ name: "FindPassword" });
            this.changePassword();
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          
        });
    },
    
  },
};
</script>

<style lang="less" scoped>

  .findpassword {
    /deep/.van-nav-bar .van-icon {
      color: #303caa;
    }
    /deep/.van-nav-bar__text {
      color: #303caa;
    }
    .findpassword-layout {
      width: 100%;
      margin-top: 30px;

      .button-box {
        width: 200px;
        margin: 20px auto;
        /deep/.van-button--normal {
          width: 100%;
        }
      }
    }
  }

</style>
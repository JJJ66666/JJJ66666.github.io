<template>
  <div class="Login">
    <van-nav-bar left-arrow @click-right="goHome">
      <template #left>
        <div class="Login-text">
          <div class="icon"><i class="iconfont icon-kafei"></i></div>
          <div class="title">Coffee Shop</div>
        </div>
      </template>
      <template #right>
        <div class="round">···</div>
      </template>
    </van-nav-bar>

    <div class="layout">
      <div class="title">欢迎回来!</div>
      <div class="p">Please login to your accounts</div>
      <van-form>
        <van-field placeholder="手机号码" v-model="fieldNum.phone" />
        <van-field
          :type="fieldNum.isEye? 'password' :'text'"
          placeholder="密码"
          :right-icon="fieldNum.isEye?'closed-eye':'eye-o'"
          v-model="fieldNum.password"
          @click-right-icon="clickEye"
        />
        <div style="width:100%;margin-top:10px;overflow:hidden;"><span class="fr" @click="Findpassword">忘记密码</span></div>
        <div class="layout-btn">
          <van-button  block type="info" @click="login">登录</van-button>
        </div>
        <div class="layout-register">
          <van-button block  @click="showPopup">注册</van-button>
          <van-popup
            v-model="show"
            closeable
            round
            close-icon-position="top-right"
            position="bottom"
            :style="{ height: '65%' }"
          >
            <div class="popup">
              <div class="title">注册</div>
              <van-field placeholder="昵称" v-model="userRegisterInfo.nickName" />
              <van-field placeholder="手机号  中国 (+86)" v-model="userRegisterInfo.phone" />
              <van-field type="password" placeholder="密码" v-model="userRegisterInfo.password"/>
              <div class="popup-btn">
                <van-button  block type="info" @click="register">注册</van-button>
              </div>
            </div>
          </van-popup>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>

import "../assets/css/Login.less";

import {validForm} from '../assets/js/validForm'

import {utils} from '../assets/js/utils'
export default {
  data() {
    return {
      show: false,
      fieldNum: {
        phone: "",
        password: "",
        isEye: true,
      },
      userRegisterInfo:{
        nickName:'',
        phone:'',
        password:'',
        popupword2:'',
      }
    };
  },
  methods: {
    goHome(){
      // 
      this.$router.push({ name: 'Home'})
    },
    clickEye() {
      // 
      // 
      if (this.fieldNum.isEye) {
        this.fieldNum.isEye = false;
      } else {
        this.fieldNum.isEye = true;
      }
    },
    showPopup() {
      this.show = true;
    },
    //注册
    register(){
      
      // 
      let userInfo = this.userRegisterInfo;
      // 
      let o ={
        phone:{
          value:userInfo.phone,
          reg:/^1[3-9]\d{9}$/,
          errorMsg: '手机号格式不正确'
        },
        nickName:{
          value:userInfo.nickName,
          reg:/^[\w\u4e00-\u9fa5]{1,10}$/,
          errorMsg: '昵称格式不正确'
        },
        password:{
          value:userInfo.password,
          reg:/^[A-Za-z]\w{5,15}$/,
          errorMsg: '密码格式不正确'
        },
      }
      // 
      if (!validForm.valid(o)) {
        return;
      }

      this.$toast.loading({
        message:'加载中...',
        forbidClick:true,

        duration:0,

        loadingType:"spinner"
      })

      //序列化参数
      //复制对象
      // 

      let info = Object.assign({},userInfo);
      info.appkey = this.appkey;
      let data = utils.queryString(info);

      this.axios({
        method:'POST',
        url:'/register',
        data
      }).then(result => {
        //关闭加载提示
        this.$toast.clear();

        if (result.data.code == 100) {
          this.show = false;
          for (const key in userInfo) {
            userInfo[key] = '';
          }
        }else{
          this.$notify({
            type:'warning',
            message:result.data.msg
          })
        }
      }).catch(err => {
        this.$toast.clear();
        
      })
    },

    //登录
    login(){
      let userInfo = this.fieldNum
      let o = {
        phone:{
          value:userInfo.phone,
          reg:/^1[3-9]\d{9}$/,
          errorMsg:'手机格式不正确'
        },
        password:{
          value:userInfo.password,
          reg:/^[A-Za-z]\w{5,15}$/,
          errorMsg:'密码格式不正确'
        }
      };

      if (!validForm.valid(o)) {
        return;
      }
      this.$toast.loading({
        message:'加载中...',
        forbidClick:true,
        duration:0,
        loadingType:'spinner'
      })

      let info = Object.assign({},userInfo);
      info.appkey= this.appkey;

      let data = utils.queryString(info);

      this.axios({
        method:'POST',
        url:'/login',
        data
      }).then(result=>{
        this.$toast.clear();
        
         if (result.data.code == 200) {
          localStorage.setItem('CSTK', result.data.token);
          this.$router.push({name: 'Home'});
        } else{
        this.$notify({
          type:'warning',
          message:result.data.msg
        })
      }
      }).catch(err =>{
        this.$toast.clear();
        
      })


    },
    //找回密码
    Findpassword(){
      this.$router.push({name:'Findpassword'})
    }
  },
};
</script>

<style lang="less" scoped>
</style>
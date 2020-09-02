<template>
  <div class="account">
    <van-nav-bar title="个人资料" left-text="返回" left-arrow @click-left="back"/>
    <div class="account-warp">
      <div class="account-bg"></div>
      <div class="account-layout">
        <div class="account-head">
          <div class="head">
            <van-cell center title="头像">
              <template #right-icon>
                <div class="img-box">
                  <van-uploader :after-read="changeHead" />
                  <img class="auto-img" :src="userData.userImg" alt/>
                  
                </div>
              </template>
            </van-cell>
            <van-cell center title="用户id">
              <template #right-icon>{{userData.userId}}</template>
            </van-cell>
            <van-cell center title="昵称">
              <template #right-icon>
                <div class="input-box">
                  <input type="text" v-model="userData.nickName" @change="changeName" />
                </div>
              </template>
            </van-cell>
            <van-cell center title="手机号码">
              <template #right-icon>{{userData.phone}}</template>
            </van-cell>
            <van-cell center title="简介">
              <template #right-icon>
                <div class="input-box">
                  <input type="text" placeholder="这家伙很懒，什么都没有留下" v-model="userData.desc" @change="changedesc"/>
                </div>
              </template>
            </van-cell>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/css/Account.less";
import { utils } from '../assets/js/utils';
export default {
  data() {
    return {
      userData: [],
    };
  },
  created() {
    this.getUserData();
  },
  methods: {
    back(){
      this.$router.push({name:'My'})
    },
    //获取用户个人资料
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
        url: "/findAccountInfo",
        params: {
          tokenString,
          appkey: this.appkey,
        },
      })
        .then((result) => {
          this.$toast.clear();
          // 
          if (result.data.code === "B001") {
            this.userData = result.data.result[0];
            
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    //修改头像
    changeHead(file){
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
        url: "/updateAvatar",
        data,
      }).then((result) => {
        this.$toast.clear();
        
        if (result.data.code === "H001") {
          this.userData.userImg = result.data.userImg;
          
        }
      }).catch(err =>{
        this.$toast.clear()
        
      });
    },

    //修改昵称
    changeName(){
        let tokenString = localStorage.getItem("CSTK");
        let data = utils.queryString({
          tokenString,
          appkey:this.appkey,
          nickName:this.userData.nickName
        })
        this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method:'POST',
        url:'/updateNickName',
        data
      }).then(result =>{
        this.$toast.clear()
        
        if (result.data.code ==="C001") {
          this.userData.nickName = result.data.nickName
        }
      }).catch(err =>{
        this.$toast.clear()
        
      })
      
    },
    //修改简介
    changedesc(){
        let tokenString = localStorage.getItem("CSTK");
        let data = utils.queryString({
          tokenString,
          appkey:this.appkey,
          desc:this.userData.desc
        })
        this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method:'POST',
        url:'/updateDesc',
        data
      }).then(result =>{
        this.$toast.clear()
        
        if (result.data.code ==="D001") {
          this.userData.desc = result.data.desc
        }
      }).catch(err =>{
        this.$toast.clear()
        
      })
      
    }
  },
};
</script>

<style lang="less" scoped>
</style>
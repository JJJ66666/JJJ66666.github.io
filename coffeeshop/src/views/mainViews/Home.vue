<template>
  <div class="home">
    <div class="banner">
      <van-swipe class="my-swipe" :autoplay="1500">
        <van-swipe-item v-for="(item,index) in images" :key="index" @click="viewProductnfo(item.pid)">
          <img :src="item.bannerImg" alt class="auto-img" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="layout-box clearfix">
      <div class="home-sayHi">
        <div class="box-sayHi" >
          <p v-if="isLogin">
            {{hi}}
            <span>,<div class="img-box" @click="goMy"><img class="auto-img" :src="myData.userImg" alt=""></div> {{myData.nickName}}</span>
          </p>
          <p v-else>请先登录!</p>
          <p>咖啡能让你脑洞大开</p>
        </div>
        
      </div>
      <div class="home-Whereabouts">
        <div class="left" @click="goshopbog">
          <span>外卖</span>
        </div>
        <div class="right">
          <span>自提</span>
        </div>
      </div>
      <div class="Hot-commodity">
        <h1>热门推荐</h1>
        <div class="commodity" :class="index%2==0?'fl':'fr'"  v-for="(item,index) in hotProducts" :key="index" @click="viewProductnfo(item.pid)">
          <div class="img-box" :style="{'background-image':'url('+item.smallImg+')'}"></div>
          <!-- <img :src="item.largeImg" alt=""> -->
          <div class="text-box">
            <p class="cn">{{item.name}}</p>
            <p class="en">{{item.enname}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/css/Home.less";
export default {
  data() {
    return {
      hi:'',
      hotProducts:[],
      images: [],
      isLogin:true,
      myData:[],
    };
  },
  created() {
    this.sayHi()
    this.gethotProducts()
    this.getbannerData()
    this.getName()
  },
  methods: {
    goshopbog(){
      this.$router.push({name:'Shopbog'})
    },
    goMy(){
      this.$router.push({name:'My'})
    },
    //获取名字
    getName(){
      let tokenString = localStorage.getItem('CSTK')
      if (!tokenString) {
        this.isLogin = false
      }
      this.axios({
        method:'GET',
        url:'/findMy',
        params:{
          appkey:this.appkey,
          tokenString,
        }
      }).then(result =>{
        if (result.data.code==="A001") {
          this.myData = result.data.result[0]
        }
      })
    },
    sayHi() {
      let d = new Date().getHours();
      if (d>=6&&d<=8) {
        this.hi='早安'
      }else if (d>=9&&d<=11) {
        this.hi='上午好'
      }else if (d>=12&&d<=13) {
        this.hi='中午好'
      }else if (d>=14&&d<=18) {
        this.hi='下午好'
      }else if (d>=19&&d<=24) {
        this.hi='晚安'
      }else{
        this.hi = '早点休息'
      }
    },

    gethotProducts(){
      this.$toast.loading({
        message:'请稍等',
        forbidClick:true,
        duration:0,
        loadingType:'spinner'
      })

      this.axios({
        method:'GET',
        url:'/typeProducts',
        params:{
          appkey:this.appkey,
          key:'isHot',
          value:1
        }
      }).then(result =>{
        this.$toast.clear();
        if (result.data.code == 500) {
          this.hotProducts = result.data.result
        }
      }).catch(err =>{
        
      })
    },
    getbannerData(){
      this.$toast.loading({
        message:'加载中...',
        forbidClick:true,
        duration:0,
        loadingType:'spinner'
      })
      this.axios({
        method:'GET',
        url:'/banner',
        params:{
          appkey:this.appkey
        }
      }).then(result =>{
        this.$toast.clear();
        if(result.data.code == 300){
          this.images = result.data.result;
        }
        // 
      }).catch(err =>{
        this.$toast.clear();
        // 
      })
    },

    //获取商品数据
    viewProductnfo(pid){
      this.$router.push({name:'Detail',query:{pid}})
    }
  },
};
</script>

<style lang="less" scoped>
</style>
<template>
  <div class="main">
      <div>
        <keep-alive include="Home,Menu">
          <router-view></router-view>
        </keep-alive>
      </div>
    <van-tabbar :route="true" v-model="tabbarIndex" active-color="#303CAA" inactive-color="#555">
      <van-tabbar-item v-for="(item,index) in tabbarData" :key="index" :to="item.url">
        <span>{{item.title}}</span>
        <template #icon="props">
            <i :class="item.iconClass" :style="{color:props.active ? item.icon.active : item.icon.inactive}"></i>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import "../assets/css/Main.less";
export default {
  data() {
    return {
      tabbarIndex: 0,
      activeC:0,
      tabbarData: [
        {
          title: "首页",
          iconClass:"iconfont icon-kafei",
          icon: {
            active: "#303CAA",
            inactive: "#555",
          },
          url: {
              name: 'Home',
            }
        },
        {
          title: "菜单",
          iconClass:"iconfont icon-caidan1",
          icon: {
            active: "#303CAA",
            inactive: "#555",
          },
          url: {
              name: 'Menu',
            }
        },
        {
          title: "购物袋",
          iconClass:"iconfont icon-gouwudai",
          icon: {
            active: "#303CAA",
            inactive: "#555",
          },
          url: {
              name: 'Shopbog',

            }
        },
        {
          title: "我的",
          iconClass:"iconfont icon-wodedangxuan",
          icon: {
            active: "#303CAA",
            inactive: "#555",
          },
          url: {
              name: 'My',
            }
        },
      ],
    }
  },
  created(){
    
    for (let i = 0; i < this.tabbarData.length; i++) {
      if (this.tabbarData[i].url.name == this.$route.name) {
        this.tabbarIndex = i
        return;
      }
    }
  },
 
};
</script>

<style lang="less" scoped>
</style>
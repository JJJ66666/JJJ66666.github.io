<template>
  <div class="main">
    <router-view />
    <van-tabbar v-model="active" active-color="#E33E33" inactive-color="#000">
      <van-tabbar-item v-for="(item,index) in tabData" :key="index" :to="item.url">
        <span>{{item.title}}</span>
        <template #icon>
          <van-icon :name="item.icon.inactive" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { MP } from "../assets/js/map";
import { area } from "../assets/js/areaList";
import "../assets/less/Main.less";

export default {
  data() {
    return {
      active: 0,
      tabData: [
        {
          title: "开眼精选",
          id:0,
          url: {
              name: 'Boutique',
            },
          icon: {
            inactive: "eye-o",
          },
        },
        {
          title: "分类",
          id:1,
          url: {
              name: 'Class',
            },
          icon: {
            inactive: "enlarge",
          },
        },
      ],
    };
  },

  created() {
    this.changeTabs()
  },
  methods: {
    changeTabs(){
      for (let i = 0; i < this.tabData.length; i++) {
        if (this.tabData[i].url.name == this.$route.name) {
          this.active = this.tabData[i].id
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.aa {
  font-size: 16px;
}
</style>
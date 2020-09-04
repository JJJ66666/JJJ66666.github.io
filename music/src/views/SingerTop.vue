<template>
  <div class="singertop">
      <van-nav-bar title="歌手榜" left-arrow @click-left="goback" fixed />
     <div class="singertop-box">
        <div class="list-singer clearfix">
          <div
            class="singer fl"
            v-for="(item,index) in singerListData"
            :key="index"
          >
            <div class="singer-content">
              <div class="img-box" @click="getSingerId(item)" :style="{backgroundImage:`url('${item.picUrl}')`}">
                <div class="gaodu"></div>
              </div>
              <div class="singer-text">{{item.name}}</div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import '../assets/less/SingerTop.less'
export default {
  data() {
    return {
        singerListData:[]
    };
  },
  created() {
    this.getSingerList();
  },
  methods: {
      goback() {
      this.$router.back();
    },
    getSingerList() {
      this.axios({
        method: "GET",
        url: "http://localhost:3000/toplist/artist",
      }).then((result) => {
        this.singerListData = result.data.list.artists
      });
    },
    getSingerId(item){
      this.$router.push({name:'SingerDetail',query:{id:item.id}})
    }
  },
};
</script>

<style lang="less" scoped>
</style>
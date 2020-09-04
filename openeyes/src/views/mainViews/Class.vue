<template>
  <div class="class">
    <van-nav-bar title="分类" fixed>
    </van-nav-bar>
    <div class="class-box clearfix">
      <div
        class="class-detail fl"
        v-for="(item,index) in classData"
        :key="index"
        @click="getClassId(item)"
      >
        <img class="auto-img" :src="item.data.icon" alt />
        <div class="detail-text">{{item.data.title}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/less/Class.less";
export default {
  data() {
    return {
      classData: [],
    };
  },
  created() {
    this.getClassData();
  },
  methods: {
    getClassData() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "https://api.apiopen.top/videoCategory",
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 200) {
            this.classData = result.data.result.itemList;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    getClassId(item) {
      this.$router.push({ name: "Detail", query: { id: item.data.id ,title:item.data.title,description:item.data.description } });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
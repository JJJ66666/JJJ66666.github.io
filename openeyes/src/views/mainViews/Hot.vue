<template>
  <div class="hot">
    <van-nav-bar title="每日一文" />
    <div class="one-box">
      
    </div>
  </div>
</template>

<script>
import "../../assets/less/Hot.less";
export default {
  data() {
    return {
      oneData: [],
    };
  },
  created() {
    this.getHotData();
  },

  methods: {
    getHotData() {
      this.axios({
        method: "GET",
        url: "api/v5/index/tab/discovery",
      })
        .then((result) => {
          
        //   this.oneData = result.data.data;
        })
        .catch((err) => {
          
        });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
<template>
  <div class="toplist">
    <van-nav-bar title="排行榜" left-arrow @click-left="onClickLeft" fixed />
    <div class="toplist-box">
      <div class="guanfang">
        <h1>官方榜</h1>
        <!-- <h3 v-for="(item,index) in guanFang" :key="index" @click="xxx(item)">{{item.name}}</h3> -->
        <div class="guanfang-list">
          <div
            class="list clearfix"
            v-for="(item,index) in guanFang"
            :key="index"
            @click="goSongsDan(item)"
          >
            <div class="img-box fl">
              <img class="auto-img" :src="item.coverImgUrl" alt />
              <span class="img-desc">{{item.updateFrequency}}</span>
            </div>
            <div class="top-song fl">
              <div class="song-box" v-for="(v,i) in item.tracks" :key="i">
                <span class="mingci">{{i+1}}、</span>
                <span>{{v.first}}</span> --
                <span>{{v.second}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="qita">
        <h1>其他榜单</h1>
        <div class="list-dan clearfix">
          <div class="dan fl" v-for="(item,index) in qita" :key="index" @click="goSongsDan(item)">
            <div class="dan-content">
              <div class="img-box" :style="{backgroundImage:`url('${item.coverImgUrl}')`}">
                <div class="gaodu"></div>
                <span class="img-desc">{{item.updateFrequency}}</span>
              </div>
              <div class="dan-text">{{item.name}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/TopList.less";
export default {
  data() {
    return {
      guanFang: [],
      qita: [],
    };
  },
  created() {
    this.getTopList();
  },
  methods: {
    onClickLeft() {
      this.$router.back();
    },
    getTopList() {
      this.axios({
        method: "GET",
        url: "http://localhost:3000/toplist/detail",
      })
        .then((result) => {
          
          result.data.list.map((v) => {
            if (v.tracks.length > 0) {
              this.guanFang.push(v);
            } else {
              this.qita.push(v);
            }
          });
        })
        .catch((err) => {
          
        });
    },

    goSongsDan(item) {
      this.$router.push({ name: "SongsDan", query: { id: item.id } });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
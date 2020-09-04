<template>
  <div class="allsongsdan">
    <van-nav-bar title="全部歌单" left-arrow @click-left="onClickLeft" fixed />
     <div class="songs-dan-box">
        <div class="list-dan clearfix">
          <div
            class="dan fl"
            v-for="(item,index) in danListData"
            :key="index"
            @click="clickDanId(item)"
          >
            <div class="dan-content">
              <div class="img-box" :style="{backgroundImage:`url('${item.picUrl}')`}">
                <div class="gaodu"></div>
              </div>
              <div class="dan-text">{{item.name}}</div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import '../assets/less/AllSongsDan.less'
export default {
    data(){
        return{
            danListData:[]
        }
    },
    created(){
        this.getAllDan()
    },
  methods: {
    onClickLeft() {
      this.$router.back();
    },
    getAllDan(){
        this.axios({
            method:'GET',
            url:'http://localhost:3000/personalized?limit=60'
        }).then(result =>{
            
            this.danListData = result.data.result
        })
    },
    clickDanId(item){
        this.$router.push({name:'SongsDan',query:{id:item.id}})
    }
  },
};
</script>

<style lang="less" scoped>
</style>
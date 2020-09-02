<template>
  <div class="record">
    <van-nav-bar title="订单详情" left-text="返回" left-arrow @click-left="back" :fixed="true"/>
    <div class="record-layout">
      <van-tabs type="card" @click="changeTab" >
        <van-tab :title="vt.title" v-for="(vt,it) in recordTitle" :key="it">
          <div class="record-card">
            <div class="record-list" v-for="(item,index) in RecordData" :key="index">
              <div class="listTitle clearfix">
                <div class="code fl">{{item.RecordId}}</div>
                <div class="state fr">
                  <span v-if="item.status === 1" @click="confirmRecord(item)">确认收货</span>
                  <span v-else>
                    已完成
                    <van-icon name="delete" @click="delRecord(item,index)" />
                  </span>
                </div>
              </div>
              <div class="listData clearfix" v-for="(v,i) in item.products" :key="i">
                <div class="card-center fl">
                  <img class="auto-img" :src="v.smallImg" alt />
                </div>
                <div class="card-right fl">
                  <div class="commodity clearfix">
                    <div class="com-name fl">
                      <div class="cn">
                        {{v.name}}
                        <span>{{v.rule}}</span>
                      </div>
                      <div class="en">{{v.enname}}</div>
                    </div>

                    <div class="com-num fr">
                      <div class="price-box">
                        ￥
                        <span>{{v.price}}</span>
                      </div>
                    </div>
                    <div class="com-count fr">
                      <div class="count-box">
                        X
                        <span>{{v.count}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="listTotal">
                共计
                <span>{{item.count}}</span>件商品 合计:￥
                <span>{{item.total}}.00</span>
              </div>
              <div class="date">{{item.date}}</div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import "../assets/css/Record.less";
import { utils } from "../assets/js/utils";
export default {
  data() {
    return {
      RecordData: [],
      tabIndex:0,
      recordTitle:[
        {title:'全部订单'},
        {title:'进行中'},
        {title:'已完成'}
      ]
    };
  },
  created() {
    this.getRecordData(0);
  },

  methods: {
    back() {
      this.$router.push({ name: "My" });
    },
    //获取订单信息
    getRecordData(status) {
      this.RecordData = [];
      let tokenString = localStorage.getItem("CSTK");
      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code === 70000) {
            let RecordData = {};
            result.data.result.map((v) => {
              if (!RecordData[v.oid]) {
                RecordData[v.oid] = {
                  RecordId: v.oid,
                  date: v.createdAt,
                  count: v.count,
                  total: v.count * v.price,
                  products: [v],
                  status: v.status,
                };
              } else {
                RecordData[v.oid].count += v.count;
                RecordData[v.oid].total += v.count * v.price;
                RecordData[v.oid].products.push(v);
              }
            });
            for (const key in RecordData) {
              this.RecordData.push(RecordData[key]);
            }
            // 
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    //删除订单记录
    delRecord(item,index) {
      let oid = item.RecordId;
      let tokenString = localStorage.getItem("CSTK");
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        oid,
      });
      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "POST",
        url: "removeOrder",
        data,
      }).then((result) => {
        this.$toast.clear();
        if (result.data.code === 90000) {
            this.RecordData.splice(index,1)
        }
      }).catch((err) => {
          this.$toast.clear();
          
        });;
    },
    //确认收货
    confirmRecord(item) {
      let oid = item.RecordId;
      let tokenString = localStorage.getItem("CSTK");
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        oid,
      });
      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "POST",
        url: "receive",
        data,
      }).then((result) => {
        this.$toast.clear();
        if (result.data.code === 80000) {
            item.status = 2
        }
      }).catch((err) => {
          this.$toast.clear();
          
        });;
    },
    //切换标签
    changeTab(name,title){
        this.getRecordData(name)
    }
  },
};
</script>

<style lang="less" scoped>
</style>
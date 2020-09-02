<template>
  <div class="detail">
    <van-nav-bar title="产品详情" left-text="返回" left-arrow :fixed="true" @click-left="returePage" />
    <div class="detail-box">
      <div class="img-box">
        <img class="auto-img" :src="product.large_img" alt />
      </div>
      <div class="detail-layout">
        <div class="coffee-name">
          <p class="cn">{{product.name}}</p>
          <p class="en">{{product.enname}}</p>
        </div>
        <div class="select" v-for="(item,index) in product.rules" :key="index">
          <div class="flex">
            <span>{{item.title}}</span>
          </div>
          <div class="select-flexs" v-for="(v,i) in item.rules" :key="i">
            <span :class="{active:v.isActive}" @click="toggleRule(v,index)">{{v.title}}</span>
          </div>
        </div>
        <van-divider>饮品介绍</van-divider>
        <div class="introduce">
          <p v-for="(v,i) in product.desc" :key="i">{{i+1+'.'+v}}</p>
        </div>
      </div>
      <div class="fixed-bottom">
        <div class="price">
          <span>{{isChange?this.product.price:price}}￥</span>
        </div>
        <div class="input">
          <van-stepper v-model="count" theme="round" button-size="22" @change="changeCount" />
        </div>
        <van-goods-action>
          <van-goods-action-icon
            icon="shopping-cart"
            text="购物车"
            :badge="bagCount == 0 ? '' : bagCount"
            @click="goShopbog"
          />
          <van-goods-action-icon
            icon="like"
            text="收藏"
            :color="isLike?'#303CAA':'#999'"
            @click="likeToggle"
          />
          <van-goods-action-button type="warning" color="#6A91EC" text="加入购物车" @click="addShopbag" />
          <van-goods-action-button type="danger" color="#0C34BA" text="立即购买" @click="nowPay" />
        </van-goods-action>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/css/Detail.less";
import { utils } from "../assets/js/utils";
export default {
  data() {
    return {
      price: "",
      isChange: true,
      count: 0,
      pid: "",
      product: {},
      isLike: false,
      bagCount: "",
    };
  },
  created() {
    this.pid = this.$route.query.pid;
    this.getProductByPid();
    this.findLike();
    this.findShopbag();
  },

  methods: {
    getProductByPid() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "/productDetail",
        params: {
          appkey: this.appkey,
          pid: this.pid,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 600) {
            result.data.result[0].desc = result.data.result[0].desc.split(/\n/);

            let ruleItems = ["tem", "sugar", "cream", "milk"];
            let rulesData = [];
            ruleItems.map((v) => {
              if (result.data.result[0][v] == "") {
                return;
              }
              let rule = {
                title: result.data.result[0][v + "_desc"],
                rules: [],
              };

              let r = result.data.result[0][v].split("/");
              r.map((value, index) => {
                let o = {
                  title: value,
                  isActive: index == 0,
                };
                rule.rules.push(o);
              });
              rulesData.push(rule);
            });
            result.data.result[0].rules = rulesData;

            this.product = result.data.result[0];
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    toggleRule(v, index) {
      if (v.isActive) {
        return;
      }
      let ruleData = this.product.rules[index].rules;
      for (let i = 0; i < ruleData.length; i++) {
        if (ruleData[i].isActive) {
          ruleData[i].isActive = false;
          break;
        }
      }
      v.isActive = true;
    },
    goShopbog() {
      this.$router.push({ name: "Shopbog" });
    },
    //返回前一页
    returePage() {
      this.$router.go(-1);
    },
    //价格显示
    changeCount() {
      this.isChange = false;
      let num = parseInt(this.product.price) * this.count;
      this.price = num + ".00";
    },

    //查询商品是否被收藏
    findLike() {
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "GET",
        url: "/findlike",
        params: {
          appkey: this.appkey,
          tokenString,
          pid: this.pid,
        },
      })
        .then((res) => {
          this.$toast.clear();
          // 
          if (res.data.code == 1000) {
            if (res.data.result.length == 1) {
              this.isLike = true;
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //收藏
    likeToggle() {
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return this.$toast("你还未登录!");
      }

      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        pid: this.pid,
      });
      let msg = this.isLike ? "已取消收藏" : "已收藏";
      let url = this.isLike ? "/notlike" : "/like";
      this.$toast({
        message: msg,
        duration: 500,
      });

      this.axios({
        method: "POST",
        url,
        data,
      })
        .then((result) => {
          // 
          //点击收藏
          if (result.data.code == "800") {
            this.isLike = true;
          } //取消收藏
          else if (result.data.code == "900") {
            this.isLike = false;
          }
        })
        .catch((err) => {
          
        });
    },

    //查询购物袋的数目
    findShopbag() {
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      this.axios({
        method: "GET",
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          
          if (res.data.code == "5000") {
            this.bagCount = res.data.result.length;
          } else {
            this.$toast(res.data.msg);
          }
        })
        .catch((err) => {
          
        });
    },

    //加入购物袋
    addShopbag(isPay) {
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return this.$toast("你还未登录!");
      }

      let rules = this.product.rules;

      let rule = [];

      rules.map((v) => {
        for (let i = 0; i < v.rules.length; i++) {
          if (v.rules[i].isActive) {
            rule.push(v.rules[i].title);
            break;
          }
        }
      });
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        pid: this.pid,
        count: this.count,
        rule: rule.join("/"),
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "POST",
        url: "/addShopcart",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == "3000") {
            if (result.data.status == 1) {
              this.bagCount++;
              this.$toast(result.data.msg);
            }
            if (isPay === true) {
              
              setTimeout(() =>{
                this.$router.push({name:'Order',query:{sids:result.data.sid}})
              },600)
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //立即结算
    nowPay() {
      this.addShopbag(true);
    },
  },
};
</script>

<style lang="less" scoped>
</style>
<template>
  <div class="shopbog">
    <div v-if="isShow">
      <van-nav-bar :fixed="true"  @click-right="changeDel">
        <template #right v-if="isHas">
          {{isEdit?'完成':'编辑'}}
          <!-- :right-text="isEdit?'完成':'编辑'" -->
        </template>
        <template #title>
          <div class="title">
            购物车(
            <span>{{total}}</span>)
          </div>
        </template>
      </van-nav-bar>
      <div class="shopbog-layout">
        <!-- 有商品界面 -->
        <div class="shopbog-has" v-show="isHas">
          <!-- <h1>购物车有东西</h1> -->
          <van-swipe-cell :disabled="!isEdit" v-for="(item,index) in productsData" :key="index">
            <van-cell :border="false" />
            <div class="card clearfix">
              <div class="card-left fl">
                <van-checkbox v-model="item.isChecked" @click="changeChe(item)" />
              </div>
              <div class="card-center fl">
                <img class="auto-img" :src="item.small_img" alt />
              </div>
              <div class="card-right fl">
                <div class="commodity">
                  <div class="com-name">
                    <div class="cn">
                      {{item.name}}
                      <span>{{item.rule}}</span>
                    </div>
                    <div class="en">{{item.enname}}</div>
                  </div>
                  <div class="com-num">
                    <div class="price-box fl">
                      ￥
                      <span>{{item.price}}</span>
                    </div>
                    <div class="count-box fr">
                      <van-stepper
                        v-model="item.count"
                        theme="round"
                        button-size="22"
                        @change="changeCount(item)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <template #right>
              <van-button square type="danger" text="删除" @click="delShop(item)" />
            </template>
          </van-swipe-cell>
          <!-- 提交区域 -->
          <van-submit-bar
            :price="isEdit?0:totalPrice"
            :button-text="isEdit?'删除选择':'提交订单'"
            @submit="toggleShopAll"
          >
            <van-checkbox v-model="checked" @click="changeAllche">全选</van-checkbox>
          </van-submit-bar>
        </div>
        <!-- 无商品界面 -->
        <van-empty description="购物车还是空的" v-show="!isHas" />
      </div>
    </div>

    <!-- 未登录 -->
    <div v-else>
      <div class="notlogin">
        <div class="layout-box">
          <van-empty image="error" description="您还未登录，快去登陆吧" />
          <div class="button-box">
            <van-button type="primary" to="../login">点击登陆</van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/css/Shopbog.less";
import { utils } from "../../assets/js/utils";
export default {
  data() {
    return {
      isShow: true,
      isHas: false,
      checked: "",
      isEdit: false,
      count: "",
      productsData: [],
      total: 0,
      totalPrice: 0,
    };
  },
  created() {
    this.isCstk();
    this.findShopbag();
  },
  methods: {
    changeChe(item) {
      for (let i = 0; i < this.productsData.length; i++) {
        if (!this.productsData[i].isChecked) {
          this.checked = false;
          this.sum();
          return;
        }
        this.checked = true;
        this.sum();
      }
    },
    changeAllche() {
      if (this.checked) {
        for (let i = 0; i < this.productsData.length; i++) {
          this.productsData[i].isChecked = true;
        }
      } else {
        for (let i = 0; i < this.productsData.length; i++) {
          this.productsData[i].isChecked = false;
        }
      }
      this.sum();
    },
    isCstk() {
      if (localStorage.getItem("CSTK") === null) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
    changeDel() {
      this.isEdit = !this.isEdit;
      
    },
    // 查询购物车数量
    findShopbag() {
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }
      this.productsData = [];
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
            this.total = res.data.result.length;
            this.isHas = res.data.result.length > 0 ? true : false;
            res.data.result.forEach((v) => {
              v.isChecked = false;
            });
            this.productsData = res.data.result;
            // 
          } else {
            this.$toast(res.data.msg);
          }
        })
        .catch((err) => {
          
        });
    },
    //删除购物车商品
    delShop(item) {
      let tokenString = localStorage.getItem("CSTK");
      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        sids: JSON.stringify([item.sid]),
      });
      this.axios({
        method: "POST",
        url: "/removeShopcart",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == "7000") {
            this.findShopbag();
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    //删除选中商品/提交订单
    toggleShopAll() {
      // 删除商品
      if (this.isEdit) {
        let sids = [];
        this.productsData.map((v) => {
          if (v.isChecked) {
            sids.push(v.sid);
          }
        });
        let tokenString = localStorage.getItem("CSTK");
        this.$toast.loading({
          message: "加载中",
          forbidClick: true,
          duration: 0,
          loadingType: "spinner",
        });
        let data = utils.queryString({
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sids),
        });
        this.axios({
          method: "POST",
          url: "/removeShopcart",
          data,
        })
          .then((result) => {
            this.$toast.clear();
            if (result.data.code == "7000") {
              for (let i = this.productsData.length - 1; i >= 0; i--) {
              if (this.productsData[i].isChecked) {
                this.productsData.splice(i, 1);
              }
            }
            }
          })
          .catch((err) => {
            this.$toast.clear();
            
          });
        return;
      }
      let sids = [];
        this.productsData.map((v) => {
          if (v.isChecked) {
            sids.push(v.sid);
          }
        });
        sids = sids.join('-')
      if (sids.length > 0) {
        // 
        this.$router.push({ name: "Order",query:{sids}});
      }
    },
    //修改商品数量
    changeCount(item) {
      let tokenString = localStorage.getItem("CSTK");
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        sid: item.sid,
        count: item.count,
      });
      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data,
      })
        .then((result) => {
          // 
          if (result.data.code == 6000) {
            // 
            this.sum();
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          
        });
    },
    //计算勾选总价格
    sum() {
      this.totalPrice = 0;
      this.productsData.map((v) => {
        if (v.isChecked) {
          this.totalPrice += v.price * v.count;
        }
      });
      this.totalPrice = this.totalPrice * 100;
    },
  },
};
</script>

<style lang="less" scoped>
</style>
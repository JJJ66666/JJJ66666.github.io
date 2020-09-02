<template>
  <div class="order">
    <van-nav-bar title="提交订单" left-text="返回" left-arrow @click-left="onClickLeft" :fixed="true" />
    <div class="warp">
      <div class="order-layout">
        <div class="address-box">
          <van-cell @click="showPopup">
            <div class="text">请选择收货地址</div>
          </van-cell>
          <van-popup position="bottom" round closeable :style="{ height: '50%' }" v-model="show">
            <van-address-list
              v-model="chosenAddressId"
              @select="hiddenPopup"
              :list="list"
              default-tag-text="默认"
              @add="goNewAdd"
            />
          </van-popup>

          <div class="address-center">
            <div class="name text">{{selectLocation.name}}</div>
            <div class="phone text">{{selectLocation.tel}}</div>
            <div class="location">{{selectLocation.address}}</div>
          </div>
        </div>
        <div class="order-list">
          <div class="listTitle">订单信息</div>
          <div class="listData clearfix" v-for="(item,index) in orderProduct" :key="index">
            <div class="card-center fl">
              <img class="auto-img" :src="item.small_img" alt />
            </div>
            <div class="card-right fl">
              <div class="commodity clearfix">
                <div class="com-name fl">
                  <div class="cn">
                    {{item.name}}
                    <span>{{item.rule}}</span>
                  </div>
                  <div class="en">{{item.enname}}</div>
                </div>

                <div class="com-num fr">
                  <div class="price-box">
                    ￥
                    <span>{{item.price}}</span>
                  </div>
                </div>
                <div class="com-count fr">
                  <div class="count-box">
                    X
                    <span>{{item.count}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="listTotal">
            共计
            <span>{{numTotal}}</span>件商品 合计:￥
            <span>{{priceTotal}}.00</span>
          </div>
        </div>
      </div>
      <van-submit-bar button-text="去结算" @submit="Pay" />
    </div>
  </div>
</template>

<script>
import "../assets/css/Order.less";
import { utils } from "../assets/js/utils";
export default {
  data() {
    return {
      show: false,
      chosenAddressId: "",
      //获取地址
      list: [],
      //选择地址
      selectLocation: {
        name: "",
        tel: "",
        address: "",
      },
      //商品数据
      orderProduct: [],
      //合计商品数量
      numTotal: 0,
      //合计价格
      priceTotal: 0,

      sids: [],
    };
  },
  created() {
    this.sids = this.$route.query.sids.split("-");
    this.getLocation();
    this.getProduct();
  },
  methods: {
    //获取提交商品数据
    getProduct() {
      let tokenString = localStorage.getItem("CSTK");
      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "/commitShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 50000) {
            result.data.result.map((v) => {
              this.numTotal += v.count;
              this.priceTotal += v.count * v.price;
            });
            this.orderProduct = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    //返回
    onClickLeft() {
      this.$router.go(-1);
    },
    //点击弹出层
    showPopup() {
      this.show = true;
    },
    //选择地址
    hiddenPopup(item, index) {
      this.show = false;
      for (const key in this.selectLocation) {
        this.selectLocation[key] = item[key];
      }
    },
    //跳转新增地址
    goNewAdd() {
      this.$router.push({ name: "NewAddress" });
    },

    //获取用户保存的地址
    getLocation() {
      let tokenString = localStorage.getItem("CSTK");
      this.$toast.loading({
        message: "加载中...",
        duration: 0,
        forbidClick: true,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code === 20000) {
            result.data.result.map((v) => {
              let locationA = v.province + v.city + v.county + v.addressDetail;
              this.list.push({
                id: v.aid,
                name: v.name,
                tel: v.tel,
                address: locationA,
                isDefault: Boolean(v.isDefault),
              });
              if (Boolean(v.isDefault)) {
                this.selectLocation.name = v.name;
                this.selectLocation.tel = v.tel;
                this.selectLocation.address = locationA;
                this.chosenAddressId = v.aid;
              }
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    //结算
    Pay() {
      if (this.chosenAddressId == "") {
        this.$toast("您还未选择地址");
        return;
      }
      let tokenString = localStorage.getItem("CSTK");
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        sids: JSON.stringify(this.sids),
        phone: this.selectLocation.tel,
        address: this.selectLocation.address,
        receiver: this.selectLocation.name,
      });
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "POST",
        url: "/pay",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          
          this.$toast(result.data.msg);
          if (result.data.code === 60000) {
            this.$router.push({ name: "Record" });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
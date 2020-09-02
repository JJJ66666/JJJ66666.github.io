<template>
  <div class="menu">
    <div class="search">
      <van-search
        shape="round"
        @input="search"
        v-model="value"
        background="#303CAA"
        placeholder="请输入搜索关键词"
      />
    </div>
    <div class="menu-layout">
      <van-tabs
        color="#303CAA"
        title-inactive-color="#333"
        title-active-color="#303CAA"
        @change="getProductsByType"
      >
        <van-tab v-for="(item,index) in typeData" :key="index">
          <template #title>
            <div class="title-img-box">
              <img :src="item.imges" class="title-img" alt />
            </div>
            <div class="title-text">
              <span>{{item.typeDesc}}</span>
            </div>
          </template>
          <div class="products-layout">
            <div
              class="products-box"
              v-for="(item,index) in prodicts"
              :key="index"
              @click="viewProductnfo(item.pid)"
            >
              <div class="img-box">
                <img :src="item.smallImg" class="auto-img" alt />
              </div>
              <div class="text-box">
                <p class="name">{{item.name}}</p>
                <p class="price">￥{{item.price}}</p>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
      <div class="search-pop" :style="{display:searchData.length? 'block':'none'}">
        <div
          class="search-list clearfix"
          v-for="(item,index) in searchData"
          :key="index"
          @click="viewProductnfo(item.pid)"
        >
          <div class="list-name fl">{{item.name}}</div>
          <div class="list-img fr" :style="{backgroundImage: `url(${item.largeImg})`}"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/css/Menu.less";
import { Icon } from "vant";
export default {
  data() {
    return {
      value: "",
      searchData: [],
      typeData: [],
      prodicts: [
        {
          name: "焦糖玛奇朵",
          smallImg:
            "http://www.kangliuyong.com:10002/images/product_small/IMG_0381_02p.jpg",
          price: "28.00",
          pid: "coffee002",
        },
        {
          name: "焦糖拿铁",
          smallImg:
            "http://www.kangliuyong.com:10002/images/product_small/IMG_0384_02p.jpg",
          price: "28.00",
          pid: "latte004",
        },
        {
          name: "榛果拿铁",
          smallImg:
            "http://www.kangliuyong.com:10002/images/product_small/IMG_0385_02p.jpg",
          price: "28.00",
          pid: "latte005",
        },
        {
          name: "抹茶瑞纳冰",
          smallImg:
            "http://www.kangliuyong.com:10002/images/product_small/IMG_0388_02p.jpg",
          price: "28.00",
          pid: "rena_ice002",
        },
        {
          name: "奥瑞白",
          smallImg:
            "http://www.kangliuyong.com:10002/images/product_small/IMG_0390_02p.jpg",
          price: "28.00",
          pid: "coffee006",
        },
        {
          name: "黑糖啵啵拿铁",
          smallImg:
            "http://www.kangliuyong.com:10002/images/product_small/IMG_0392_02p.jpg",
          price: "28.00",
          pid: "latte006",
        },
      ],

      isLoading: true,
    };
  },
  created() {
    this.getTypeData();
  },
  methods: {
    search() {
      this.searchData = [];
      if (this.value !== "") {
        this.axios({
          method: "GET",
          url: "/search",
          params: {
            appkey: this.appkey,
            name: this.value,
          },
        }).then((result) => {
          if (result.data.code === "Q001") {
            if (result.data.result.length === 0) {
              this.$toast("请输入正确关键字");
            } else {
              this.searchData = result.data.result;
            }
          }
        });
      }
    },
    getTypeData() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "/type",
        params: {
          appkey: this.appkey,
        },
      })
        .then((result) => {
          this.$toast.clear();
          //
          if (result.data.code == 400) {
            let titleData = [
              {
                type: "latte",
                imges: require("../../assets/imges/kafei2.png"),
              },
              {
                type: "coffee",
                imges: require("../../assets/imges/kafeibei.png"),
              },
              {
                type: "rena_ice",
                imges: require("../../assets/imges/coffee.png"),
              },
            ];
            result.data.result.map((v) => {
              for (let i = 0; i < titleData.length; i++) {
                if (v.type == titleData[i].type) {
                  v.imges = titleData[i].imges;
                  break;
                }
              }
            });

            result.data.result.unshift({
              type: "isHot",
              typeDesc: "推荐",
              imges: require("../../assets/imges/kafei1.png"),
            });
            this.typeData = result.data.result;
            //
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //
    getProductsByType(name, title) {
      this.prodicts = [];
      let data = sessionStorage.getItem(this.typeData[name].type);
      if (data) {
        this.prodicts = JSON.parse(data);
        return;
      }

      let params = {
        key: "type",
        value: this.typeData[name].type,
        appkey: this.appkey,
      };
      if (this.typeData[name].type == "isHot") {
        params.key = "isHot";
        params.value = 1;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "/typeProducts",
        params,
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 500) {
            this.isLoading = false;
            this.prodicts = result.data.result;
            //
            sessionStorage.setItem(
              this.typeData[name].type,
              JSON.stringify(this.prodicts)
            );
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //获取商品数据
    viewProductnfo(pid) {
      this.$router.push({ name: "Detail", query: { pid } });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
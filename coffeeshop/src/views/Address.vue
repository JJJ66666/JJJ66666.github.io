<template>
  <div class="address">
    <van-nav-bar title="地址管理" left-text="返回" left-arrow :fixed="true" @click-left="back"/>
    <div class="address-warp">
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        @add="goNewAdd"
        @edit="delAddress"
        @select="editAddress"
      ></van-address-list>
    </div>
  </div>
</template>

<script>
import { utils } from "../assets/js/utils";
export default {
  data() {
    return {
      chosenAddressId: "",
      list: [],
    };
  },

  created() {
    this.getLocation();
  },
  methods: {
    back(){
      this.$router.back()
    },
    goNewAdd() {
      this.$router.push({ name: "NewAddress" });
    },

    getLocation() {
      this.list = [];
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
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    delAddress(item) {
      this.$dialog
        .confirm({
          message: "确定删除吗",
        })
        .then(() => {
          let tokenString = localStorage.getItem("CSTK");
          this.$toast.loading({
            message: "加载中...",
            duration: 0,
            forbidClick: true,
            loadingType: "spinner",
          });
          let data = utils.queryString({
            appkey: this.appkey,
            tokenString,
            aid: item.id,
          });
          this.axios({
            method: "POST",
            url: "/deleteAddress",
            data,
          }).then((result) => {
            this.$toast.clear();
            
            if (result.data.code === 10000) {
              this.getLocation();
            }
          });
        })
        .catch(() => {
          
        });
    },

    editAddress(item){
      
      this.$router.push({name:'NewAddress',query:{aid:item.id}})
    }
  },
};
</script>

<style lang="less" scoped>
.address {
  .address-warp {
    width:100%;
    padding: 30px 0;
  }
  /deep/ .van-radio__icon {
    display: none;
  }
  /deep/.van-address-item__value {
    background: #f8f8f8;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  /deep/.van-address-item:not(:last-child) {
    margin: 0;
  }
  /deep/ .van-icon-edit::before {
    content: "删除";
    font-size: 14px;
    color: rgb(185, 24, 24);
  }
  /deep/.van-address-list__add{
    background: #303caa;
    border-color: #303caa;
  }
}
</style>
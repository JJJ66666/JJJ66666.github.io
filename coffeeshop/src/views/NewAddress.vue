<template>
  <div class="newaddress">
    <van-nav-bar
      :title="this.aid?'编辑地址':'新增地址'"
      @click-left="onClickLeft"
      left-text="返回"
      left-arrow
    />
    <van-address-edit
      :area-list="areaList"
      :address-info="addressInfo"
      show-postal
      show-set-default
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
    />
  </div>
</template>

<script>
import areaList from "../assets/js/areaList";
import { utils } from "../assets/js/utils";
export default {
  data() {
    return {
      areaList,
      addressInfo: {
        id: "",
        name: "",
        tel: "",
        province: "",
        city: "",
        county: "",
        addressDetail: "",
        areaCode: "",
        postalCode: "",
        isDefault: false,
      },
      aid: "",
    };
  },
  created() {
    this.aid = this.$route.query.aid;
    
    if (this.aid) {
      this.getAddress();
    }
  },
  methods: {
    onClickLeft() {
      
      this.$router.back();
      // this.$router.push({name:'Order'})
    },
    addAddress(address) {
      let conter = Object.assign({}, address);
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }
      delete conter.country;
      delete conter.id;
      conter.appkey = this.appkey;
      conter.tokenString = tokenString;
      conter.isDefault = Number(conter.isDefault);
      let data = utils.queryString(conter);
      
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        url: "/addAddress",
        method: "POST",
        data,
      }).then((result) => {
        this.$toast.clear();
        if (result.data.code === 9000) {
          setTimeout(() => {
            this.$router.back();
          }, 1500);
        }
      });
    },
    getAddress() {
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
        url: "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid,
        },
      }).then((result) => {
        this.$toast.clear();
        
        if (result.data.code === 40000) {
          result.data.result.map((v) => {
            for (const key in this.addressInfo) {
              if (key == "isDefault") {
                this.addressInfo[key] = Boolean(v[key]);
              } else {
                this.addressInfo[key] = v[key];
              }
            }
          });
          
        }
      });
    },

    editAddress(content) {
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      let isChange = false;
      for (const key in this.addressInfo) {
        if (this.addressInfo[key] != content[key]) {
          isChange = true;
          break;
        }
      }

      if (isChange) {
        let addressData = Object.assign({}, content);
        delete addressData.country;
        delete addressData.id;
        addressData.aid = this.aid;

        addressData.tokenString = tokenString;
        addressData.appkey = this.appkey;
        addressData.isDefault = Number(addressData.isDefault);

        let data = utils.queryString(addressData);
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
          loadingType: "spinner",
        });
        this.axios({
          method: "POST",
          url: "/editAddress",
          data,
        })
          .then((result) => {
            this.$toast.clear();
            
            if (result.data.code == 30000) {
              this.$router.push({ name: "Address" });
            }
          })
          .catch((err) => {
            this.$toast.clear();
            
          });
      } else {
        this.$router.push({ name: "Address" });
      }
    },
    onSave(address) {
      if (this.aid) {
        this.editAddress(address);
      } else {
        this.addAddress(address);
      }
    },
  },
};
</script>

<style lang="less" scoped>
  .newaddress{
    /deep/.van-address-edit__buttons .van-button{
      background: #303caa;
      border-color: #303caa;
    }
  }
</style>
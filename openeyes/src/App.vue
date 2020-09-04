<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
#app {
  /deep/.van-nav-bar {
    background: #e33e33;
    /deep/.van-nav-bar__title {
      color: #fff;
    }
  }
  /deep/.van-nav-bar .van-icon {
    color: #fff;
  }

  /deep/.van-nav-bar__text {
    color: #fff;
  }
  .auto-img {
    width: 100%;
    // height: 100%;
    display: block;
  }
  .clearfix::after {
    content: "";
    display: block;
    clear: both;
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
}
</style>

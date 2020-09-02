<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
.Theme-color{
  background: #D2A35B;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.auto-img{
  width: 100%;
  display: block;
  text-align: center;
}
.clearfix::after{
    content: "";
    display: block;
    clear: both;
  }
</style>

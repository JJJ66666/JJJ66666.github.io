import Vue from 'vue'

import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible/flexible'
import {
  NavBar,
  Button,
  Icon,
  Swipe,
  SwipeItem,
  Cell,
  CellGroup,
  Tab,
  Tabs,
  Tabbar,
  TabbarItem,
  Toast,
  Popup
} from 'vant';

Vue.config.productionTip = false


Vue.use(VueAxios, axios)
  .use(Button)
  .use(NavBar)
  .use(Icon)
  .use(Swipe)
  .use(SwipeItem)
  .use(Cell)
  .use(CellGroup)
  .use(Tab)
  .use(Tabs)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Toast)
  .use(Popup)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
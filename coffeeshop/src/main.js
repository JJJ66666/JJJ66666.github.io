import Vue from 'vue'

import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './router'
import 'lib-flexible/flexible'
import {
  Form,
  Field,
  Icon,
  NavBar,
  Button,
  Popup,
  Tabbar,
  TabbarItem,
  Toast,
  Swipe,
  SwipeItem,
  Sticky ,
  Search ,
  Tab, 
  Tabs,
  Divider,
  GoodsAction, 
  GoodsActionIcon, 
  GoodsActionButton,
  Stepper,
  Empty,
  SwipeCell,
  Notify,
  Cell,
  Checkbox,
  CheckboxGroup,
  SubmitBar,
  AddressList,
  AddressEdit,
  Dialog,
  CellGroup,
  Uploader 
} from 'vant'
import './assets/icon/iconfont/iconfont.css'

Vue.use(Notify)

Vue.use(Form)
  .use(Swipe)
  .use(SwipeItem)
  .use(Button)
  .use(Tabs)
  .use(Tab)
  .use(NavBar)
  .use(Field)
  .use(Icon)
  .use(Popup)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Toast)
  .use(Sticky)
  .use(Search)
  .use(Divider)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(Stepper)
  .use(Empty)
  .use(SwipeCell)
  .use(Notify)
  .use(Cell)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(SubmitBar)
  .use(AddressList)
  .use(AddressEdit)
  .use(Dialog)
  .use(CellGroup)
  .use(Uploader)
Vue.use(VueAxios, axios)

axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

Vue.config.productionTip = false


Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
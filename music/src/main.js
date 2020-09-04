import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible/flexible'
import { Button,
         Search,
         Swipe, 
         SwipeItem,
         Toast ,
         NavBar ,
         Icon ,
         Sticky ,
         Popup ,
         List ,
         Slider ,
         Circle ,
         Cell, 
         CellGroup

} from 'vant'


Vue.use(VueAxios, axios)
Vue.use(Button)
.use(Search)
.use(Swipe)
.use(SwipeItem)
.use(Toast)
.use(NavBar)
.use(Icon)
.use(Sticky)
.use(Popup)
.use(List)
.use(Slider)
.use(Circle)
.use(Cell)
.use(CellGroup)










Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export const routes = [

  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/findpassword',
    name: 'Findpassword',
    component: () => import('../views/Findpassword.vue'),
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/Main.vue'),
    children: [{
        path: 'home',
        name: 'Home',
        component: () => import('../views/mainViews/Home.vue'),
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('../views/mainViews/Menu.vue'),
      },
      {
        path: 'shopbog',
        name: 'Shopbog',
        component: () => import('../views/mainViews/Shopbog.vue'),
      },
      {
        path: 'my',
        name: 'My',
        component: () => import('../views/mainViews/My.vue'),
      },
    ]

  },
  {
    path: '/detail',
    name: 'Detail',
    component: () => import('../views/Detail.vue')
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('../views/Order.vue'),
  },
  {
    path: '/newaddress',
    name: 'NewAddress',
    component: () => import('../views/NewAddress.vue'),
  },
  {
    path: '/address',
    name: 'Address',
    component: () => import('../views/Address.vue'),
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('../views/Account.vue'),
  },
  {
    path: '/record',
    name: 'Record',
    component: () => import('../views/Record.vue'),
  },
  {
    path: '/like',
    name: 'Like',
    component: () => import('../views/Like.vue'),
  },
  {
    path: '/safe',
    name: 'Safe',
    component: () => import('../views/Safe.vue'),
  },
  {
    path: '*',
    redirect: {
      name: 'Login'
    }
  }
]
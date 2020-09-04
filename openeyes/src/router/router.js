export const routes = [
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/Main.vue'),
    children: [{
      path: 'boutique',
      name: 'Boutique',
      component: () => import('../views/mainViews/Boutique.vue'),
    },
    {
      path: 'class',
      name: 'Class',
      component: () => import('../views/mainViews/Class.vue'),
    },
    {
      path: 'hot',
      name: 'Hot',
      component: () => import('../views/mainViews/Hot.vue'),
    },
  ]
  },
  {
    path: '/detail',
    name: 'Detail',
    component: () => import('../views/Detail.vue'),
  },
  {
    path: '*',
    redirect: {
      name: 'Boutique'
    }
  }
]
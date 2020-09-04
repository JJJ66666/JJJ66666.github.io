export const routes = [
    {
      path: '/home',
      name: 'Home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/songsdan',
      name: 'SongsDan',
      component: () => import('../views/SongsDan.vue'),
    },
    {
      path: '/todasongs',
      name: 'ToDaySongs',
      component: () => import('../views/ToDaySongs.vue'),
    },
    {
      path: '/allsongsdan',
      name: 'AllSongsDan',
      component: () => import('../views/AllSongsDan.vue'),
    },
    {
      path: '/toplist',
      name: 'TopList',
      component: () => import('../views/TopList.vue'),
    },
    {
      path: '/playsong',
      name: 'PlaySong',
      component: () => import('../views/PlaySong.vue'),
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('../views/Search.vue'),
    },
    {
      path: '/singersop',
      name: 'SingerTop',
      component: () => import('../views/SingerTop.vue'),
    },
    
    {
      path: '/singerdetail',
      name: 'SingerDetail',
      component: () => import('../views/SingerDetail.vue'),
    },
    {
      path: '*',
      redirect: {
        name: 'Home'
      }
    }
  ]
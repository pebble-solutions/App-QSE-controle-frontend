import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/programmation',
    name: 'programmation',
    component: () => import(/* webpackChunkName: "about" */ '../views/DriveKn.vue')
    

  },
  {
    path: '/collecte',
    name: 'collecte', 
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Collecte.vue'),
    children: [
      {
        path:':id',
        name:'collecteKN',
        component: () => import(/* webpackChunkName: "about" */ '../views/CollecteKN.vue'),
        children: [
          {
            path: 'bloc/:bloc',
            component: () => import('../views/Bloc.vue')
          }
        ]
      },


      // {
      //   path: 'properties',
      //   component: () => import('../views/ElementProperties.vue')
      // },
      // {
      //   path: 'informations',
      //   component: () => import('../views/ElementInformations.vue')
      // },
      // {
      //   path: 'bloc/:bloc',
      //   component: () => import('../views/Bloc.vue')
      // },
    ]


  },
  {
    path: '/formulaire/:id',
    name: 'Formulaire',
    component: () => import(/* webpackChunkName: "about" */ '../views/CollecteKN.vue'),
    children: [
      {
        path: 'properties',
        component: () => import('../views/ElementProperties.vue')
      },
      {
        path: 'informations',
        component: () => import('../views/ElementInformations.vue')
      },
      {
        path: 'bloc/:bloc',
        component: () => import('../views/Bloc.vue')
      },
      // {
      //   path: '',
      //   component: () => import('../views/Contexte.vue')
      // }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

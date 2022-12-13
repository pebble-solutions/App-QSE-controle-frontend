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
    component: () => import(/* webpackChunkName: "about" */ '../views/Programmation.vue'),
    children: [
        {
          path:':id',
          name: 'ParType',
          component: () => import(/* webpackChunkName: "about" */ '../views/DriveKn.vue'),
        },
        {
          path:'/new',
          name: 'CollectNew',
          component: () => import(/* webpackChunkName: "about" */ '../views/CollectEdit.vue')
        },
        {
          path:':id/edit',
          name: 'CollectEdit',
          component: () => import(/* webpackChunkName: "about" */ '../views/CollectEdit.vue')
        }
    ]
  },

  {
    path: '/collecte',
    name: 'collecte', 
    component: () => import(/* webpackChunkName: "about" */ '../views/Collecte.vue'),
    children: [
      {
        path:':id',
        name:'collecteKN',
        component: () => import(/* webpackChunkName: "about" */ '../views/CollecteKN.vue'),
        children: [
          {
            path: 'bloc/:bloc',
            name: 'collecteKnBloc',
            component: () => import('../views/Bloc.vue')
          },
          {
            path:'collecte-end',
            name: 'CollectKnEnd',
            component: () => import('../views/CollecteKNEnd.vue')
          }
        ]
      }



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

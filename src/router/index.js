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
          path:'new',
          name: 'NewCollecte',
          component: () => import(/* webpackChunkName: "about" */ '../views/CollecteNew.vue')
        }
    ]
  },
  {
    path:'/programmation/:id',
    name: 'CollectesByType',
    component: () => import(/* webpackChunkName: "about" */ '../views/ProgrammationCollectes.vue'),
    children: [
        {
          path:':idCollecte/edit',
          name: 'EditCollecte',
          component: () => import(/* webpackChunkName: "about" */ '../views/CollecteEdit.vue')
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
          }
        ]
      },
      {
        path:':id/collecte-end',
        name: 'CollectKnEnd',
        component: () => import('../views/CollecteKNEnd.vue')
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

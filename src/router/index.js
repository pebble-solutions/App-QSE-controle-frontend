import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/statistiques',
    name: 'Statistiques',
    component: () => import('../views/Statistiques.vue'),
  },
  {
    path: '/programmation',
    name: 'Programmation',
    component: () => import(/* webpackChunkName: "about" */ '../views/Programmation.vue'),
    children: [
      {
        path: 'new',
        name: 'NewCollecte',
        component: () => import(/* webpackChunkName: "about" */ '../views/CollecteNew.vue')
      }
    ]
  },
  {
    path: '/programmation/:id',
    name: 'CollectesByType',
    component: () => import(/* webpackChunkName: "about" */ '../views/ProgrammationCollectes.vue'),
    children: [
      {
        path: ':idCollecte/edit',
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
        path: 'new',
        name: 'UnexpectedCollecte',
        component: () => import(/* webpackChunkName: "about" */ '../views/CollecteNewUnexpected.vue')
      }
    ]
  },

  {
    path: '/collecte/:id',
    name: 'collecteKN',
    component: () => import(/* webpackChunkName: "about" */ '../views/CollecteKN.vue'),
    children: [
      {
        path: 'bloc/:bloc',
        name: 'collecteKnBloc',
        component: () => import('../views/Bloc.vue')
      },
      {
        path: 'collecte-end',
        name: 'CollectKnEnd',
        component: () => import('../views/CollecteKNEnd.vue'),
        // children: [
        //   {
        //     path:'collecte-Control',
        //     name: 'CollecteControl',
        //     component: () => import('../views/CollecteControl.vue')
        //   },
        // ],
      },
      {
        path: 'collecte-verif',
        name: 'CollecteVerif',
        component: () => import('../views/CollecteVerif.vue'),
        children: [
          {
            path: 'next',
            name: 'CollecteNext',
            component: () => import('../views/CollecteNext.vue')
          },
        ]
      }

    ]
  },

  {
    path: '/consultation',
    name: 'consultation',
    component: () => import("../views/Consultation.vue"),
  },

  {
    path: '/consultation/:idCollecte',
    name: 'consultationCollecte',
    component: () => import("../views/ConsultationCollecte.vue"),
    children: [
      {
        path: 'new',
        name: 'newCollecte',
        component: () => import(/* webpackChunkName: "about" */ '../views/ConsultationCollecteNew.vue')
      }
    ]
  },

  {
    path: '/consultation/projet',
    name: 'consultationProjet',
    component: () => import("../views/ConsultationProjet.vue"),
  },
  {
    path: '/consultation/projet/:idProjet',
    name: 'consultationProjetList',
    component: () => import("../views/ConsultationProjetList.vue"),

    children: [
      {
        path: ':idCollecte',
        name: 'consultationProjetCollecte',
        component: () => import(/* webpackChunkName: "about" */ '../views/ConsultationProjetCollecte.vue')
      }
    ]

  },

  {
    path: '/consultation/formulaire',
    name: 'consultationForm',
    component: () => import("../views/ConsultationForm.vue"),
  },
  {
    path: '/consultation/formulaire/:idFormulaire',
    name: 'consultationFormList',
    component: () => import("../views/ConsultationFormList.vue"),

    children: [
      {
        path: ':idCollecte',
        name: 'consultationFormCollecte',
        component: () => import(/* webpackChunkName: "about" */ '../views/ConsultationFormCollecte.vue')
      }
    ]

  },

  {
    path: '/consultation/kn_wtbcl',
    name: 'consultationKnWtBcl',
    component: () => import("../views/Consultation.vue"),
  },
  {
    path: '/consultation/kn_wtbcl/:idCollecte',
    name: 'consultationKnWtBclList',
    component: () => import("../views/ConsultationCollecte.vue"),

  },

  {
    path: '/consultation/ss_operateur',
    name: 'consultationSsOperateur',
    component: () => import("../views/Consultation.vue"),
  },
  {
    path: '/consultation/ss_operateur/:idCollecte',
    name: 'consultationSsOperateurList',
    component: () => import("../views/ConsultationCollecte.vue"),

  },

  {
    path: '/consultation/ss_controleur',
    name: 'consultationSsControleur',
    component: () => import("../views/Consultation.vue"),
  },
  {
    path: '/consultation/ss_controleur/:idCollecte',
    name: 'consultationSsControleurList',
    component: () => import("../views/ConsultationCollecte.vue"),

  },

  {
    path: '/habilitation',
    name: 'Habilitation',
    component: () => import("../views/habilitation/Habilitation.vue"),
  },
  {
    path: '/habilitationHab/:id',
    name: 'habilitationByHab',
    component: () => import(/* webpackChunkName: "about" */ '../views/HabilitationByHab.vue'),
    children: [
      {
        path: 'new/:idHab/:idForm/:idOperateur:',
        name: 'NewCollecteVeille',
        component: () => import(/* webpackChunkName: "about" */ '../views/VeilleCollecteNew.vue')
      }
    ]
  },
  {
    path: '/habilitation/Habilitation',
    name: 'HabilitationHabilitation',
    component: () => import(/* webpackChunkName: "about" */ '../views/HabilitationHabilitation.vue')
  },

  {
    path: '/operateur',
    name: 'Operateur',
    component: () => import("../views/Operateur.vue"),
  },
  {
    path: '/operateur/:id',
    name: 'habilitationByAgent',
    component: () => import(/* webpackChunkName: "about" */ '../views/HabilitationByAgent.vue'),
    children: [
      {
        path: ':idHab',
        name: 'ControlHistory',
        component: () => import(/* webpackChunkName: "about" */ '../views/ControlHistory.vue'),
        children: [
          {
            path: ':idCollecte',
            name: 'ControlView',
            component: () => import(/* webpackChunkName: "about" */ '../views/ControlVue.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/habilitation/Agent',
    name: 'HabilitationAgent',
    component: () => import(/* webpackChunkName: "about" */ '../views/HabilitationAgent.vue')
  },
  {
    path:'/habilitation/idHabilitation',
    name: 'HabilitationHabilitation',
    component: () => import(/* webpackChunkName: "about" */ '../views/HabilitationHabilitation.vue')
  },
  {
    path:'/echeancier',
    name: 'Echeancier',
    component: () => import(/* webpackChunkName: "about" */ '../views/Echeancier.vue')
  },
  {
    path: '/habilitationPersonnel',
    name: 'HabilitationPersonnel',
    component: () => import("../views/habilitation/HabilitationPersonnel.vue"),
    children: [
      {
        path: ':id',
        name: 'HabilitationPersonnelStatus',
        component: () => import("../views/habilitation/HabilitationPersonnelStatus.vue"),
      }
    ]
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

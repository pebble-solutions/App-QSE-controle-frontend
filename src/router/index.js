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
    component: () => import(/* webpackChunkName: "about" */ '../views/programmation/Index.vue'),
    children: [
      {
        path: 'new',
        name: 'NewCollecte',
        component: () => import(/* webpackChunkName: "about" */ '../views/programmation/New.vue')
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
    component: () => import(/* webpackChunkName: "about" */ '../views/controle/Index.vue'),
    children: [
      {
        path: 'new',
        name: 'UnexpectedCollecte',
        component: () => import(/* webpackChunkName: "about" */ '../views/controle/New.vue')
      }
    ]
  },

  {
    path: '/collecte/:id',
    name: 'collecteKN',
    component: () => import(/* webpackChunkName: "about" */ '../views/controle/CollecteKN.vue'),
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
    component: () => import("../views/consultation/Index.vue"),
  },

  {
    path: '/consultation/:idCollecte',
    name: 'consultationCollecte',
    component: () => import("../views/consultation/Collecte.vue"),
    children: [
      {
        path: 'new',
        name: 'newCollecte',
        component: () => import(/* webpackChunkName: "about" */ '../views/ConsultationCollecteNew.vue')
      },
      {
        path: 'addPrevious',
        name: 'addPreviousCollecte',
        component: () => import(/* webpackChunkName: "about" */ '../views/ConsultationCollecteAddPrevious.vue')
      },
      {
        path: 'edit',
        name: 'editCollecte',
        component: () => import(/* webpackChunkName: "about" */ '../views/consultation/EditHeaders.vue')
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
    component: () => import("../views/ConsultationOptions.vue")
  },
  {
    path: '/consultation/kn_wtbcl/:idCollecte',
    name: 'consultationKnWtBclList',
    component: () => import("../views/consultation/Collecte.vue"),
    children: [
      {
        path: 'edit',
        name: 'knWtbclEditCollecte',
        component: () => import(/* webpackChunkName: "about" */ '../views/consultation/EditHeaders.vue')
      }
    ]
  },

  {
    path: '/consultation/ss_operateur',
    name: 'consultationSsOperateur',
    component: () => import("../views/ConsultationOptions.vue"),
  },
  {
    path: '/consultation/ss_operateur/:idCollecte',
    name: 'consultationSsOperateurList',
    component: () => import("../views/consultation/Collecte.vue"),
    children: [
      {
        path: 'edit',
        name: 'consultationSsOperateurEditCollecte',
        component: () => import(/* webpackChunkName: "about" */ '../views/consultation/EditHeaders.vue')
      }
    ]
  },

  {
    path: '/consultation/ss_controleur',
    name: 'consultationSsControleur',
    component: () => import("../views/ConsultationOptions.vue"),
  },
  {
    path: '/consultation/ss_controleur/:idCollecte',
    name: 'consultationSsControleurList',
    component: () => import("../views/consultation/Collecte.vue"),
    children: [
      {
        path: 'edit',
        name: 'consultationSsControleurEditCollecte',
        component: () => import(/* webpackChunkName: "about" */ '../views/consultation/EditHeaders.vue')
      }
    ]
  },

  {
    path: '/consultation/operateur',
    name: 'consultationOperateur',
    component: () => import("../views/ConsultationOptions.vue"),
  },
  {
    path: '/consultation/operateur/:idPersonnel',
    name: 'consultationOperateurList',
    component: () => import("../views/ConsultationPersonnelList.vue"),
    children: [
      {
        path: ':idCollecte',
        name: 'consultationCollecteOptionsOperateur',
        component: () => import(/* webpackChunkName: "about" */ '../views/ConsultationCollecteOptionsPersonnel.vue')
      }
    ]
  },

  {
    path: '/consultation/controleur',
    name: 'consultationControleur',
    component: () => import("../views/ConsultationOptions.vue"),
  },
  {
    path: '/consultation/controleur/:idPersonnel',
    name: 'consultationControleurList',
    component: () => import("../views/ConsultationPersonnelList.vue"),
    children: [
      {
        path: ':idCollecte',
        name: 'consultationCollecteOptionsControleur',
        component: () => import(/* webpackChunkName: "about" */ '../views/ConsultationCollecteOptionsPersonnel.vue')
      }
    ]

  },

  {
    path: '/consultation/kndekn',
    name: 'consultationKndeKn',
    component: () => import("../views/ConsultationOptions.vue"),
  },
  {
    path: '/consultation/kndekn/:idCollecte',
    name: 'consultationKndeKnList',
    component: () => import("../views/consultation/Collecte.vue"),

  },

  {
    path: '/consultation/knsskn',
    name: 'consultationKnssKn',
    component: () => import("../views/ConsultationOptions.vue"),
  },
  {
    path: '/consultation/knsskn/:idCollecte',
    name: 'consultationKnssKnList',
    component: () => import("../views/consultation/Collecte.vue"),

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
    children: [
      {
        path: ':id',
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
    component: () => import(/* webpackChunkName: "about" */ '../views/Echeancier.vue'),
    children: [
      {
        path: 'consultation/:idCollecte',
        name: 'EcheancierConsultationCollecte',
        component: () => import(/* webpackChunkName: "about" */ '../views/ConsultationCollecteOptionsPersonnel.vue')
      }
    ]
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

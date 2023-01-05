<template>

	<AppWrapper
		:cfg="cfg"
		:cfg-menu="cfgMenu"
		:cfg-slots="cfgSlots"
		
		@auth-change="setLocal_user">

		<template v-slot:header>
			<stats-header v-if="listMode === 'home'" />
			<programmation-header v-else-if="listMode === 'programmation'" />
			<ControleHeader v-else-if="listMode === 'collecte'"></ControleHeader>
		</template>


		<template v-slot:menu>
			<AppMenu>
				<AppMenuItem href="/programmation" look="dark" icon="bi bi-calendar-event-fill">Programmation</AppMenuItem>
				<AppMenuItem href="/" look="dark" icon="bi bi-bar-chart-line-fill">Statistiques</AppMenuItem>
				<AppMenuItem href="/collecte" look="dark" icon="bi bi-pen-fill">Contrôle</AppMenuItem>
				<AppMenuItem href="/consultation" look="dark" icon="bi bi-eye-fill">Consultation</AppMenuItem>
			</AppMenu>
		</template>

		<template v-slot:list>
			<AppMenu v-if="listMode === 'collecte'">
				<!-- || $route.path == 'collecte'+coll.id -->
				<AppMenuItem :href="'/collecte/'+col.id" v-for="col in collectes" :key="col.id" >
					<div class="d-flex align-items-center justify-content-between">
						<collecte-item :collecte="col" />
					</div>
				</AppMenuItem>
			</AppMenu>
			<AppMenu v-else-if="listMode === 'programmation'">
				<AppMenuItem :href="'/programmation/'+form.id"  v-for="form in formulaires" :key="form.id">
					<formulaire-item :num="form.nb_todo" :formulaire="form" />
				</AppMenuItem>
			</AppMenu>
			<AppMenu v-else-if="listMode === 'consultation'">
				<AppMenuItem :href="'/consultation/'+form.id" v-for="form in formulaires" :key="form.id">
					<formulaire-item :num="form.nb_done" :formulaire="form" />
				</AppMenuItem>
			</AppMenu>
			<AppMenu v-else-if="listMode === 'home'">
				<form-stats />
			</AppMenu>
		</template>

		<template v-slot:core>
			<div class="px-2 bg-light" v-if="isConnectedUser">
				<router-view/>
			</div>
		</template>
	</AppWrapper>
</template>



<script>

import AppWrapper from '@/components/pebble-ui/AppWrapper.vue'
import AppMenu from '@/components/pebble-ui/AppMenu.vue'
import AppMenuItem from '@/components/pebble-ui/AppMenuItem.vue'
import { mapActions, mapState } from 'vuex'

import CONFIG from "@/config.json"
import FormStats from './components/FormStats.vue'
import CollecteItem from './components/CollecteItem.vue'
import StatsHeader from './components/headers/StatsHeader.vue'
import ProgrammationHeader from './components/headers/ProgrammationHeader.vue'
import FormulaireItem from './components/menu/FormulaireItem.vue'
import ControleHeader from './components/headers/ControleHeader.vue'

export default {

	data() {
		return {
			cfg: CONFIG.cfg,
			cfgMenu: CONFIG.cfgMenu,
			cfgSlots: CONFIG.cfgSlots,
			appController: null,
			pending: {
				formulaires: true,
				collectes: true,
				projetsActifs: true
			},
			isConnectedUser: false,
		}
	},

	computed: {
		...mapState(['openedElement','collectes','formulaires', 'listActifs', 'projetsActif']),

		/**
		 * Détermine quelle liste afficher :
		 * collecte, programmation
		 * 
		 * @return {string}
		 */
		listMode() {
			if (['collecte', 'collecteKN', 'collecteKnBloc', 'CollectKnEnd','UnexpectedCollecte'].includes(this.$route.name)) {
				return 'collecte';
			}
			else if (['Programmation', 'CollectesByType', 'EditCollecte', 'NewCollecte'].includes(this.$route.name)) {
				return 'programmation';
			}
			else if (['consultation', 'consultationFormulaire', 'ConsultationResponses'].includes(this.$route.name)) {
				return 'consultation';
			}
			else if (['Home'].includes(this.$route.name)) {
				return 'home';
			}
			return null;
		}
	},

	watch: {
		$route () {
			this.$app.dispatchEvent('menuChanged', 'list');
		},

		/**
		 * Analyse la liste demandée afin de charger les données sur le serveur 
		 * 
		 * @param {string} val Nouvelle liste demandée
		 */
		listMode(val) {
			if (this.isConnectedUser) {
				if (val == 'collecte') {
					this.loadCollectes();
				}
			}
		}
	},

	methods: {
		...mapActions(['refreshFormulaires', 'refreshCollectes', 'refreshListActifs', 'refreshProjetsActifs', 'setCollectes']),

		/**
		 * Met à jour les informations de l'utilisateur connecté
		 * @param {Object} user Un objet LocalUser
		 */
		setLocal_user(user) {
			if (user) {
				this.$store.dispatch('login', user);
				this.isConnectedUser = true;
			}
			else {
				this.$store.dispatch('logout');
				this.isConnectedUser = false;
			}
		},

		/**
		 * Charge les collectes depuis le serveur et les stock dans le store
		 * 
		 * @return {Promise<object>}
		 */
		loadCollectes() {
			return this.loadRessources('collecte', {enqueteur_login: 'self', done: 'NON'});
		},

		/**
		 * Charge l'ensemble des formulaires depuis le serveur et les stock dans le store
		 * 
		 * @return {Promise<object>}
		 */
		loadFormulaires() {
			return this.loadRessources('formulaire')
		},

		/**
		 * Charge une ressrouce depuis le serveur vers le store.
		 * 
		 * @param {string} ressourceName 	Le nom de la ressource à charger dans le store ('collecte', 'formulaire')
		 * @param {object} query			Paramètres passés via GET
		 * 
		 * @return {Promise<object>}
		 */
		loadRessources(ressourceName, query) {
			let route = 'data/GET/'+ressourceName;
			let pending = ressourceName+'s';
			let refreshMethod = 'refresh'+ressourceName.charAt(0).toUpperCase() + ressourceName.slice(1)+'s';
			if (ressourceName == 'collecte') {
				refreshMethod = 'setCollectes';
			}
			query = typeof query === 'undefined' ? {} : query;
			query.limit = 'aucune';

			this.pending[pending] = true;

			return this.$app.apiGet(route, query)
				.then(data => {
					this[refreshMethod](data);
					return data;
				})
				.catch(this.$app.catchError)
				.finally(() => this.pending[pending] = false)
		},

		/**
		 * Charge le personnel actifs
		 */
		loadAgent() {
            this.pending.loadAgent = true;
            this.$app.apiGet('structurePersonnel/GET/list', {
                actif:true,
				structure: "toutes",
				limit: "aucune"
            })
			.then((data) => {
				console.log(data);
				this.refreshListActifs(data);
			})
			.catch(this.$app.catchError)
			.finally(this.pending.loadAgent = false);
        },

		/**
         * Récupère tout les projets en production
         */
		getAllProjetsActif() {
            this.pending.projetsActifs = true;

            let urlApi = '/projet/GET/list';

            this.$app.apiGet(urlApi, {
                in_production: true
            }).then( (data) => {
                this.refreshProjetsActifs(data);
            }).catch(this.$app.catchError);

            this.pending.projetsActifs = false;
        },
	},

	components: { AppWrapper, AppMenu, AppMenuItem, FormStats, CollecteItem, StatsHeader, ProgrammationHeader, FormulaireItem, ControleHeader },

	mounted() {
		this.$app.addEventListener('structureChanged', () => {
			this.$router.push('/programmation');
			if (this.isConnectedUser) {
				this.loadFormulaires();
				this.loadAgent();
				// this.getAllProjetsActif();
			}
		});
	}

}
</script>
<template>

	<AppWrapper
		:cfg="cfg"
		:cfg-menu="cfgMenu"
		:cfg-slots="cfgSlots"
		:sidebar-menu="appMenu"
		
		@auth-change="setLocal_user">

		<template v-slot:header>
			<div class="d-none d-sm-block">
				<stats-header v-if="listMode === 'home'" />
				<programmation-header v-else-if="listMode === 'programmation'" />
				<ControleHeader v-else-if="listMode === 'collecte'"></ControleHeader>
			</div>
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
				<template v-if="pending.collectes">
					<Spinner />
				</template>
				<template v-else>
					<AppMenuItem :href="'/collecte/'+col.id" v-for="col in collectes" :key="col.id" >
						<div class="d-flex align-items-center justify-content-between">
							<collecte-item :collecte="col" />
						</div>
					</AppMenuItem>
					<alert-message class-name="m-2" v-if="noVal(collectes)">Vous n'avez aucun contrôle à réaliser.</alert-message>
				</template>
			</AppMenu>
			<AppMenu v-else-if="listMode === 'programmation'">
				<template v-if="pending.formulaires">
					<Spinner />
				</template>
				<template v-else>
					<template v-for="form in formulaires" :key="form.id">
						<AppMenuItem :href="'/programmation/'+form.id" v-if="form.nb_todo" >
							<formulaire-item :num="form.nb_todo" :formulaire="form" />
						</AppMenuItem>
					<alert-message class-name="m-2" v-if="noVal(formulaires)">Il n'y a aucun contrôle programmé.</alert-message>
					</template>
				</template>
			</AppMenu>
			<AppMenu v-else-if="listMode === 'consultation'">
				<template v-if="pending.formulaires">
					<Spinner />
				</template>
				<template v-else>
										<!-- Implémentation version 2 -->
					<SearchControl> </SearchControl>
					<search-control-copy
						v-model:dd="searchOptionsDd"
						v-model:df="searchOptionsDf"
						v-model:mode="searchOptionsMode"
					></search-control-copy>
					<span class="badge bg-primary me-1">du  {{ searchOptionsDd }}</span>
					<span class="badge bg-primary me-1">au  {{ searchOptionsDf }}</span>



					
					
					<!-- <LoadPlus/> -->
				</template>
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

<style lang="scss">
.fs-7 {
	font-size: 0.80rem !important;
}
</style>

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
import Spinner from './components/pebble-ui/Spinner.vue'
import AlertMessage from './components/pebble-ui/AlertMessage.vue'
import SearchControl from './components/SearchControl.vue'
import SearchControlCopy from './components/SearchControlCopy.vue'

// import LoadPlus from './components/LoadPlus.vue'

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
				projets: true,

			},
			isConnectedUser: false,
			appMenu: [
				{
					label: 'Programmation',
					icon: 'bi bi-calendar-event-fill',
					key: 'programmation',
					href: '/programmation'
				},
				{
					label: 'Statistiques',
					icon: 'bi bi-bar-chart-line-fill',
					key: 'stats',
					href: '/'
				},
				{
					label: 'Contrôle',
					icon: 'bi bi-pen-fill',
					key: 'collecte',
					href: '/collecte'
				},
				{
					label: 'Consultation',
					icon: 'bi bi-eye-fill',
					key: 'consultation',
					href: '/consultation'
				}
			],
			searchOptionsDd: '',
			searchOptionsDf: '',
			searchOptionsMode: 'collecte'


		}
	},

	computed: {
		...mapState(['openedElement', 'collectes', 'formulaires', 'listActifs', 'projets']),

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
		searchOptionsDd(){
			console.log(this.searchOptionsDd, 'searchO')
		},

		/**
		 * Analyse la liste demandée afin de charger les données sur le serveur 
		 * 
		 * @param {string} val Nouvelle liste demandée
		 */
		listMode(val, prevVal) {
			if (val !== prevVal) {
				if (this.isConnectedUser) {
					if (val == 'collecte') {
						this.loadCollectes();
					}
				}
			}
		}
	},

	methods: {
		...mapActions(['refreshFormulaires', 'refreshCollectes', 'refreshListActifs', 'refreshProjets', 'setCollectes']),

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
		 * Charge l'ensemble des projets depuis le serveur et les stock dans le store
		 */
		loadProjets() {
			this.pending.projets = true;

			let route = 'projet/GET/list';
			let query = {'in_production' : true}

			this.$app.apiGet(route, query)
			.then((data) => {
				this.refreshProjets(data);
			})
			.catch(this.$app.catchError)
			.finally(() => {this.pending.projets = false});

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
				this.refreshListActifs(data);
			})
			.catch(this.$app.catchError)
			.finally(this.pending.loadAgent = false);
        },

		/**
		 * Teste si la variable passé en argument n'a pas de valeur (0, null, [], "")
		 * 
		 * @param {mixed} val Une valeur à tester
		 * 
		 * @return {boolean}
		 */
		noVal(val) {
			if (!val) return true;
			if (!val.length) return true;
			return false;
		}
	},

	components: { AppWrapper, AppMenu, AppMenuItem, FormStats, CollecteItem, AlertMessage, StatsHeader, ProgrammationHeader, FormulaireItem, ControleHeader, Spinner , SearchControl, SearchControlCopy}, //, LoadPlus
	mounted() {
		this.$app.addEventListener('structureChanged', () => {
			this.$router.push('/programmation');
			if (this.isConnectedUser) {
				this.loadFormulaires();
				this.loadAgent();
				this.loadProjets();
			}
		});
	}

}
</script>
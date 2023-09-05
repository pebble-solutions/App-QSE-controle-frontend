<template>
	<AppWrapper :cfg="cfg" :cfg-menu="cfgMenu" :cfg-slots="cfgSlots" @auth-change="setLocal_user">

		<template v-slot:header>
			<div class="d-none d-sm-block">
				<stats-header v-if="listMode === 'home'" />
				<programmation-header v-else-if="listMode === 'programmation'" />
				<ControleHeader v-else-if="listMode === 'collecte'"></ControleHeader>
			</div>
		</template>

		<template v-slot:menu>
			<AppMenu>
				<AppMenuItem :href="menuItem.href" :icon="menuItem.icon" v-for="menuItem in appMenu" :key="menuItem.key"
					look="dark">
					{{ menuItem.label }}
				</AppMenuItem>
			</AppMenu>
		</template>

		<template v-slot:list>

			<AppMenu v-if="listMode === 'collecte'">
				<template v-if="pending.collectes">
					<Spinner />
				</template>
				<template v-else>
					<AppMenuItem :href="'/collecte/' + col.id" v-for="col in collectes" :key="col.id">
						<div class="d-flex align-items-center justify-content-between">
							<collecte-item :collecte="col" />
						</div>
					</AppMenuItem>
					<alert-message class-name="m-2" v-if="noVal(collectes)">Vous n'avez aucun contrôle à
						réaliser.</alert-message>
				</template>
			</AppMenu>
			<AppMenu v-else-if="listMode === 'programmation'">
				<template v-if="pending.formulaires">
					<Spinner />
				</template>
				<template v-else>
					<!-- <alert-message class-name="m-2" v-if="noVal(formulaires)" >Il n'y a aucun contrôle programmé.</alert-message> -->
					<alert-message class-name="m-2" v-if="!exist(formulaires)">Il n'y a aucun contrôle
						programmé</alert-message>
					<!-- <alert-message class-name="m-2" v-if="exist(formulaires)" >contrôle</alert-message> -->


					<template v-for="form in formulaires" :key="form.id">
						<AppMenuItem :href="'/programmation/' + form.id" v-if="form.nb_todo">
							<formulaire-item :num="form.nb_todo" :formulaire="form" />
						</AppMenuItem>
					</template>
				</template>
			</AppMenu>
			<AppMenu v-else-if="listMode === 'consultation'">
				<search-control v-model:dd="searchOptions.dd" v-model:df="searchOptions.df"
					v-model:mode="searchOptions.mode" v-model:pendingSearch="pending.search"></search-control>
				<template v-if="pending.search">
					<Spinner />
				</template>
				<template v-else>

					<template v-for="res in searchResults" :key="res.id">
						<app-menu-item v-if="searchOptions.mode === 'collecte'" :href="'/consultation/' + res.id">
							<collecte-item-done :collecte="res"></collecte-item-done>
						</app-menu-item>
						<app-menu-item v-else-if="searchOptions.mode === 'formulaire' && res.nb_done != 0"
							:href="'/consultation/formulaire/' + res.id">
							<formulaire-item :num="res.nb_done" :formulaire="res"></formulaire-item>
						</app-menu-item>
						<app-menu-item v-else-if="searchOptions.mode === 'projet' && res.nb_done != 0"
							:href="'/consultation/projet/' + res.id">
							<project-item-done :num="res.nb_done" :projet="res"></project-item-done>
						</app-menu-item>
					</template>
					<alert-message className="m-1" v-if="!searchResults.length">
						Il n'y a pas de résultat pour ces critères. Utilisez les options ci-dessus pour étendre votre
						recherche.
					</alert-message>

					<div class="d-grid my-2" v-if="isMoreAvailable && searchOptions.mode === 'collecte'">
						<button class="btn btn-outline-secondary" @click.prevent="loadMore()" :disabled="pending.loadMore">
							<span class="spinner-border spinner-border-sm" v-if="pending.loadMore"></span>
							Charger +
						</button>
					</div>

				</template>
			</AppMenu>
			<AppMenu v-else-if="listMode == 'habilitation'">
				<HabilitationList />
			</AppMenu>

			<AppMenu v-else-if="listMode == 'operateur'">
        <PersonnelList v-slot="personnelProps">
          <FicheIndividuelleSuiviItem :agent="personnelProps.personnel" :stats="getStatsByAgent(personnelProps.personnel.id)" v-if="personnelProps"/>
        </PersonnelList>
      </AppMenu>

			<AppMenu v-else-if="listMode === 'statistiques'">
				<FormStatistiques />
			</AppMenu>

			<AppMenu v-else-if="listMode === 'echeancier'">
				<FilterFormEcheancier />
			</AppMenu>

			<AppMenu v-else-if="listMode === 'home'">
				<form-stats />
			</AppMenu>

		</template>

		<template v-slot:core v-if="isConnectedUser">
			<div class="bg-light">
				<router-view />
			</div>
		</template>
	</AppWrapper>
</template>

<style lang="scss">
.fs-7 {
	font-size: 0.80rem !important;
}

.progress-ht {
	height: 25px !important;
}
</style>

<script>

import AppWrapper from '@/components/pebble-ui/AppWrapper.vue'
import AppMenu from '@/components/pebble-ui/AppMenu.vue'
import AppMenuItem from '@/components/pebble-ui/AppMenuItem.vue'
import { mapActions, mapState } from 'vuex'
import CONFIG from "@/config.json"
import FormStats from './components/FormStats.vue'
import FilterFormEcheancier from './components/echeancier/FilterForm.vue'
import CollecteItem from './components/CollecteItem.vue'
import FormulaireItem from './components/menu/FormulaireItem.vue';
import ProjectItemDone from './components/menu/ProjectItemDone.vue';
import CollecteItemDone from './components/menu/CollecteItemDone.vue';
import FormStatistiques from './components/FormStatistiques.vue'

import StatsHeader from './components/headers/StatsHeader.vue'
import ProgrammationHeader from './components/headers/ProgrammationHeader.vue'
import ControleHeader from './components/headers/ControleHeader.vue'
import Spinner from './components/pebble-ui/Spinner.vue'
import AlertMessage from './components/pebble-ui/AlertMessage.vue'
import SearchControl from './components/SearchControl.vue'
import { searchConsultation } from './js/search-consultation'
import { AssetsCollection } from './js/app/services/AssetsCollection'
import { ROUTES_NAMES } from './js/route';
import HabilitationList from './components/habilitation/List.vue';
import PersonnelList from "@/components/PersonnelList.vue";
import FicheIndividuelleSuiviItem from "@/components/List/FicheIndividuelleSuiviItem.vue";

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
				search: true,
				actifs: true,
				loadMore: false,
				habilitations: true,
				stats: true,
				personnel: false
			},
			isConnectedUser: false,
			searchOptions: {
				dd: null,
				df: null,
				mode: 'collecte',
				locked: true,
				start: 0,
				limit: 50,
			},
			options: {
				mode: 'default'
			},
			characteristicPersonnelStats: [],
		}
	},

	computed: {
		...mapState(['openedElement', 'collectes', 'formulaires', 'listActifs', 'projets', 'searchResults', 'veilleConfig']),

		/**
		 * Détermine quelle liste afficher :
		 * collecte, programmation
		 *
		 * @return {string}
		 */
		listMode() {
			return this.getRouteGroupName(this.$route.name);
		},

		/**
		 * Contrôle si il peut exister plus de résultats sur le serveurs que
		 * de données stockées dans résults.
		 *
		 * On concidère qu'il peut exister des résultats supplémentaires sur le serveur
		 * à partir du moment ou il y a plus de 50 items dans result et que result / 50 est
		 * égal à 1.
		 *
		 * @return {bool}
		 */
		isMoreAvailable() {
			let ln = this.searchResults.length;
			return (ln && ln % this.searchOptions.limit === 0 && !this.noMoreAvailable);
		},

		/**
		 * Retourne les items du menu depuis la configuration
		 *
		 * @return {array}
		 */
		appMenu() {
			return this.cfg.appMenu;
		},

		/**
		 * Filtre la liste actif du personnel de tte les structure pour retourner que le personnel actif de la structure currente
		 *
		 * @return {array}
		 */
		personnelsActifsInCurrentStructure() {
			let found = [];

			if (this.listActifs) {
				found = this.listActifs.filter(e => e.structure == this.$app.active_structure_id);
			}

			return found;
		}
	},

	watch: {
		$route() {
			this.$app.dispatchEvent('menuChanged', 'list');
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
					else if (val == 'consultation') {
						this.loadConsultations();
					}
				}
			}
		}
	},

	methods: {
		...mapActions(['refreshVeilleConfig', 'refreshFormulaires', 'refreshCollectes', 'refreshListActifs', 'refreshProjets', 'setCollectes', 'setSearchResults', 'addSearchResults', 'refreshHabilitationType']),

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
			return this.loadRessources('collecte', { enqueteur_login: 'self', locked: 0 });
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
			let query = { 'in_production': true }

			this.$app.apiGet(route, query)
				.then((data) => {
					this.refreshProjets(data);
				}).catch(this.$app.catchError).finally(() => this.pending.projets = false);
		},

		/**
		 * charge la liste des habilitations type depuis le serveur et les charge dans le store
		 */
		loadHabilitationType() {
			this.pending.habilitations = true;
			this.$app.apiGet('v2/controle/habilitation/type')
			.then((data) => {
				this.refreshHabilitationType(data);
			}).catch(this.$app.catchError).finally(() => this.pending.habilitations = false);
		},

		loadHabilitation() {
			let collection = new AssetsCollection(this, {
				assetName: 'habilitationsCharacteristic',
				apiRoute: 'v2/characteristic'
			});
			this.$assets.addCollection('habilitationsCharacteristic', collection);
		},

		/** charge l'ensemble des veilles paramétrées
		 *
		 */
		loadVeille() {
			this.pending.habilitations = true;

			this.$app.apiGet('v2/controle/veille')
				.then((data) => {
					this.refreshVeilleConfig(data);
				}).catch(this.$app.catchError).finally(() => this.pending.habilitations = false);
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
			let route = 'data/GET/' + ressourceName;
			let pending = ressourceName + 's';
			let refreshMethod = 'refresh' + ressourceName.charAt(0).toUpperCase() + ressourceName.slice(1) + 's';
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
				}).catch(this.$app.catchError).finally(() => this.pending[pending] = false);
		},

		/**
		 * Charge le personnel actifs
		 */
		loadAgent() {
			this.pending.actifs = true;
			this.$app.apiGet('structurePersonnel/GET/list', {
				actif: true,
				futur: true,
				structure: "toutes",
				limit: "aucune"
			}).then((data) => {
				this.refreshListActifs(data);
			}).catch(this.$app.catchError).finally(this.pending.actifs = false);
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
		},

		/**boucle dans la collection de formulaire pour voir s'il existe un nb.todo!=0
		 * si tous sont nuls, retourne false
		 *
		 * @param	{array}	le tableau à parcourir
		 */
		exist(val) {
			let liste = val;
			let compteur = 0

			for (let form of liste) {
				let result = form.nb_todo;
				if (result === 0) {
					compteur += 0
				}
				else compteur += 1;
			}
			if (compteur > 0) {
				return true;
			} else {
				return false;
			}

		},

		/**
		 * Lance une recherche sur les consultations et les stock dans le store sur la collection des résultats de recherche.
		 *
		 * @param	{string}	mode 'set' par défaut: enregistre le retour de l'api et 'append' ajoute le retour de l'api aux résultats deja enregistrés
		 */
		loadConsultations(mode) {

			mode = typeof mode === 'undefined' ? 'set' : mode;

			if (mode === 'append') {
				this.pending.loadMore = true;
			}
			else {
				this.pending.search = true;
			}

			searchConsultation(this.searchOptions, this.$app).then(data => {
				if (this.searchOptions.mode == 'collecte') {
					if (mode == 'append') {
						if (!data.length) {
							this.noMoreAvailable = true;
						} else {
							this.addSearchResults(data);
						}
					}
					else {
						this.noMoreAvailable = false;
						this.searchOptions.start = 0;
						this.setSearchResults(data);
					}
				}

				if (mode !== 'append') {
					this.routeToVue(this.searchOptions.mode);
				}
			}).catch(this.$app.catchError).finally(() => {
				this.pending.search = false;
				this.pending.loadMore = false;
			});
		},

		/**
		 * Charge la suite des données lorsque le nombre de résultats est > à 50
		 * et divisible par 50 en nombre entier.
		 */
		loadMore() {
			if (this.isMoreAvailable) {
				this.searchOptions.start += this.searchOptions.limit;
				this.loadConsultations('append');
			}
		},

		/**
		 * Affiche la liste des contrôles programmés avec le formulaire
		 *
		 * @param {object} collecte
		 */
		routeToVue(mode) {
			let route = mode === 'collecte' ? '/consultation' : '/consultation/' + mode;
			this.$router.push(route);
		},

		/**
		 * Retourne le nom du groupe auquel appartient la route à analyser.
		 *
		 * @param {string} routeName Nom de la route à analyser
		 *
		 * @return {string}
		 */
		getRouteGroupName(routeName) {
			for (const groupName in ROUTES_NAMES) {
				const names = ROUTES_NAMES[groupName];

				if (names.includes(routeName)) {
					return groupName;
				}
			}
			return null;
		},

		/**
		 * Initialise l'ensemble des collections disponibles dans l'application
		 */
		initCollections() {
			const collections = [
				{
					name: "habilitationsTypes",
					assetName: "habilitationsTypes",
					apiRoute: "v2/controle/habilitation/type"
				},
				{
					name: "personnels",
					assetName: 'personnels',
					apiRoute: 'v2/personnel'
				},
				{
					name: "collectesCollection",
					assetName: "collectesCollection",
					apiRoute: "v2/collecte"
				},
				{
					name: "habilitationsPersonnels",
					assetName: "habilitationsPersonnels",
					apiRoute: "v2/characteristic/personnel"
				},
        {
          name: "personnelsFiltered",
          assetName: "personnelsFiltered",
          apiRoute: "v2/personnel",
          requestPayload: {
              contratDdFilter: this.contratDdFilter,
              contratDfFilter: this.contratDfFilter,
              withContratFilter: this.withContratFilter,
              withoutContratFilter: this.withoutContratFilter,
              ordre: this.ordre
          }
        }
			];

			collections.forEach((c) => {
				try {
					const collection = this.$assets.getCollection(c.name);
					collection.reset();
				} catch {
					const collection = new AssetsCollection(this, c);
					this.$assets.addCollection(c.name, collection);
				}
			});
		},


    /**
     * Retourn les states du personnel qui correspond a l'agent fournis en parametre
     *
     * @param {integer} personnelId l'id du personnel
     *
     * @return {array}
     */
    getStatsByAgent(personnelId) {
      let statsByAgent = this.characteristicPersonnelStats.find(e => e.personnel_id == personnelId);
      return statsByAgent;
    },

    /**
     * Charge les states de characteristic personnel par personnel
     */
    loadCharacteristicPersonnelStats() {
      this.pending.stats = true;

      this.$app.apiGet('v2/characteristicPersonnel/stats')
          .then((data) => {
            this.characteristicPersonnelStats = data;
          })
          .catch(this.$app.catchError)
          .finally(this.pending.stats = false);
    },

  },

	components: {
    FicheIndividuelleSuiviItem, PersonnelList, AppWrapper, AppMenu, AppMenuItem, FormStats, FilterFormEcheancier, CollecteItem, AlertMessage, StatsHeader, ProgrammationHeader, FormulaireItem, ControleHeader, Spinner, SearchControl, CollecteItemDone, ProjectItemDone, FormStatistiques, HabilitationList},

	mounted() {
		this.$app.addEventListener('structureChanged', () => {
			this.$router.push('/programmation');
			if (this.isConnectedUser) {
				this.loadFormulaires();
				this.loadAgent();
				this.loadProjets();
				this.loadHabilitationType();
				this.loadHabilitation();
				this.loadVeille();
        this.loadCharacteristicPersonnelStats();
				this.initCollections();

			}
		});
	}
}
</script>
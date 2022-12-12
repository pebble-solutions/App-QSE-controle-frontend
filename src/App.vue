<template>

	<AppWrapper
		:cfg="cfg"
		:cfg-menu="cfgMenu"
		:cfg-slots="cfgSlots"
		
		@auth-change="setLocal_user">

		<template v-slot:header>
			<div class="mx-2 d-flex align-items-center" v-if="openedElement">
				<router-link to="/" custom v-slot="{ navigate, href }">
					<a class="btn btn-dark me-2" :href="href" @click="navigate">
						<i class="bi bi-arrow-left"></i>
					</a>
				</router-link>
				<router-link :to="'/formulaire/'+openedElement.id+'/properties'" custom v-slot="{ navigate, href }">
					<a class="btn btn-dark me-2" :href="href" @click="navigate">
						<i class="bi bi-file-earmark me-1"></i>
						{{openedElement.groupe}}
					</a>
				</router-link>

				<div class="dropdown">
					<button class="btn btn-dark dropdown-toggle" type="button" id="fileDdMenu" data-bs-toggle="dropdown" aria-expanded="false">
						Fichier
					</button>
					<ul class="dropdown-menu" aria-labelledby="fileDdMenu">
						<li>
							<router-link :to="'/formulaire/'+openedElement.id+'/informations'" custom v-slot="{ navigate, href }">
								<a class="dropdown-item" :href="href" @click="navigate">Informations</a>
							</router-link>
						</li>
							<li>
							<button class="droptown-item" @click="chargerType(openedElement.type_id)">Charger le type</button>
						</li>
					</ul>
				</div>
			</div>
		</template>


		<template v-slot:menu>
			<AppMenu>
				<AppMenuItem href="/" look="dark" icon="bi bi-house">KN suivi</AppMenuItem>
				<AppMenuItem href="/programmation" look="dark" icon="bi bi-house">KN programmation</AppMenuItem>
				<AppMenuItem href="/collecte" look="dark" icon="bi bi-app">KN collecte</AppMenuItem>
			</AppMenu>
		</template>

		<template v-slot:list>
				<AppMenu v-if="($route.name == 'collecte' && collectes || $route.name == 'collecteKN' && collectes || $route.name == 'collecteKnBloc' && collectes) ">
					<!-- || $route.path == 'collecte'+coll.id -->
					<AppMenuItem :href="'/collecte/'+col.id" v-for="col in collectes" :key="col.id" >
						<div class="d-flex align-items-center justify-content-between">
							Kn n° {{col.date.substr(0,4)}}-{{col.id}}
							<span class="badge text-bg-secondary">{{getGroupNameFromId(col.information__groupe_id)}}</span>
						</div>

						<div>
							<i class="bi bi-person-badge-fill"></i>
							{{getPersonnelNameFromId(col.cible__structure__personnel_id)}}
						</div>

						<div>
							<i class="bi bi-boxes"></i>
							{{getProjetName(col.projet_id)}}
						</div>
					</AppMenuItem>
				</AppMenu>
				<AppMenu v-else>
					<AppMenuItem :href="'/formulaire/'+form.id" icon="bi bi-file-earmark" v-for="form in formulaires" :key="form.id">{{form.id}} {{form.groupe}}</AppMenuItem>
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
		...mapState(['openedElement','collectes','formulaires', 'listActifs', 'projetsActif'])
	},

	methods: {
		...mapActions(['refreshCollectes', 'refreshFormulaires', 'refreshListActifs', 'refreshProjetsActifs']),

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
			return this.loadRessources('collecte');
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
		 * @param {string} ressourceName Le nom de la ressource à charger dans le store ('collecte', 'formulaire')
		 * 
		 * @return {Promise<object>}
		 */
		loadRessources(ressourceName) {
			let route = 'data/GET/'+ressourceName;
			let pending = ressourceName+'s';
			let refreshMethod = 'refresh'+ressourceName.charAt(0).toUpperCase() + ressourceName.slice(1)+'s';

			this.pending[pending] = true;

			return this.$app.apiGet(route)
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
                actif:true
            })
                .then((data) => {
                    this.refreshListActifs(data);
                })
                .catch(this.$app.catchError)
                .finally(this.pending.loadAgent = false);
        },

		/**
		 * Récupere le nom du groupe d'information de la collect via un id de
		 * 
		 * @param {number} groupInformationId l'id du group information de la collecte
		 * 
		 * @return {string}
		 */
		getGroupNameFromId(groupInformationId) {
			let groupInformation = this.formulaires.find(e => e.id == groupInformationId);

			if (groupInformation) {
				return groupInformation.groupe;
			} else { 
				return 'group inexistant';
			}
		},

		/**
		 * Récupère le nom d'un personnel actif via un id
		 * 
		 * @param {number} personnelId l'id d'un personnel actif
		 * 
		 * @return {string}
		 */
		getPersonnelNameFromId(personnelId) {
			let personnelName = this.listActifs.find(personnel => personnel.id == personnelId);

			if (personnelName) {
				return personnelName.cache_nom;
			} else {
				return 'Personnel inexsitant'
			}
		},

		/**
		 * Récupère le nom du projet de la collecte
		 * 
		 * @param {number} projetId l'id du projet de la collecte
		 * 
		 * @return {string}
		 */
		getProjetName(projetId) {
			let projetName = this.projetsActif.find(projet => projet.id == projetId);

			if (projetName) {
				return projetName.intitule;
			} else {
				return 'projet inexsitant'
			}
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

	components: {AppWrapper, AppMenu, AppMenuItem},

	mounted() {
		this.$app.addEventListener('structureChanged', () => {
			this.$router.push('/');
			if (this.isConnectedUser) {
				this.loadCollectes();
				this.loadFormulaires();
				this.loadAgent();
				this.getAllProjetsActif();
			}
		});
	}

}
</script>
<template>

    <div>
        <!-- <div class="card">
            
            <div>
                <router-link :to="{name:'CollectNew'}" v-slot="{navigate,href}" custom>
                    <a :href="href" @click="navigate" class="btn btn-light">Programmer un nouveau KN<i class="bi bi-pencil mx-2"></i></a>
                </router-link>
            </div>
            
        </div> -->
        <div class="d-flex flex-row justify-content-between align-items-center">
            <h1 >KN programmés</h1> 
            <div>
                <router-link :to="{name:'CollectNew'}" v-slot="{navigate,href}" custom>
                    <a :href="href" @click="navigate" class="btn btn-outline-primary">Programmer un nouveau KN<i class="bi bi-pencil mx-2"></i></a>
                </router-link>
            </div>

        </div>
        <div v-for="col in collectes" :key=col.id class="list-group">
            <div class="list-group-item my-1">
                <div class="d-flex flex-row justify-content-between">
                    <div>
                        <span class="me-2">KN n°{{col.id}}</span>
                        <span  v-if="!getGroupNameFromId(col.information__groupe_id)" class="me-2 text-warning">Type de KN non programmé </span>
                        <span v-else class="me-2">{{getGroupNameFromId(col.information__groupe_id)}}</span>
                        <span class="me-2" v-if="!col.date">Date non programmée</span>
                        <span v-else class="me-2 text-warning">{{col.date}}</span>
                        <span  v-if="!getPersonnelNameFromId(col.enqueteur__structure__personnel_id)" class="me-2 text-warning">Contrôleur non programmé </span>
                        <span v-else class="me-2">Contrôleur: {{getPersonnelNameFromId(col.enqueteur__structure__personnel_id)}}</span>
                        <span  v-if="!getPersonnelNameFromId(col.cible__structure__personnel_id)" class="me-2 text-warning">Opérateur non programmé </span>
                        <span v-else class="me-2">Opérateur: {{getPersonnelNameFromId(col.cible__structure__personnel_id)}}</span>
                    </div>
                    <div>
                        
                    </div>
                    <div class="btn-group">
                        
                        <div>
                            <router-link :to="{name:'CollectEdit', params:{id:col.id}}" v-slot="{navigate,href}" custom>
                                <a :href="href" @click="navigate" class="btn btn-light"><i class="bi bi-pencil mx-2"></i></a>
                            </router-link>
                        </div>
                        <!-- <i class="bi bi-trash mx-2"></i> -->
                    </div>
                </div>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>

import { mapActions, mapState } from 'vuex';

export default {
    data() {
        return {
            newKn: false,

            pending: {
                loadForm: true,
                loadAgent: true
            },
        }
    },
    computed: {
        ...mapState(["openedElement", "formulaires", "listActifs", "collectes"])
    },

    methods: {
        ...mapActions(['refreshCollectes']),
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
            }
            else { 
                return null ;
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

			return this.$app.apiGet(route, {limit:'aucune'})
				.then(data => {
					this[refreshMethod](data);
					return data;
				})
				.catch(this.$app.catchError)
				.finally(() => this.pending[pending] = false)
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
                return null
            }
        },
        updateKn(){
            this.newKn = false;
        },
        modifKn(){
            
        }
    },

    mounted() {
        this.loadCollectes();

    },
	
}
</script>
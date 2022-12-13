<template>

    <div v-if="formulaire">
        <div class="d-flex flex-row justify-content-between align-items-center py-3">
            <div class="d-flex flex-row justify-content-between align-items-center">

                <router-link to="/programmation" v-slot="{navigate,href}" custom>
                    <a :href="href" @click="navigate" class="btn btn-light"><i class="bi bi-arrow-left"></i></a>
                </router-link>
                <div class="ms-2">
                    <h1 class="fs-3 m-0">{{formulaire.groupe}}</h1> 
                    <div class="text-secondary">{{collectes_number_label}}</div>
                </div>
            </div>
            <div>
                <router-link :to="'/programmation/'+formulaire.id+'/0/edit'" v-slot="{navigate,href}" custom>
                    <a :href="href" @click="navigate" class="btn btn-primary">
                        <i class="bi bi-plus"></i> Programmer un KN
                    </a>
                </router-link>
            </div>
        </div>

        <div class="list-group">
            <div v-for="col in collectes" :key=col.id class="list-group-item">
                <div class="d-flex flex-row justify-content-between align-items-center">
                    <div class="d-flex align-items-center">

                        <strong class="me-2 text-secondary" style="width:40px">#{{col.id}}</strong>
                        <div>
                            <span  v-if="!getGroupNameFromId(col.information__groupe_id)" class="me-2 text-warning">Type de KN non programmé </span>
                            <span v-else class="me-2">{{getGroupNameFromId(col.information__groupe_id)}}</span>
                            <span class="me-2 text-warning" v-if="!col.date">Date non programmée</span>
                            <span v-else class="me-2">{{changeFormatDateLit(col.date)}}</span>
                            <span  v-if="!getPersonnelNameFromId(col.enqueteur__structure__personnel_id)" class="me-2 text-warning">Contrôleur non programmé </span>
                            <span v-else class="me-2">Contrôleur: {{getPersonnelNameFromId(col.enqueteur__structure__personnel_id)}}</span>
                            <span  v-if="!getPersonnelNameFromId(col.cible__structure__personnel_id)" class="me-2 text-warning">Opérateur non programmé </span>
                            <span v-else class="me-2">Opérateur: {{getPersonnelNameFromId(col.cible__structure__personnel_id)}}</span>
                            <!-- <span  v-if="!getPersonnelNameFromId(col.cible__structure__personnel_id)" class="me-2 text-warning">Opérateur non programmé </span>
                            <span v-else class="me-2">Opérateur: {{getPersonnelNameFromId(col.cible__structure__personnel_id)}}</span> -->
                        </div>
                    </div>
                    <div class="btn-group">
                        <router-link :to="{name:'EditCollecte', params: {idCollecte:col.id} }" v-slot="{navigate,href}" custom>
                            <a :href="href" @click="navigate" class="btn btn-light"><i class="bi bi-pencil"></i></a>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>

        <router-view></router-view>
        
    </div>
</template>

<script>

import { mapActions, mapState } from 'vuex';
import date from 'date-and-time';
import fr from 'date-and-time/locale/fr';

export default {
    data() {
        return {
            newKn: false,

            pending: {
                collectes: true
            },
        }
    },
    computed: {
        ...mapState(["formulaire", "formulaires", "listActifs", "collectes"]),

        /**
         * Retourne le libellé du nombre de requêtes programmées en fonction le la liste collectes
         * 
         * @return {string}
         */
        collectes_number_label() {
            let count = this.collectes.length;
            if (count) {
                let s = count > 1 ? "s" : "";
                let label = `${count} collecte${s} programmée${s}`;
                return label;
            }
            return "Aucune collecte programmée";
        }
    },

    methods: {
        ...mapActions(['setCollectes', 'openFormulaire']),

        /**
         * retourne à la route précédente
         */
        routeToParent() {
            this.$router.go(-1);
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
            }
            else { 
                return null ;
            }
        },
        /**
		 * Charge les collectes depuis le serveur et les stock dans le store
		 * 
         * @param {number} information__groupe_id   id du formulaire pour restreindre la recherche
         * 
		 * @return {Promise<object>}
		 */
		loadCollectes(information__groupe_id) {
            this.pending.collectes = true;
            return this.$app.apiGet('data/GET/collecte', {limite: 'aucune', done: 'NON', information__groupe_id})
				.then(data => {
					this.setCollectes(data);
					return data;
				})
				.catch(this.$app.catchError)
				.finally(() => this.pending.collectes = false);
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
            
        },
        /**
		 * Modifie le format de la date entrée en paramètre et la retourne 
		 * sous le format 01 févr. 2021
		 * @param {string} date 
		 */

		changeFormatDateLit(el) {
			date.locale(fr);
			return date.format(new Date(el), 'DD MMM YYYY')
		}
    },
    beforeRouteUpdate(to) {
        if (this.formulaire?.id != to.params.id) {
            this.openFormulaire(to.params.id);
            this.loadCollectes(to.params.id);
        }
    },

    mounted() {
        this.openFormulaire(this.$route.params.id);
        this.loadCollectes(this.$route.params.id);
    },
	
}
</script>
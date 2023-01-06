<template>
    <div v-if="pending.collectes">
        <Spinner></Spinner>
    </div>

    <div v-if="formulaire" class="container py-2">
        <div class="d-flex flex-row justify-content-between align-items-center py-3">
            <div class="d-flex flex-row flex-wrap justify-content-between align-items-center">
                <h1 class="fs-3 m-0 me-2">{{formulaire.groupe}}</h1> 
                <div class="text-secondary">{{collectes_number_label}}</div>
            </div>
            <div>
                <router-link :to="'/programmation/'+formulaire.id+'/0/edit'" v-slot="{navigate,href}" custom>
                    <a :href="href" @click="navigate" class="btn btn-primary">
                        <i class="bi bi-plus"></i> Programmer un contrôle
                    </a>
                </router-link>
            </div>
        </div>

        <div class="list-group" v-if="collectes">
            <div v-for="col in collectes" :key=col.id class="list-group-item" @click="editCollecte(col.id)" type="button">
                <collecte-headband :collecte="col" :personnels="listActifs"/>
            </div>
        </div>

        <router-view></router-view>
        
    </div>
</template>

<script>

import { mapActions, mapState } from 'vuex';
import CollecteHeadband from '../components/CollecteHeadband.vue';
import Spinner from '@/components/pebble-ui/Spinner.vue';

export default {
    components: { CollecteHeadband, Spinner },

    data() {
        return {
            newKn: false,

            pending: {
                collectes: true,
                formulaire: true
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
            return "Aucun contrôle programmé";
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
         * ouvre une modal pour éditer la collecte
         * @param {number} collecteId 
         */
        editCollecte(collecteId) {
            this.$router.push({name: 'EditCollecte', params: {idCollecte: collecteId}});
        },
    
        updateKn(){
            this.newKn = false;
        },
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
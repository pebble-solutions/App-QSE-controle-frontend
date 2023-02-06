<template>
    <div class="d-flex flex-wrap justify-content-start align-items-center my-4">
        <h1 class="fs-3 m-0 me-2">{{ getProjectNameFromId }}</h1> 
        <div class="badge bg-secondary">{{filterCollecte.length}}</div>
    </div>

    <div class="list-group" v-if="filterCollecte">
        <div v-for="col in filterCollecte" :key=col.id class="list-group-item" @click="seeCollecte(col.id)" type="button">
            <collecte-headband :collecte="col" :personnels="listActifs" :editable="false"/>
        </div>
    </div>  
        
        
        <router-view></router-view>
    
</template>
<script>

import { mapActions, mapState } from 'vuex'
import CollecteHeadband from '../components/CollecteHeadband.vue';
export default {

    components:{CollecteHeadband},

    computed: {
        ...mapState(['formulaire','formulaires', 'listActifs', 'collectes', 'projets']),
        /**
         * filtre les collectes en fonction de l'id du projet concerné
         * et retourne les contrôles réalisés correspondants
         */

        filterCollecte() {
            let collectes = this.collectes.filter((collecte)=> collecte.projet_id == this.$route.params.idProjet);
            return collectes;
        },

        /**
         * Récupere le nom du groupe d'information de la collect via un id de
         * 
         * @param {number} groupInformationId l'id du group information de la collecte
         * 
         * @return {string}
         */

        getProjectNameFromId() {
            let projectInfo = this.projets.find(e => e.id == this.$route.params.idProjet);
    
            if (projectInfo) {
                return projectInfo.intitule;
            }
            else { 
                return null ;
            }
        },		


    },
    methods: {
        ...mapActions(['setCollectes', 'openFormulaire']),

        /**
         * ouvre la collecte dans la vue principale pour consultation
         * @param {number} collecteId 
         */
        seeCollecte(id) {
            this.$router.push({name: 'consultationControl', params: {idCollecte: id}});
        },

    }


}

</script>


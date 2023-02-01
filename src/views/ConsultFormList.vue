<template>
    <div class="d-flex flex-row flex-wrap justify-content-between align-items-center">
        <h1 class="fs-3 m-0 me-2">
            {{ getGroupNameFromId }}
        </h1> 
        <div class="text-secondary">{{filterCollecte.length}}</div>

    </div>
    
    <div class="list-group" v-if="filterCollecte">
        <div v-for="col in filterCollecte" :key=col.id class="list-group-item" @click="editCollecte(col.id)" type="button">
                <collecte-headband :collecte="col" :personnels="listActifs"/>
        </div>
    </div>  
    
        <router-view></router-view>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import CollecteHeadband from '../components/CollecteHeadband.vue';
export default{
    components:{CollecteHeadband},

    data() {
        return {

            pending: {
                collectes: true,
                formulaire : true,
            },
        }
    },
    computed: {
        ...mapState(['formulaire','formulaires', 'listActifs', 'collectes']),

        /**
         * filtre les collectes en fonction de l'id du formulaire concerné
         * et retourne les contrôles réaliséss concernés
         */

        filterCollecte() {
            let collectes = this.collectes.filter((collecte)=> collecte.information__groupe_id == this.$route.params.idFormulaire);
            return collectes;
        },
        /**
         * Récupere le nom du groupe d'information de la collect via un id de
         * 
         * @param {number} groupInformationId l'id du group information de la collecte
         * 
         * @return {string}
         */

        getGroupNameFromId() {
            let groupInformation = this.formulaires.find(e => e.id == this.$route.params.idFormulaire);
    
            if (groupInformation) {
                return groupInformation.groupe;
            }
            else { 
                return null ;
            }
        },		
    },
    methods: {
        ...mapActions(['setCollectes', 'openFormulaire']),

        /**
         * ouvre une modal pour éditer la collecte
         * @param {number} collecteId 
         */
        editCollecte() {
            // this.$router.push({name: 'Consultationcontrol', params: {idCollecte: id}});
        },
    },
    
}
</script>








<template>
    <div class="container py-2 px-0">
        <!-- <spinner v-if="pending.collecte" /> -->
        <template>
            <app-modal size="lg">
                <consultation-collecte-resume :collecte="collecte" :readonly="true" v-if="collecte"></consultation-collecte-resume>


            </app-modal>
            
            <router-view></router-view>
        </template>
    </div>
    
</template>
<script>

import {mapState, mapActions} from 'vuex'; 
import AppModal from '../components/pebble-ui/AppModal.vue';

import ConsultationCollecteResume from '../components/ConsultationCollecteResume.vue';
// import Spinner from '../components/pebble-ui/Spinner.vue';

export default {
    components:{ConsultationCollecteResume,AppModal}, 

    data() {
        return {
            pending: {
                collecte: false
            },
        }
    },

    computed: {
        ...mapState(['collectes','collecte']),


        /**
         * filtre les collectes en fonction de l'id de la collecte concernée
         * et retourne les contrôle  correspondant
         */

        // filterCollecte() {
        //     let collecteid = this.collectes.filter((collecte)=> collecte.id == this.$route.params.idCollecte);
        //     return collecteid;
        // },
    },
    methods: {
        ...mapActions(["setCollecte", "resetResponses"]),


        
    },
    

    
}

</script>
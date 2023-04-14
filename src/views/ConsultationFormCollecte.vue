<template>
    <div>
        
        <app-modal
            size="lg"
            @modal-hide="routeToParent()"
            >
            <ConsultationCollecteResume :collecte="collecte" :readonly="true" :route="nameRoute" ></ConsultationCollecteResume>
        </app-modal>
    </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'; //

import AppModal from '../components/pebble-ui/AppModal.vue';
import ConsultationCollecteResume from '../components/ConsultationCollecteResume.vue';
export default {
    components:{AppModal,ConsultationCollecteResume}, //

    computed:{
        ...mapState(['collectes','collecte']),

        nameRoute() {
            if(this.$route.name == 'consultationFormCollecte' ){
                console.log(this.$route.name, 'routename');
               return 'consultation/formulaire/'+this.$route.params.idFormulaire;
            }
            return 'consultation';
        }
    },
    data() {
        return {
            route: '',
        }
    },

   

    
    methods: {
        ...mapActions(["setCollecte", "resetResponses"]),


        /**
         * Charge une collecte depuis le serveur dans le store.
         * 
         * @param {number} id L'ID de la collecte à charger
         */
        loadCollecte(id) {
            // this.pending.collecte = true;
            this.$app.apiGet('data/GET/collecte/'+id, {
                environnement: 'private'
            })
            .then((data) => {
                this.setCollecte(data);
            }).catch(this.$app.catchError);
        },
        /**
         * Retourne à la vue précédente
         */
        routeToParent() {
            this.$router.go(-1);
        }
    
    },

    /**
     * Lorsque la route interne est mise à jour, le nouvel élément doit être chargé.
     */
    beforeRouteUpdate(to) {
        console.log(to,'to');
        if (to.params.idCollecte != this.collecte?.id) {
            // this.resetResponses();
            this.loadCollecte(to.params.idCollecte);
        }
    },

    /**
     * Lorsque l'élément est monté, on va lire l'élément à charger passé en paramètre.
     */
    beforeMount() {
        /**
         * Ici on va charger l'élément ouvert afin de le stocker dans le store
         */
        // this.resetResponses();
        this.loadCollecte(this.$route.params.idCollecte);
        
    }
}
</script>
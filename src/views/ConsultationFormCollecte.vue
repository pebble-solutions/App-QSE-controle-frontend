<template>
    <div>
        
        <app-modal
            size="lg"
            @modal-hide="routeToParent()"
            >
            <CollecteResume :collecte="collecte" :toolbar="['export']" :levelUser="login.type" :readonly="true" :route="nameRoute" ></CollecteResume>
        </app-modal>
    </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'; //

import AppModal from '../components/pebble-ui/AppModal.vue';
import CollecteResume from '../components/collecte/Resume.vue';
export default {
    components:{AppModal,CollecteResume}, //

    computed:{
        ...mapState(['collectes','collecte', 'login']),

        nameRoute() {
            if(this.$route.name == 'consultationFormCollecte' ) {
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
            this.$router.push({name: 'consultationFormList'}, {params:this.$route.params.idFormulaire});

        }
    
    },

    /**
     * Lorsque la route interne est mise à jour, le nouvel élément doit être chargé.
     */
    beforeRouteUpdate(to) {
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
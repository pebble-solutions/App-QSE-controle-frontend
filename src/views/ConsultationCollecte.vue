<template>
    <div class="container py-2 px-0">
        <consultation-collecte-resume :collecte="collecte" :readonly="true" v-if="collecte"></consultation-collecte-resume>
        <router-view></router-view>
    </div>
    

</template>

<script>

import {mapState, mapActions} from 'vuex'; 

import ConsultationCollecteResume from '../components/ConsultationCollecteResume.vue';

export default {
    components:{ConsultationCollecteResume}, 

    computed: {
        ...mapState(['collectes','collecte']),

        data() {
            return {
                pending: {
                    collecte: true
                },
            }
        },

        /**
         * filtre les collectes en fonction de l'id de la collecte concernée
         * et retourne les contrôle  correspondant
         */

        filterCollecte() {
            let collecteid = this.collectes.filter((collecte)=> collecte.id == this.$route.params.idCollecte);
            return collecteid;
        },
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
    },
    /**
     * Lorsque la route interne est mise à jour, le nouvel élément doit être chargé.
     */
    beforeRouteUpdate(to) {
        if (to.params.idCollecte != this.collecte?.idCollecte) {
            this.resetResponses();
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
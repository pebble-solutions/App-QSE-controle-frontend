<template>
    <AppModal
     v-if="collecte"
     size="lg"
     @modal-hide="routeToParent()"
     :pending="pending.collecte">
        <ConsultationCollecteResume :collecte="collecte"></ConsultationCollecteResume>
    </AppModal>
    
</template>
<script>
import ConsultationCollecteResume from '../components/ConsultationCollecteResume.vue';
import AppModal from '../components/pebble-ui/AppModal.vue';

export default {
    components: { AppModal, ConsultationCollecteResume },

    data() {
        return {
            pending: {
                collecte: false
            },
            collecte:''
        }
    },

    methods: {
        /**
         * envoie une requête API pour charger la collecte
         * 
         * @param   {number}    id  id de la collecte à charger
         */

        loadCollecte(id) {
            this.pending.collecte = true;

            this.$app.apiGet('data/GET/collecte/'+id, {
                environnement: 'private',
                afficher_corbeille: 'aussi'
            })
            .then((data) => {
                console.log(data)
                this.collecte = data
                // this.setCollecte(data);
            }).catch(this.$app.catchError).finally(() => this.pending.collecte = false);
        },

        /**
         * Retourne à la vue précédente
         */
         routeToParent() {
            this.$router.go(-1);
        }
    },

    beforeMount() {
        /**
         * charge la collecte 
         */
        this.loadCollecte(this.$route.params.idCollecte)
    }
}
</script>
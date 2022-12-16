<template>
    <app-modal
        v-if="collecte"
        :title="('Kn n°'+collecte.id)"
        size="lg"
        @modal-hide="backPreviousRoute()">
        <div v-if="pending.collecte">Chargement...</div>
        <consultation-collecte-resume 
            :collecte="collecte"
            v-if="collecte" />
    </app-modal>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ConsultationCollecteResume from '../components/ConsultationCollecteResume.vue'
import AppModal from '../components/pebble-ui/AppModal.vue'

export default {

    data() {
        return {
            pending: {
                collecte: true
            },
        }
    },

    components: {AppModal, ConsultationCollecteResume},

    computed: {
        ...mapState(['collecte'])
    },

    methods: {
        ...mapActions(['setCollecte']),

        /**
         * Put back the url route before the modal route
         */
        backPreviousRoute() {
            this.$router.push({name:"consultationFormulaire", params: {id: this.$route.params.id}});
        },

        /**
         * Charge une collecte depuis le serveur dans le store.
         * 
         * @param {number} id L'ID de la collecte à charger
         */
        loadCollecte(id) {
            this.pending.collecte = true;
            this.$app.apiGet('data/GET/collecte/'+id, {
                environnement: 'private'
            })
            .then((data) => {
                this.setCollecte(data);
            }).catch(this.$app.catchError).finally(() => this.pending.collecte = false);
        },
    },

    mounted() {
        this.loadCollecte(this.$route.params.idCollecte);
    }

}

</script>
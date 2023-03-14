<template>

    <div class="container py-3">
        <template v-if="!pending.collecte">
            <template v-if="collecte">

                <CollecteTitle :collecte="collecte" @projet-change="projetChange" />

                <template v-if="collecte.done == 'OUI'">
                    <div class="my-2">
                        <alert-message icon="bi-check-circle" variant="success">Ce contrôle est terminé</alert-message>
                    </div>
                    <consultation-collecte-resume :collecte="collecte" :readonly="true"/>
                </template>
        
                <template v-else>
                    <div class="card mt-3" v-if="(!$route.params.bloc && $route.name != 'CollectKnEnd' && !$route.params.bloc && $route.name !='CollecteVerif')">
                        <intro></intro>
                    </div>
                </template>

            </template>
            <alert-message v-else icon="bi-exclamation-triangle-fill" variant="warning">La collecte n'a pas été trouvée.</alert-message>
        </template>
                
        <div v-else>
            <spinner />
        </div>

        <router-view></router-view>
    </div>

</template>

<script>
import {mapState, mapActions} from 'vuex';
import ConsultationCollecteResume from '../components/ConsultationCollecteResume.vue';
import Intro from '../components/Intro.vue';
import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
import Spinner from '../components/pebble-ui/Spinner.vue';
import CollecteTitle from '../components/CollecteTitle.vue';


export default {
    data() {
        return {
            pending: {
                collecte: true
            }
        }
    },

    components: { Intro, ConsultationCollecteResume, AlertMessage, Spinner,  CollecteTitle },

    computed: {
        ...mapState(['collecte']),
    },

    methods: {
        ...mapActions(["setCollecte", "resetResponses", "refreshCollecte"]),


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

        /**
         * Action déclenchée lorsque les informations du projet sont modifiées.
         * 
         * @param {object} projet_data Données du projet comportant deux infos :
         * - projet_id
         * - projet_label
         */
        projetChange(projet_data) {
            this.refreshCollecte(projet_data);
        }
    },

    /**
     * Lorsque la route interne est mise à jour, le nouvel élément doit être chargé.
     */
    beforeRouteUpdate(to) {
        if (to.params.id != this.collecte?.id) {
            this.resetResponses();
            this.loadCollecte(to.params.id);
        }
    },

    /**
     * Lorsque l'élément est monté, on va lire l'élément à charger passé en paramètre.
     */
    beforeMount() {
        /**
         * Ici on va charger l'élément ouvert afin de le stocker dans le store
         */
        this.resetResponses();
        this.loadCollecte(this.$route.params.id);
    }
}

</script>

<template>

    <HeaderToolbar v-if="collecte">
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <CollecteHeaderToolbar :collecte="collecte" />
            </div>
            <div class="d-flex align-items-center">
                <button class="btn btn-secondary me-2">Liste des étapes</button>
                <button class="btn btn-secondary">
                    <i class="bi bi-save"></i>
                    <span class="ms-2 d-none d-md-inline">Enregistrer</span>
                </button>
            </div>
        </div>
    </HeaderToolbar>

    <div class="container py-3">
        <template v-if="!pending.collecte">
            <template v-if="collecte">

                <CollecteTitle :collecte="collecte" @projet-change="projetChange" />

                <Timeline :collecte="collecte" />

                <template v-if="collecte.done == 'OUI'">
                    
                    <AlertMessage class ="card" :dismissible="true">

                        Le contrôle de {{collecte.cible_nom}} (#{{collecte.id}}) est enregistré et n'est plus modifiable. <br>
                        Vous pourrez le retrouver via le menu consultation.<br>
                        Souhaitez-vous programmer un nouveau contrôle?
                    </AlertMessage>
                        <router-link :to="'/collecte/'+this.$route.params.id+'/next'" custom v-slot="{ navigate, href }"> 
                            <a class="btn btn-outline-primary col" :href="href" @click="navigate">
                                <i class="bi bi-plus-square me-2"></i>Prochain contrôle
                            </a>
                        </router-link>
                
                    
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
import HeaderToolbar from '../components/pebble-ui/toolbar/HeaderToolbar.vue';
import CollecteHeaderToolbar from '../components/collecte/CollecteHeaderToolbar.vue';
import Timeline from '../components/collecte/Timeline.vue';


export default {
    data() {
        return {
            pending: {
                collecte: true
            },

        }
    },

    components: { Intro, ConsultationCollecteResume, AlertMessage, Spinner, CollecteTitle, HeaderToolbar, CollecteHeaderToolbar, Timeline },

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

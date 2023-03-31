<template>

    
    <div class="container py-3">
        <template v-if="!pending.collecte">
            <template v-if="collecte">
                <HeaderToolbar v-if="collecte">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <CollecteHeaderToolbar :collecte="collecte" />
                        </div>
                        <div>
                        </div>
                        <div class="d-flex align-items-center" v-if="collecte.done == 'NON'">
                            <BlocNavigation v-if="($route.name != 'CollectKnEnd' && $route.name!='CollecteVerif')" />
                           
                            <button v-if="($route.name != 'CollectKnEnd' && $route.name!='CollecteVerif')" @click.prevent="navigate()" class="btn btn-primary">
                                <i class="bi bi-file-earmark-text me-2"></i>
                                <span class="ms-2 d-none d-md-inline">Finaliser</span>
                            </button>
                            <!-- <button v-else class="btn btn-secondary ms-auto" @click.prevent="navigate('end')" :disabled="pending.bloc">
                                <span v-if="pending.bloc" class="spinner-border spinner-border-sm" role="status"></span>
                                <i v-else class="bi bi-file-earmark-text me-2"></i>
                                    Finaliser
                            </button> -->
                        </div>
                    </div>
                </HeaderToolbar>

                <CollecteTitle  class="text-end" :collecte="collecte" @projet-change="projetChange" />

                <Timeline :collecte="collecte" route="collecte" />

                <template v-if="collecte.done == 'OUI'">
                    
                    <consultation-collecte-resume :collecte="collecte" :readonly="true" :timeline="false" v-if="(!$route.params.bloc && $route.name != 'CollectKnEnd' && $route.name !='CollecteVerif' && $route.name !='CollecteNext')"/>

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
// import ConsultationCollecteResume from '../components/ConsultationCollecteResume.vue';
import Intro from '../components/Intro.vue';
import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
import Spinner from '../components/pebble-ui/Spinner.vue';
import CollecteTitle from '../components/CollecteTitle.vue';
import HeaderToolbar from '../components/pebble-ui/toolbar/HeaderToolbar.vue';
import CollecteHeaderToolbar from '../components/collecte/CollecteHeaderToolbar.vue';
import Timeline from '../components/collecte/Timeline.vue';
import BlocNavigation from '../components/BlocNavigation.vue';
import ConsultationCollecteResume from '../components/ConsultationCollecteResume.vue';


export default {
    data() {
        return {
            pending: {
                collecte: true
            },

        }
    },

    components: { Intro,  AlertMessage, Spinner, CollecteTitle, HeaderToolbar, CollecteHeaderToolbar, Timeline, BlocNavigation, ConsultationCollecteResume }, 

    computed: {
        ...mapState(['collecte']),
    },

    methods: {
        ...mapActions(["setCollecte", "resetResponses", "refreshCollecte"]),

        navigate() {
            
                this.$router.push({name: 'CollectKnEnd', params:{id: this.collecte.id}})
           
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

        /**
         * Action déclenchée lorsque les informations du projet sont modifiées.
         * 
         * @param {object} projet_data Données du projet comportant deux infos :
         * - projet_id
         * - projet_label
         */
        projetChange(projet_data) {
            this.refreshCollecte(projet_data);
        },
        /**
         * Envoie les données a l'api pour valider le KN
         */
        record() {
            this.pending.collecte = true;
            console.log(this.reponses, 'reponses')
            this.$app.apiPost('data/POST/collecte/'+this.collecte.id, {
                reponses: JSON.stringify(this.responses),
                environnement:'private',
            })
            .then((data)=> {
                console.log(data, 'sauvegarder')
                this.$router.push({name: 'CollecteVerif',params:{id:this.collecte.id} });
            })
            .catch(this.$app.catchError).finally(() => this.pending.collecte = false);

        },
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

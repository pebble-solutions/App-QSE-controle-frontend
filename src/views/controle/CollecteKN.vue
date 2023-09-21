<template>
    <HeaderToolbar v-if="collecte">
        <div class="d-flex justify-content-between align-items-center">
            <CollecteHeaderToolbar :collecte="collecte" :projet-toggler="projetToggler" @projet-change="projetChange($event)" />
            
            <div class="d-flex align-items-center" v-if="collecte.done == 'NON' && $route.name =='collecteKnBloc'">
                <BlocNavigation />
                <button  @click.prevent="record()" class="btn btn-outline-primary" :disabled="pending.recordCollecte">
                    <i class="bi bi bi-save me-1" v-if="!pending.recordCollecte"></i>
                    <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" v-else></span>
                    <span class="ms-2 d-none d-md-inline">Sauvegarder</span>
                </button>
            </div>
        </div>
    </HeaderToolbar>
    
    <div class="container py-3">
        <template v-if="!pending.collecte && !pending.recordCollecte">
            <template v-if="collecte">
                <!-- <div v-if="collecte.tli">
                    {{ collecte.tli }}
                </div> -->
                <Timeline :collecte="collecte" route="collecte" />
                <template v-if="collecte.done == 'OUI'">
                    <consultation-collecte-resume 
                        :collecte="collecte" 
                        :readonly="true" 
                        :timeline="false" 
                        :toolbar="['export', 'history']"
                        v-if="(!$route.params.bloc && $route.name != 'CollectKnEnd' && $route.name !='CollecteVerif' && $route.name !='CollecteNext')" />
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
import Intro from '../../components/controle/Intro.vue';
import AlertMessage from '../../components/pebble-ui/AlertMessage.vue';
import Spinner from '../../components/pebble-ui/Spinner.vue';
import HeaderToolbar from '../../components/pebble-ui/toolbar/HeaderToolbar.vue';
import CollecteHeaderToolbar from '../../components/collecte/CollecteHeaderToolbar.vue';
import Timeline from '../../components/collecte/Timeline.vue';
import BlocNavigation from '../../components/BlocNavigation.vue';
import ConsultationCollecteResume from '../../components/ConsultationCollecteResume.vue';


export default {
    data() {
        return {
            pending: {
                collecte: true,
                recordCollecte: false
            },
        }
    },

    components: { Intro,  AlertMessage, Spinner, HeaderToolbar, CollecteHeaderToolbar, Timeline, BlocNavigation, ConsultationCollecteResume }, 

    computed: {
        ...mapState(['collecte', 'responses']),

        /**
         * Retourne true sur le formulaire de changement de projet doit être disponible.
         * 
         * On autorise le changement de projet uniquement sur l'accueil du contrôle.
         * 
         * @return {bool}
         */
        projetToggler() {
            return this.$route.name == 'collecteKN';
        }
    },

    methods: {
        ...mapActions(["setCollecte", "resetResponses", "refreshCollecte", 'refreshCollectes', 'refreshResponse']),

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
         * Action déclenchée pour mettre à jour les informations du projet lié
         * 
         * @param {object} projet_data Données du projet :
         * - projet_id
         * - projet_label
         */
        projetChange(projet_data) {
            this.refreshCollecte(projet_data);
        },

        /**
         * Enregistre les données du KN
         */
        record() {
            this.pending.recordCollecte = true;
            this.$app.apiPost('data/POST/collecte/'+this.collecte.id, {
                reponses: JSON.stringify(this.responses),
                environnement:'private',
            })
            .then((data) => {
                return this.refreshCollectes([data]);
            })
            .then(() => {
                return this.$app.apiGet('data/GET/collecte/'+this.collecte.id, {
                    environnement: 'private'
                });
            })
            .then((collecte) => {
                this.refreshCollecte(collecte);
                this.getReponses(collecte);
            })
            .catch(this.$app.catchError).finally(() => this.pending.recordCollecte = false);

        },

        /**
         * Récupère les réponses stockées dans la collecte pour les déplacer dans un élément tampon
         * du store.
         */
         getReponses() {
            this.collecte.reponses.forEach((resp) => {
                let itemReponse = {};

                itemReponse.question = resp.ligne;
                itemReponse.reponse = resp.data;
                itemReponse.commentaire = resp.commentaire;
                itemReponse.documents = resp.documents;

                let findBloc = this.collecte.formulaire.questions.find((question) => question.id == resp.ligne);
                itemReponse.bloc = findBloc.information__bloc_id;

                this.refreshResponse(itemReponse);
            })
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

<template>
    <div v-if="pending.bloc">
        <spinner></spinner>
    </div>

    <div class="card my-3" v-else-if="bloc">
        <div  class="card-header">
            <div class="d-flex justify-content-between">
                <h2 class="card-title">{{ bloc.bloc }}</h2>
                <!-- <div v-if="$route.params.bloc">
                    <bloc-navigation :currentBlocId="$route.params.bloc" @update-resp="sendResp('nav')"></bloc-navigation>
                </div> -->
            </div>

            <div class="fw-light fst-italic mb-2">
                Questions :  {{nbAnswers}} / {{lignes?.length}}
            </div>
        </div>
        <form-section :questions="lignes" :collecte="collecte" />
    </div>
    <div v-else>
        <spinner></spinner>
    </div>

    <FooterToolbar v-if="bloc" wrapper-class="px-2 py-1 border-top border-dark" class-name="bg-dark">
        <BlocNavigationButtons :bloc="bloc" :blocs="formulaire.blocs" :pending="pending.bloc" @navigate="navigate($event)" />
    </FooterToolbar>

</template>

<script>
import {mapActions, mapState} from 'vuex';
// import BlocNavigation from '../components/BlocNavigation.vue';
import Spinner from '../components/pebble-ui/Spinner.vue';
import FormSection from '../components/form/FormSection.vue';
import BlocNavigationButtons from '../components/form/BlocNavigationButtons.vue';
import FooterToolbar from '../components/pebble-ui/toolbar/FooterToolbar.vue';

export default {
    data() {
        return {
            bloc_id: null,
            comment: null,
            pending: {
                bloc: false
            }
        }
    },

    components: { Spinner, FormSection, BlocNavigationButtons, FooterToolbar },

    computed: {
        ...mapState(['collecte', 'responses']),

        bloc() {
            return this.formulaire.blocs.find(e => e.id == this.bloc_id);
        },

        lignes() {
            return this.formulaire.questions.filter(e => e.information__bloc_id == this.bloc_id);
        },

        formulaire() {
            return this.collecte.formulaire;
        },

        /**
         * retourne le nombre de reponse effectué
         */
        nbAnswers() {
            let nb = this.responses.filter(resp => resp.bloc == this.$route.params.bloc);
            return nb.length;
        },
    },

    methods: {
        ...mapActions(['refreshResponse', 'refreshCollecte', 'refreshCollectes']),


        /**
         * Envoi les reponses du questionnaire a l'api et passe a la page suivante en fonction de l'action.
         * 
         * @param {object}  to      Le bloc vers lequel naviguer
         */
        navigate(to) {
            this.pending.bloc = true;

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
            .then(() => {
                if (to === 'end') {
                    this.$router.push({name: 'CollectKnEnd', params:{id:this.collecte.id}});
                }
                else if (to?.id) {
                    this.$router.push({name: 'collecteKnBloc', params:{id:this.collecte.id, bloc:to.id}});
                }
                else {
                    alert('Les informations sont enregistrées mais une erreur est survenue dans la navigation.');
                }
            })
            .catch(this.$app.catchError).finally(() => this.pending.bloc = false);
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

    beforeRouteUpdate(to) {
        this.bloc_id = to.params.bloc;
    },
    
    mounted() {
        this.bloc_id = this.$route.params.bloc;
        this.getReponses();
    }
}
</script>
<template>

    <div class="card my-3" v-if="bloc">
        <div  class="card-header">
            <div class="d-flex justify-content-between">
                <h2 class="card-title">{{ bloc.bloc }}</h2>

                <div v-if="$route.params.bloc">
                    <bloc-navigation :bloc_id="$route.params.bloc"></bloc-navigation>
                </div>
            </div>

            <div class="fw-light fst-italic mb-2">
                Questions :  {{nbAnswers}} / {{lignes?.length}}
            </div>

            <div class="d-flex justify-content-between">
                <button class="btn btn-secondary" v-if="prevBloc" @click="sendResp('prev')" :disabled="pending.bloc">
                    <span v-if="pending.bloc" class="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
                    <i v-else class="bi bi-box-arrow-left"></i> 
                    {{ prevBloc.bloc }}
                </button>

                <button class="btn btn-secondary ms-auto" v-if="nextBloc" @click="sendResp('next')" :disabled="pending.bloc">
                    {{nextBloc.bloc}} 
                    <span v-if="pending.bloc" class="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
                    <i v-else class="bi bi-box-arrow-right"></i>
                </button>

                <button v-else class="btn btn-success" @click="sendResp('end')" :disabled="pending.bloc">
                    <span v-if="pending.bloc" class="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
                    <i v-else class="bi bi-file-earmark-text"></i>
                    Évaluation générale
                </button>
            </div>
        </div>

        <div class="accordion accordion-flush" :id="'accordion-'+bloc.id" v-if="(lignes.length > 0)">
            <div class="accordion-item" v-for="ligne in lignes" :key="ligne.id">
                <ItemAnswerHeader :ligne="ligne" :collapsed="false"></ItemAnswerHeader>
                
                <div :id="'collapse_'+ ligne.id" class="accordion-collapse collapse show" :aria-labelledby="'heading_' + ligne.id" :data-bs-parent="'#accordion-'+bloc.id">
                    <div class="accordion-body">  
                        <ItemAnswer :id="ligne.id" :bloc_id="bloc.id"></ItemAnswer>
                    </div>
                </div>
            </div>
        </div> 
        
        <div class="d-flex justify-content-center mt-3" v-else>
            <AlertMessage variant="warning w-50 text-center">Aucune question renseignée </AlertMessage>
        </div>
    </div>

    <div v-else>
        <spinner></spinner>
    </div>  

</template>

<script>

import {mapActions, mapState} from 'vuex';
import ItemAnswer from '../components/ItemAnswer.vue'
import ItemAnswerHeader from '@/components/ItemAnswerHeader.vue'
import AlertMessage from '@/components/pebble-ui/AlertMessage.vue'
import BlocNavigation from '../components/BlocNavigation.vue';
import Spinner from '../components/pebble-ui/Spinner.vue';

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

    components: {ItemAnswer, ItemAnswerHeader, AlertMessage, BlocNavigation, Spinner},

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

        nextBloc() {
            return this.findBloc(+1);
        },

        prevBloc() {
            return this.findBloc(-1);
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
        ...mapActions(['refreshResponse']),
        
        /**
         * Récupère le bloc correspondant
         * @param {*} i 
         * 
         * @return {Object}
         */  
        findBloc(i) {
            let selfIndex = this.formulaire.blocs.findIndex(e => e.id == this.bloc_id);
            let bloc = this.formulaire.blocs[selfIndex+i];
            return bloc;
        },

        /**
         * Envoi les reponses du questionnaire a l'api et passe a la page suivante a fonction de l'action.
         * 
         * @param {string}  action      défini la navigation entre bloc a réaliser
         */
        sendResp(action) {
            this.pending.bloc = true
            this.$app.apiPost('data/POST/collecte/'+this.collecte.id, {
                reponses: JSON.stringify(this.responses),
                environnement:'private',
            })
            .then(() => {
                switch (action) {
                    case 'prev':
                        this.$router.push({name: 'collecteKnBloc', params:{id:this.collecte.id, bloc:this.prevBloc.id}});
                        break;

                    case 'next':
                        this.$router.push({name: 'collecteKnBloc', params:{id:this.collecte.id, bloc:this.nextBloc.id}});
                        break;
                
                    default:
                        this.$router.push({name: 'CollectKnEnd', params:{id:this.collecte.id}});
                        break;
                }
            })
            .catch(this.$app.catchError).finally(this.pending.bloc = false);
        },

        getReponses() {
            this.collecte.reponses.forEach((resp) => {
                let itemReponse = {};

                itemReponse.question = resp.ligne;
                itemReponse.reponse = resp.data_var;
                itemReponse.commentaire = resp.commentaire;

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
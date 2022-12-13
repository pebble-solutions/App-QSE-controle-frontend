<template>
    <div class="card my-3" v-if="bloc">
        <div  class="card-header">
            <h2 class="card-title">{{bloc.bloc}}</h2>

            <div class="fw-light fst-italic mb-2">
                Questions :  {{nbAnswers}} / {{lignes?.length}}
            </div>

            <div class="d-flex justify-content-between">
                <router-link :to="'/collecte/'+$route.params.id+'/bloc/'+prevBloc.id" custom v-slot="{ navigate, href }" v-if="prevBloc">
                    <a class="btn btn-secondary mx-1" :href="href" @click="navigate">
                        <i class="bi bi-box-arrow-left"></i> {{prevBloc.bloc}} 
                    </a>
                </router-link>

                <router-link :to="'/collecte/'+$route.params.id+'/bloc/'+nextBloc.id" custom v-slot="{ navigate, href }" v-if="nextBloc">
                    <a class="btn btn-secondary mx-1 ms-auto" :href="href" @click="navigate">
                        {{nextBloc.bloc}} <i class="bi bi-box-arrow-right"></i>
                    </a>
                </router-link>

                <!-- <router-link v-else :to="{name: 'collecteKnEnd', params:{id:$route.params.id}}" custom v-slot="{navigate, href}">
                    <a class="btn btn-success" :href="href" @click="navigate">
                        Terminer le questionnaire
                    </a>
                </router-link> -->

                <a v-else class="btn btn-success" href="">Terminer le questionnaire</a>
            </div>
        </div>

        <div class="accordion accordion-flush" :id="'accordion-'+bloc.id" v-if="(lignes.length > 0)">
            <div class="accordion-item" v-for="ligne in lignes" :key="ligne.id">
                <ItemAnswerHeader :ligne="ligne"></ItemAnswerHeader>
                
                <div :id="'collapse_'+ ligne.id" class="accordion-collapse collapse" :aria-labelledby="'heading_' + ligne.id" :data-bs-parent="'#accordion-'+bloc.id">
                    <div class="accordion-body">  
                        <ItemAnswer :id="ligne.id" :bloc_id="bloc.id"></ItemAnswer>
                    </div>
                </div>
            </div>
        </div> 
        
        <div class="d-flex justify-content-center mt-3" v-else>
            <AlertMessage variant="warning w-50 text-center">Aucune questions renseignées</AlertMessage>
        </div>
    </div>

</template>

<script>

import {mapState} from 'vuex';
import ItemAnswer from '../components/ItemAnswer.vue'
import ItemAnswerHeader from '@/components/ItemAnswerHeader.vue'
import AlertMessage from '@/components/pebble-ui/AlertMessage.vue'

export default {
    data() {
        return {
            bloc_id: null,
            comment: null,
        }
    },

    components: {ItemAnswer, ItemAnswerHeader, AlertMessage},

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
        findBloc(i) {
            let selfIndex = this.formulaire.blocs.findIndex(e => e.id == this.bloc_id);
            let bloc = this.formulaire.blocs[selfIndex+i];
            return bloc;
        },

        /**
         * Envoi les reponses du questionnaire a l'api
         */
        sendResp() {
            this.$app.apiPost('data/POST/collecte', {
                reponses: JSON.stringify(this.responses),
                formulaire: this.collecte.id,
                environnement:'private',
            }).catch(this.$app.catchError);
        },
    },

    beforeRouteUpdate(to) {
        this.bloc_id = to.params.bloc;
    },
    
    mounted() {
        this.bloc_id = this.$route.params.bloc;
    }
}
</script>
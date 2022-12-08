<template>
    <div class="card my-3" v-if="bloc">
        <div  class="card-header">
            <h2 class="card-title d-flex justify-content-start">{{bloc.bloc}}</h2>
            <p class="d-flex justify-content-start">Questions :  0 / {{lignes?.length}}</p>
            <div class="d-flex justify-content-between">
                <router-link :to="'/collecte/'+$route.params.id+'/bloc/'+prevBloc.id" custom v-slot="{ navigate, href }" v-if="prevBloc">
                    <a class="btn btn-outline-primary mx-1" :href="href" @click="navigate">
                        <i class="bi bi-box-arrow-left"></i> {{prevBloc.bloc}} 
                    </a>
                </router-link>
                <div v-else></div>

                <router-link :to="'/collecte/'+$route.params.id+'/bloc/'+nextBloc.id" custom v-slot="{ navigate, href }" v-if="nextBloc">
                    <a class="btn btn-outline-primary mx-1" :href="href" @click="navigate">
                        {{nextBloc.bloc}} <i class="bi bi-box-arrow-right"></i>
                    </a>
                </router-link>
                <div v-else></div>
            </div>
            
        </div>
        <hr>
            <div class="accordion accordion-flush" :id="'accordion-'+bloc.id">
                <div class="accordion-item" v-for="ligne in lignes" :key="ligne.id">
                    <h3 class="accordion-header" :id="'heading_'+ ligne.id">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse_'+ ligne.id"
                            aria-expanded="true" :aria-controls="'collapse_'+ ligne.id">
                            {{ligne.ligne}}
                            <!--<badge class="badge bg-secondary float-end">Obligatoire</badge>-->
                        </button>
                    </h3>
                    <div :id="'collapse_'+ ligne.id" class="accordion-collapse collapse" :aria-labelledby="'heading_' + ligne.id" :data-bs-parent="'#accordion-'+bloc.id">
                        <div class="accordion-body">  
                            <ItemAnswer
                            :id="ligne.id">
                            </ItemAnswer>
                        </div>
                    </div>
                </div>
        </div>                  
    </div>

    <div v-else>What Else</div>

</template>

<script>

import {mapState} from 'vuex';
import ItemAnswer from '../components/ItemAnswer.vue';

export default {

    data() {
        return {
            bloc_id: null,
            comment: null
        }
    },

    components: {ItemAnswer},

    computed: {
        ...mapState(['collecte']),

        bloc() {
            return this.formulaire.blocs.find(e => e.id == this.bloc_id);

            
        },


        lignes() {
            return this.formulaire.questions.filter(e => e.information__bloc_id == this.bloc_id);
        },

        formulaire() {
            console.log(this.collecte.formulaire, 'formulaire')
            return this.collecte.formulaire;
        },

        nextBloc() {
            console.log(this.findBloc(+1), this.findBloc(+1).bloc, 'nextBloc')
            return this.findBloc(+1);
        },

        prevBloc() {
            return this.findBloc(-1);
        }
    },

    methods: {
        findBloc(i) {
            let selfIndex = this.formulaire.blocs.findIndex(e => e.id == this.bloc_id);
            let bloc = this.formulaire.blocs[selfIndex+i];
            console.log(bloc, this.bloc_id, this.bloc_id.bloc, 'find bloc');
            return bloc;
        },
        record(options) {
            console.log(options, 'enregistrement options');
        }, 
        recordC() {
            console.log(this.comment, 'enregistrement commentaire');

        }

    },

    beforeRouteUpdate(to) {
        this.bloc_id = to.params.bloc;
    },
    
    mounted() {
        this.bloc_id = this.$route.params.bloc;
    }
}
</script>
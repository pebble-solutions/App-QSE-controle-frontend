<template>
    <div class="card my-3" v-if="bloc">
        <div  class="card-header">
            <h2 class="card-title d-flex justify-content-center">{{bloc.bloc}}</h2>
            <p class="badge bg-light text-dark d-flex justify-content-center display-6">items : 0/23</p>
            <div class="d-flex justify-content-between">
                <router-link :to="'/element/'+$route.params.id+'/bloc/'+prevBloc.id" custom v-slot="{ navigate, href }" v-if="prevBloc">
                    <a class="btn btn-secondary" :href="href" @click="navigate">
                        {{prevBloc.bloc}}
                    </a>
                </router-link>
                <div class ="btn btn-secondary" v-else>Y'a rien avant</div>

                <router-link :to="'/element/'+$route.params.id+'/bloc/'+nextBloc.id" custom v-slot="{ navigate, href }" v-if="nextBloc">
                    <a class="btn btn-secondary" :href="href" @click="navigate">
                        {{nextBloc.bloc}}
                    </a>
                </router-link>
                <div v-else>Y'a plus après</div>
            </div>
        </div>

            <!--<p>{{bloc.indication}}</p>-->
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
                    <div :id="'collapse_'+ ligne.id" class="accordion-collapse collapse" :aria-labelledby="'heading_' + ligne.id" data-bs-parent="#accordion">
                        
                        <div class="accordion-body">               
                            <div>{{ligne.indication}}</div>
                            <div class="row">
                                <div class="col d-grid">
                                    <button type="button" class="btn btn-success">S</button>
                                </div>
                                <div class="col d-grid">
                                    <button type="button" class="btn btn-primary">A</button>
                                </div>
                                <div class="col d-grid">
                                    <button type="button" class="btn btn-warning">M</button>
                                </div>
                                <div class="col d-grid">
                                    <button type="button" class="btn btn-danger">I</button>
                                </div>
                            </div>                            
                            <div class="mt-3">
                                <label :for="'commentaire-ligne-'+ligne.id" class="form-label d-none">Commentaire</label>
                                <input type="text" class="form-control" :id="'commentaire-ligne-'+ligne.id" placeholder="Votre commentaire">
                            </div>
                        </div>
                    </div>
                </div>
        </div>                  
    </div>

</template>

<script>

import {mapGetters} from 'vuex'

export default {

    data() {
        return {
            bloc_id: null
        }
    },

    computed: {
        ...mapGetters(['openedElementBlocs', 'opendeElementLignes']),

        bloc() {
            return this.openedElementBlocs.find(e => e.id == this.bloc_id);
        },


        lignes() {
            return this.opendeElementLignes.filter(e => e.information__bloc_id == this.bloc_id);
        },

        nextBloc() {
            return this.findBloc(+1);
        },

        prevBloc() {
            return this.findBloc(-1);
        }
    },

    methods: {
        findBloc(i) {
            let selfIndex = this.openedElementBlocs.findIndex(e => e.id = this.bloc_id);
            let bloc = this.openedElementBlocs[selfIndex+i];
            return bloc;
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
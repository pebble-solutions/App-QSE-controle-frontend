<template>
    <div class="container px-0 py-2">
        <div class="d-flex flex-wrap justify-content-between align-items-center my-2 mb-3">
            <h1 class="fs-3 m-0 me-2">{{ formulaireName }}</h1> 
            <div class="badge bg-secondary">{{collectes.length}}</div>
            <button v-if="isMoreAvailable"  class="btn btn-outline-primary" @click.prevent="loadPlus()"> Charger <i class="bi bi-plus"></i></button>
        </div>
    
        <spinner v-if="pending.collectes" />
        
        <div class="list-group" v-else>
            
            <router-link :to="'/consultation/formulaire/'+this.$route.params.idFormulaire+'/'+col.id" v-slot="{navigate,href}" custom v-for="col in collectes" :key="col.id">
                <a :href="href" @click="navigate" class="list-group-item list-group-item-action">
                    <collecte-headband :collecte="col" :editable="false" />
                </a>
            </router-link>
        </div>  
    </div>
    
    <router-view></router-view>
</template>

<script>

import { mapActions, mapState } from 'vuex'
import CollecteHeadband from '../components/CollecteHeadband.vue';
import { searchConsultation } from '../js/search-consultation';
import Spinner from '../components/pebble-ui/Spinner.vue';

export default{
    components:{CollecteHeadband, Spinner},

    data() {
        return {

            pending: {
                collectes: true,
                formulaire : true,
            },
            result: [],
            dd: null,
            df: null,
            start: 0,
            limit: 50,
            noMoreAvailable: false
        }
    },
    computed: {
        ...mapState(['formulaire', 'formulaires', 'collectes']),

        /**
         * Récupere le nom du groupe d'information de la collect via un id de
         * 
         * @param {number} groupInformationId l'id du group information de la collecte
         * 
         * @return {string}
         */

        formulaireName() {
            let groupInformation = this.formulaires.find(e => e.id == this.$route.params.idFormulaire);
    
            if (groupInformation) {
                return groupInformation.groupe;
            }
            else { 
                return null ;
            }
        },
        /**
         * Contrôle si il peut exister plus de résultats sur le serveurs que
         * de données stockées dans résults.
         *
         * On concidère qu'il peut exister des résultats supplémentaires sur le serveur
         * à partir du moment ou il y a plus de 50 items dans result et que result / 50 est
         * égal à 1.
         *
         * @return {bool}
         */
        isMoreAvailable() {
            let ln = this.collectes.length;
            return (ln && ln % this.limit === 0 && !this.noMoreAvailable);
        }		
    },

    methods: {
        ...mapActions(['setCollectes']),

        

        /**
         * Charge les collectes liées au formulaire ouvert
         * 
         * @param {number} idForm
         * @param  {string} mode
         * - mode           'replace' (défaut), 'append' (ajout des données à la fin de la liste)
         * 
         */
        loadCollectes(idForm, mode) {
            if(!mode){
                this.start= 0;
                this.noMoreAvailable=false
            }
                idForm = idForm ?? this.$route.params.idFormulaire;
                this.pending.collectes = true;
                
                searchConsultation({
                    formulaire: idForm,
                    dd: null,
                    df: null,
                    start: this.start,
                    limit: this.limit,
                    },
    
                    this.$app)
                    .then(data => {
                            if (mode == 'append') {
                                if(!data.length){
                                    this.noMoreAvailable =true;
                                } else {
                                    // this.result =this.result.concat(data);
                                    this.setCollectes(data);
                                    this.pending.collectes = false;

                                }
                            } else{

                                this.setCollectes(data);
                                this.pending.collectes = false;
                            }
                        })
                        .catch(this.$app.catchError)
                        .finally(() => this.pending.collectes = false);
            
    
        },
        /**
         * Charge la suite des données lorsque le nombre de résultats est > à 50
         * et divisible par 50 en nombre entier.
         */
        loadPlus() {
            if (this.isMoreAvailable) {
                this.start += this.limit;
                this.loadCollectes(this.idForm,'append');
            } 
        }
        
        
    },

    beforeRouteUpdate(to, from) {
        if (to.params.idFormulaire !== from.params.idFormulaire) {
            this.loadCollectes(to.params.idFormulaire);
        }
    },
    
    mounted() {
        this.loadCollectes();
    }
}
</script>








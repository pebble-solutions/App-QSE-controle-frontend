<template>
    <div class="container px-0 py-2">
        <div class="d-flex flex-wrap justify-content-start align-items-center my-2 mb-3">
            <h1 class="fs-3 m-0 me-2">{{ formulaireName }}</h1> 
            <div class="badge bg-secondary">{{collectes.length}}</div>
        </div>
    
        <spinner v-if="pending.collectes" />
        
        <div class="list-group" v-else>

            <router-link :to="'/consultation/'+col.id" v-slot="{navigate,href}" custom v-for="col in collectes" :key="col.id">
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
    },

    methods: {
        ...mapActions(['setCollectes']),

        /**
         * ouvre la collecte dans la vue principale pour consultation
         * @param {number} collecteId 
         */
        seeCollecte(id) {
            this.$router.push({name: 'consultationCollecte', params: {idCollecte: id}});
        },

        /**
         * Charge les collectes liées au formulaire ouvert
         * 
         * @param {number} idForm
         */
        loadCollectes(idForm) {
            idForm = idForm ?? this.$route.params.idFormulaire;

            this.pending.collectes = true;
            searchConsultation({
                formulaire: idForm,
                dd: null,
                df: null
            }, this.$app).then(data => {
                this.pending.collectes = false;
                this.setCollectes(data);
            }).catch(this.$app.catchError).finally(() => this.pending.collectes = false);
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








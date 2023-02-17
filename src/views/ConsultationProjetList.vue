<template>
    <div class="container px-0 py-2">
        <div class="d-flex flex-wrap justify-content-start align-items-center my-4">
            <h1 class="fs-3 m-0 me-2">{{ projetName }}</h1> 
            <div class="badge bg-secondary">{{collectes.length}}</div>
        </div>
        
        <spinner v-if="pending.collectes"/>

        <div class="list-group" v-else>
            <router-link :to="'/consultation/projet/'+this.$route.params.idProjet+'/'+col.id" v-slot="{navigate,href}" custom v-for="col in collectes" :key="col.id">
                
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
import Spinner from '../components/pebble-ui/Spinner.vue';
import { searchConsultation } from '../js/search-consultation';

export default {

    components:{CollecteHeadband,Spinner}, //
    data(){
        return {

            pending: {
                collectes: false,
                projet: true,
            }
        }
    },

    computed: {
        ...mapState(['collectes', 'projets', 'projet']),

        /**
         * Récupere le label du projet de la collect via l'id du projet
         * 
         * @param {number} projectInfo l'id du projet_id de la collecte
         * 
         * @return {string}
         */

        projetName() {
            let projectInfo = this.projets.find(e => e.id == this.$route.params.idProjet);
    
            if (projectInfo) {
                return projectInfo.intitule;
            }
            else { 
                return null ;
            }
        },		


    },
    methods: {
        ...mapActions(['setCollectes']),

        /**
         * Charge les collectes liées au projet ouvert
         * 
         * @param {number} idProjet
         */
        loadCollectes(idProjet) {
            idProjet = idProjet ?? this.$route.params.idProjet;

            this.pending.collectes = true;
            searchConsultation({
                projet_id: idProjet,
                dd: null,
                df: null
            }, this.$app).then(data => {
                this.pending.collectes = false;
                this.setCollectes(data);
            }).catch(this.$app.catchError).finally(() => this.pending.collectes = false);
        }
        
    },

    beforeRouteUpdate(to, from) {
        if (to.params.idProjet !== from.params.idProjet) {
            this.loadCollectes(to.params.idProjet);
        }
    },
    
    mounted() {
        this.loadCollectes();
    }
}

</script>


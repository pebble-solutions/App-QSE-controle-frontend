
<template>
    <div class="container" v-if="!pending.stat">
        <div class="row">
            <div class="card my-2 overflow-auto">
                <div class="card-body">
                    <h3 class="card-title fs-4">Agenda</h3>
                        <AgendaChart></AgendaChart>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Répartition des réponses</h3>
                        <GlobalPieChart></GlobalPieChart>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="card my-2">
                <div class="card-body">
                    <GlobalTable></GlobalTable>
                </div>
            </div>
        </div>
            <StatOperateur :requeteStat="requeteStat" v-if="requeteStat"></StatOperateur>
            <StatHabilitation :requeteStat="requeteStat" v-if="requeteStat"></StatHabilitation>
            <StatProjet :requeteStat="requeteStat" v-if="requeteStat"></StatProjet>
            <StatControleur :requeteStat="requeteStat" v-if="requeteStat"></StatControleur>
    </div>
    <RouterView></RouterView>
</template>

<script>
import AgendaChart from '../components/googleCharts/AgendaChart.vue'
import GlobalPieChart from '../components/googleCharts/GlobalPieChart.vue'
import StatOperateur from '../components/googleCharts/StatOperateur.vue'
import StatHabilitation from '../components/googleCharts/StatHabilitation.vue'
import StatProjet from '../components/googleCharts/StatProjet.vue'
import StatControleur from '../components/googleCharts/StatControleur.vue'
import GlobalTable from '../components/googleCharts/GlobalTable.vue'
import { mapActions, mapState } from 'vuex'

export default {
    data() {
        return {
            pending: {
                stat: true
            },
        }
    },
    components: { AgendaChart, GlobalPieChart, StatOperateur, StatHabilitation, StatProjet, StatControleur, GlobalTable },
    computed: {
        ...mapState(['requeteStat']),
    },

    methods: {
        ...mapActions(['loadStatResult']),
        stats() {
            return this.requeteStat;
        },
        sendRequest() {
            let route = 'v2/collecte';
            let query = {
                dd: this.requeteStat.dd,
                df: this.requeteStat.df,
                personnel_id__operateur: this.requeteStat.operateurs.join(','),
                projet_id: this.requeteStat.projets.join(','),
                personnel_id__controleur: this.requeteStat.controleurs.join(','),
                habilitation_type_id: this.requeteStat.habilitation.join(','),
                done: 'OUI',
                type: 'KN',
            };

            this.$app.apiGet(route, query)
                .then((data) => {
                    this.loadStatResult(data);
                })
                .catch(this.$app.catchError);
        }
    },
    watch: {
        /**
         * Ecoute la varible echeancier dans le store 
         * et fais les appels necessaire au methodes de recuperation de données 
         * lors du changement de celle-ci
         */
        requeteStat: {
            handler(newValue) {
                this.pending.stat = true
                if (newValue.dd && newValue.df) {
                    this.sendRequest();
                    this.pending.stat = false
                }
            },
        }
    },
    // unmounted(){
    //     this.setRequete(null)
    // },
    mounted() {
        /*let collection = this.$assets.getCollection('collectes');
        this.pending.collectes = true;
        collection.load();
        this.pending.collectes = false;*/
    }
}
</script>
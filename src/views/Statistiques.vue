<template>
    <div class="container" v-if="!pending.load && !emptyData && !pending.stat">
        <div class="row">
            <div class="col-md-12 my-2">
                <div class="bg-white rounded p-3 shadow">
                    <h3 class="fs-4 text-center">Agenda</h3>
                    <AgendaChart></AgendaChart>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-md-6">
                <div class="card my-2">
                    <div class="card-body">
                        <h3 class="card-title fs-4">Répartition des réponses</h3>
                        <GlobalPieChart></GlobalPieChart>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="card my-2">
                    <div class="card-body">
                        <h3 class="card-title fs-4">Répartition des kn en retard</h3>
                        <RetardKn></RetardKn>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 my-3">
                <div class="bg-white rounded p-3 shadow">
                    <h3 class="fs-4 text-center">Global</h3>
                    <GlobalTable></GlobalTable>
                </div>
            </div>
            <div class="col-md-12 my-3">
                <div class="rounded overflow-hidden p-2 shadow bg-white">
                    <StatOperateur :requeteStat="requeteStat" v-if="!pending.stat"></StatOperateur>
                </div>
            </div>
            <div class="col-md-12 my-3">
                <div class="rounded overflow-hidden p-2 shadow bg-white">
                    <StatHabilitation :requeteStat="requeteStat" v-if="!pending.stat"></StatHabilitation>
                </div>
            </div>
            <div class="col-md-12 my-3">
                <div class="rounded overflow-hidden p-2 shadow bg-white">
                    <StatProjet :requeteStat="requeteStat" v-if="!pending.stat"></StatProjet>
                </div>
            </div>
            <div class="col-md-12 my-3">
                <div class="rounded overflow-hidden p-2 shadow bg-white">
                    <StatControleur :requeteStat="requeteStat" v-if="!pending.stat"></StatControleur>
                </div>
            </div>
        </div>
    </div>
    <div v-else-if="pending.spinner">
        <Spinner></Spinner>
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
import Spinner from '../components/pebble-ui/Spinner.vue';
import { mapState } from 'vuex'
import RetardKn from '../components/googleCharts/RetardKn.vue'

export default {
    data() {
        return {
            pending: {
                stat: true,
                load: true,
                spinner: false,
            },
            emptyData: false,
        }
    },
    components: { AgendaChart, GlobalPieChart, StatOperateur, StatHabilitation, StatProjet, StatControleur, GlobalTable, Spinner, RetardKn },
    computed: {
        ...mapState(['requeteStat']),
    },
    methods: {
        stats() {
            return this.requeteStat;
        },
    },
    watch: {
        requeteStat: {
            async handler(newValue) {
                if (newValue.dd && newValue.df) {
                    this.pending.stat = true;
                    this.pending.spinner = true;
                    let collectes = this.$assets.getCollection('collectesCollection');
                    collectes.reset();
                    await collectes.load({
                        dd_start: this.requeteStat.dd,
                        df_start: this.requeteStat.df,
                        personnel_id__operateur: this.requeteStat.operateurs.join(','),
                        projet_id: this.requeteStat.projets.join(','),
                        personnel_id__controleur: this.requeteStat.controleurs.join(','),
                        habilitation_type_id: this.requeteStat.habilitation.join(','),
                        done: 'OUI',
                        type: 'KN',
                    });
                    this.pending.spinner = false;
                    if (collectes.getCollection().length == 0) {
                        this.emptyData = true;
                        window.alert("Aucune donnée pour les filtres sélectionnés");
                    } else { this.emptyData = false; }
                    this.pending.stat = false;
                }
            },
        },
    },
    // unmounted(){
    //     this.setRequete(null)
    // },
    async mounted() {
        let collectes = this.$assets.getCollection('collectesCollection');
        let personnels = this.$assets.getCollection('personnels');
        let habilitations = this.$assets.getCollection('habilitationsCharacteristic');
        this.pending.load = true;
        await collectes.load();
        await personnels.load({
            limit: 'aucune'
        });
        await habilitations.load({
            limit: 'aucune'
        });
        this.pending.load = false;
    }
}
</script>
<template>
    <div class="row">
        <h1>Habilitations</h1>
        <div class="col-3">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Habilitations contrôlées sur la période</h3>
                    <p>{{ currentHabilitations }}</p>
                </div>
            </div>
        </div>
        <!--<div class="col-6">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Toutes les Habilitations</h3>
                    <p>{{ totalHabilitations }}</p>
                </div>
            </div>
        </div>-->
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Répartition de réponses par KN</h3>
                    <HabilitationBarChart :requeteStat="requeteStat"></HabilitationBarChart>
                </div>
            </div>
        </div>
    </div>
    <!--<div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Répartition des types d'habilitations</h3>
                    <HabilitationPieChart :requeteStat="requeteStat"></HabilitationPieChart>
                </div>
            </div>
        </div>
    </div>-->
    <div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <HabilitationTable :requeteStat="requeteStat"></HabilitationTable>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import HabilitationBarChart from './HabilitationBarChart.vue';
//import HabilitationPieChart from './HabilitationPieChart.vue';
import HabilitationTable from './HabilitationTable.vue';

export default {
    data() {
        return {
            currentHabilitations: 0,
            totalHabilitations: 0,
        }
    },
    props: {
        requeteStat: {
            type: Object,
            required: true
        }
    },
    methods: {
        computeHabilitations() {
            const data = this.$assets.getCollection('collectesCollection').getCollection();
            let periodHabilitationsHistory = [];
            let totalHabilitationsHistory = [];
            data.forEach(collecte => {
                if (totalHabilitationsHistory.findIndex(id => id == collecte['habilitation_id']) == -1) {
                    totalHabilitationsHistory.push(collecte['habilitation_id']);
                    if (collecte['date_done'] >= this.requeteStat.dd && collecte['date_done'] <= this.requeteStat.df) {
                        periodHabilitationsHistory.push(collecte['habilitation_id']);
                    }
                }
            });
            this.currentHabilitations = periodHabilitationsHistory.length;
            this.totalHabilitations = totalHabilitationsHistory.length;
            periodHabilitationsHistory = [];
            totalHabilitationsHistory = [];
        },
    },
    components: { HabilitationBarChart, HabilitationTable },
    mounted(){
        this.computeHabilitations();
    }
}
</script>

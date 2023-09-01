<template>
    <h2 class="text-center">Habilitations</h2>
    <div class="row">
        <div class="col-12">
            <div class="card card-body">
    <h3 class="card-title fs-4 text-center">Habilitations contrôlées sur la période :</h3>
    <div class="text-center mt-2">
        <div class="rounded-circle d-flex align-items-center justify-content-center mx-auto my-2"
            style="width: 60px; height: 60px; background-color: #FFD700; border: 3px solid #f6c23f;">
            <span class="fs-3 text-white">{{ currentHabilitations }}</span>
        </div>
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
    <!--<div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Répartition de réponses par KN</h3>
                    <HabilitationBarChart :requeteStat="requeteStat"></HabilitationBarChart>
                </div>
            </div>
        </div>
    </div>-->
    <div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4 text-center">Répartition des types d'habilitations</h3>
                    <HabilitationPieChart :requeteStat="requeteStat"></HabilitationPieChart>
                </div>
            </div>
        </div>
    </div>
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
//import HabilitationBarChart from './HabilitationBarChart.vue';
import HabilitationPieChart from './HabilitationPieChart.vue';
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
    components: { HabilitationPieChart, HabilitationTable },
    mounted() {
        this.computeHabilitations();
    }
}
</script>

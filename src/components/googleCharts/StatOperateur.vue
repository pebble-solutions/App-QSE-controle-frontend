<template>
    <div class="row">
        <h1>Opérateur</h1>
        <div class="col-6">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Habilitations de l'opérateur sur la période</h3>
                    <p>{{ currentHabilitations }}</p>
                </div>
            </div>
        </div>
        <div class="col-6">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Toutes les Habilitations de l'opérateur</h3>
                    <p>{{ totalHabilitations }}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Répartition des réponses</h3>
                    <OperatorBarChart :requeteStat="requeteStat"></OperatorBarChart>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Nombre de KN par opérateur</h3>
                    <OperatorPieChart :requeteStat="requeteStat"></OperatorPieChart>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <OperatorTable :requeteStat="requeteStat"></OperatorTable>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import OperatorBarChart from './OperatorBarChart.vue';
import OperatorPieChart from './OperatorPieChart.vue';
import OperatorTable from './OperatorTable.vue';
import { mapState } from 'vuex';

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
        },
    },
    computed: {
        ...mapState(['statResult'])
    },
    methods: {
        computeHabilitations() {
            const data = this.statResult;
            let periodHabilitationsHistory = [];
            let totalHabilitationsHistory = [];
            data.forEach(collecte => {
                if (totalHabilitationsHistory.findIndex(id => id == collecte['habilitation_id']) == -1) {
                    totalHabilitationsHistory.push(collecte['habilitation_id']);
                    if (collecte['date_done']>=this.requeteStat.dd && collecte['date_done']<=this.requeteStat.df) {
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
    components: { OperatorBarChart, OperatorPieChart, OperatorTable },
    mounted() {
        this.computeHabilitations();
    }
}
</script>

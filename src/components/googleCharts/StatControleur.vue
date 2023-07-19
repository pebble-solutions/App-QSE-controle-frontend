<template>
    <div class="row">
        <h1>Contrôleur</h1>
        <!--<div class="col-6">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Habilitations du contrôleur sur la période</h3>
                    <p>{{ currentHabilitations }}</p>
                </div>
            </div>
        </div>
        <div class="col-6">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Toutes les Habilitations du contrôleur</h3>
                    <p>{{ totalHabilitations }}</p>
                </div>
            </div>
        </div>-->
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Répartition des réponses</h3>
                    <ControlerBarChart :requeteStat="requeteStat"></ControlerBarChart>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Nombre de KN par contrôleur</h3>
                    <ControlerPieChart :requeteStat="requeteStat"></ControlerPieChart>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <ControlerTable :requeteStat="requeteStat"></ControlerTable>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ControlerBarChart from './ControlerBarChart.vue';
import ControlerPieChart from './ControlerPieChart.vue';
import ControlerTable from './ControlerTable.vue';
//import { mapState } from 'vuex';

export default {
    /*data() {
        return {
            currentHabilitations: 0,
            totalHabilitations: 0,
        }
    },*/
    props: {
        requeteStat: {
            type: Object,
            required: true
        }
    },
    /*computed: {
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
    },*/
    components: { ControlerBarChart, ControlerPieChart, ControlerTable},
    mounted(){
        //this.computeHabilitations();
    }
}
</script>

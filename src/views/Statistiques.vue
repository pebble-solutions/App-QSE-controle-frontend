<template>
    <div class="container">
        <div class="row">
            <h1>Statistiques générales</h1>
            <div class="col-3">
                <div class="card my-2">
                    <div class="card-body">
                        <h3 class="card-title fs-4">Date de début</h3>
                        <input type="date" v-model="startDate" class="form-control">
                    </div>
                </div>
            </div>
            <div class="col-3">
                <div class="card my-2">
                    <div class="card-body">
                        <h3 class="card-title fs-4">Date de fin</h3>
                        <input type="date" v-model="endDate" class="form-control">
                    </div>
                </div>
            </div>
            <div class="col-3">
                <div class="card my-2">
                    <div class="card-body">
                        <h3 class="card-title fs-4">Nombre de jours</h3>
                        <input type="number" v-model="daysDiff" class="form-control">
                    </div>
                </div>
            </div>
            <div class="col-3">
                <div class="card my-2">
                    <div class="card-body">
                        <h3 class="card-title fs-4">Nombre de mois</h3>
                        <input type="number" v-model="monthsDiff" class="form-control">

                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-9">
                <div class="card my-2 overflow-auto" ref="card">
                    <div class="card-body">
                        <h3 class="card-title fs-4">Agenda</h3>
                        <AgendaChart></AgendaChart>
                    </div>
                </div>
            </div>
            <div class="col-3">
                <div class="card my-2">
                    <div class="card-body">
                        <h3 class="card-title fs-4">Répartition des réponses</h3>
                        <GlobalPieChart></GlobalPieChart>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card my-2">
                    <div class="card-body">
                        <GlobalTable></GlobalTable>
                    </div>
                </div>
            </div>
        </div>
        <StatOperateur :currentHabilitations="currentHabilitations" :totalHabilitations="totalHabilitations">
        </StatOperateur>
        <StatHabilitation :currentHabilitations="currentHabilitations" :totalHabilitations="totalHabilitations">
        </StatHabilitation>
        <StatProjet :currentHabilitations="currentHabilitations" :totalHabilitations="totalHabilitations"></StatProjet>
        <StatControleur :currentHabilitations="currentHabilitations" :totalHabilitations="totalHabilitations">
        </StatControleur>
    </div>
</template>

<script>
import AgendaChart from '../components/googleCharts/AgendaChart.vue'
import GlobalPieChart from '../components/googleCharts/GlobalPieChart.vue'
import StatOperateur from '../components/googleCharts/StatOperateur.vue'
import StatHabilitation from '../components/googleCharts/StatHabilitation.vue'
import StatProjet from '../components/googleCharts/StatProjet.vue'
import StatControleur from '../components/googleCharts/StatControleur.vue'
import GlobalTable from '../components/googleCharts/GlobalTable.vue'

export default {
    data() {
        return {
            startDate: '',
            endDate: '',
            daysDiff: 0,
            monthsDiff: 0,
            pieChartData: {
                "labels": {
                    1: "Answer",
                    2: "Amount"
                },
                "S": 33,
                "A": 12,
                "M": 10,
                "I": 8
            },
            currentHabilitations: 3,
            totalHabilitations: 12
        }
    },
    components: { AgendaChart, GlobalPieChart, StatOperateur, StatHabilitation, StatProjet, StatControleur, GlobalTable},
    methods: {
        computeTimeDiff() {
            const startDate = new Date(this.startDate);
            const endDate = new Date(this.endDate);

            if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                const timeDiff = endDate.getTime() - startDate.getTime();
                this.daysDiff = timeDiff / (1000 * 3600 * 24);
                this.monthsDiff = timeDiff / (1000 * 3600 * 24 * 30);
                return true;
            } else {
                return false;
            }
        },
        updateEndDateFromDays() {
            const startDate = new Date(this.startDate);
            const endDate = new Date(startDate.getTime() + this.daysDiff * 24 * 60 * 60 * 1000);
            const year = endDate.getFullYear();
            const month = String(endDate.getMonth() + 1).padStart(2, '0');
            const day = String(endDate.getDate()).padStart(2, '0');
            this.endDate = `${year}-${month}-${day}`;
        },
        updateEndDateFromMonths() {
            const startDate = new Date(this.startDate);
            const newEndDate = new Date(startDate.getTime());

            // On ajoute le nombre de mois sélectionné à la date de début
            newEndDate.setMonth(startDate.getMonth() + parseInt(this.monthsDiff));

            // Si la nouvelle date de fin se trouve être après la date de début, on la met à jour
            if (!isNaN(newEndDate.getTime()) && newEndDate > startDate) {
                const year = newEndDate.getFullYear();
                const month = String(newEndDate.getMonth() + 1).padStart(2, '0');
                const day = String(newEndDate.getDate()).padStart(2, '0');
                this.endDate = `${year}-${month}-${day}`;
            } else {
                // Si la nouvelle date de fin est avant la date de début, on réinitialise le nombre de mois
                this.monthsDiff = 0;
            }
        }
    },
    watch: {
        startDate() {
            this.computeTimeDiff();
        },
        endDate() {
            this.computeTimeDiff();
        },
        daysDiff() {
            this.updateEndDateFromDays();
        },
        monthsDiff() {
            this.updateEndDateFromMonths();
        }
    }
}
</script>
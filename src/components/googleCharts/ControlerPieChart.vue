<template v-if="!pending.fetchData">
    <div id="controlerPieChart"></div>
</template>

<script>
import { GoogleCharts } from 'google-charts'
import { mapState } from 'vuex';

export default {
    data() {
        return {
            chartData: [],
            pending: {
                fetchData: true,
            },
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
        fetchData() {
            const data = this.statResult;

            this.chartData = [
                ['Réponses', 'Nombre']
            ];
            const ids = [268];

            ids.forEach(id => {
                data.forEach(collecte => {
                    if (collecte['personnel_id__controleur'] == id) {
                        const index = this.chartData.findIndex(controleur => (controleur[0] == 'Contrôleur ' + id));
                        if (index >= 0) {
                            this.chartData[index][1]++;
                        } else {
                            this.chartData.push(["Contrôleur " + id, 1]);
                        }
                    }
                });
            });
        },
        drawChart() {
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, false);
            let chartWrap = document.getElementById('controlerPieChart');
            let chart = new GoogleCharts.api.visualization.PieChart(chartWrap);
            chart.draw(dataTable);
        }
    },
    async mounted() {
        this.pending.fetchData = true;
        await this.fetchData();
        this.pending.fetchData = false;
        GoogleCharts.load(this.drawChart, {
            packages: ['corechart'],
        })
    },
}
</script>

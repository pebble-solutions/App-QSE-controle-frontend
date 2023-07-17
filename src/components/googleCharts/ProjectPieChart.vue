<template v-if="!pending.fetchData">
    <div id="projectPieChart"></div>
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
            required: true,
        }
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
            data.forEach(collecte => {
                const id = collecte['projet_id'];
                const index = this.chartData.findIndex(projet => (projet[0] == 'Projet ' + id));
                if (index >= 0) {
                    this.chartData[index][1]++;
                } else {
                    this.chartData.push(["Projet " + id, 1]);
                }
            });
        },
        drawChart() {
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, false);
            let chartWrap = document.getElementById('projectPieChart');
            let chart = new GoogleCharts.api.visualization.PieChart(chartWrap);
            let options = {
                sliceVisibilityThreshold: 1/100
            };
            chart.draw(dataTable, options);
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

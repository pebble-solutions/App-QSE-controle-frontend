<template>
    <div id="projectPieChart" :v-if="chartDataLoaded"></div>
</template>

<script>
import { GoogleCharts } from 'google-charts'

export default {

    data() {
        return {
            chartData: [],
            chartDataLoaded: false,
        }
    },
    methods: {
        async fetchData() {
            this.chartDataLoaded = false;
            let collection = this.$assets.getCollection('collectes');
            const data = collection.getCollection();

            this.chartData = [
                ['Réponses', 'Nombre']
            ];
            const ids = [1157, 1158];
            let i = 1;

            ids.forEach(id => {
                data.forEach(collecte => {
                    if (collecte['projet_id'] == id) {
                        if (this.chartData[i]) {
                            this.chartData[i][1]++;
                        } else {
                            this.chartData.push(["Projet " + id, 1]);
                        }
                    }
                });
                i++;
            });
            this.chartDataLoaded = true;
        },
        async drawChart() {
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, false);
            let chartWrap = await document.getElementById('projectPieChart');
            let chart = new GoogleCharts.api.visualization.PieChart(chartWrap);
            chart.draw(dataTable);
        }
    },
    async mounted() {
        await this.fetchData();
        GoogleCharts.load(this.drawChart, {
            packages: ['corechart'],
        })
    },
}
</script>

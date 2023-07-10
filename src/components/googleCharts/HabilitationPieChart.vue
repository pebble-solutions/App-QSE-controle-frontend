<template>
    <div id="knPieChart" :v-if="chartDataLoaded"></div>
</template>

<script>
import { GoogleCharts } from 'google-charts'

export default {
    data() {
        return {
            chartData: null,
            chartDataLoaded: false,
        }
    },
    methods: {
        async fetchData() {
            this.chartDataLoaded = false;
            let collection = this.$assets.getCollection('collectes');
            await collection.load();
            const data = collection.getCollection();

            this.chartData = [
                ['Réponses', 'Nombre']
            ];
            const ids = [728, 137];
            let i = 1;

            ids.forEach(id => {
                data.forEach(collecte => {
                    if (collecte['habilitation_id'] == id) {
                        if (this.chartData[i]) {
                            this.chartData[i][1]++;
                        } else {
                            this.chartData.push(["Habilitation " + id, 1]);
                        }
                    }
                });
                i++;
            });
            this.chartDataLoaded = true;
        },
        async drawChart() {
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, false);
            let chartWrap = await document.getElementById('knPieChart');
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

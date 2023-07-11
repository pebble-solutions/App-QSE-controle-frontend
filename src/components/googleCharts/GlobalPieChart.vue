<template>
    <div id="globalPieChart" :v-if="chartDataLoaded"></div>
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
            this.chartData = [
                ['Réponses', 'Nombre'],
                ['S', 0],
                ['A', 0],
                ['M', 0],
                ['I', 0],
            ];
            let collection = this.$assets.getCollection('collectes');
            const data = collection.getCollection();
            data.forEach(collecte => {
                switch (collecte['sami']) {
                    case 'S':
                        this.chartData[1][1]++;
                        break;
                    case 'A':
                        this.chartData[2][1]++;
                        break;
                    case 'M':
                        this.chartData[3][1]++;
                        break;
                    case 'I':
                        this.chartData[4][1]++;
                        break;
                    default:
                        break;
                }
            });
            this.chartDataLoaded = true;
        },
        async drawChart(){
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, false);
            let chartWrap = await document.getElementById('globalPieChart');
            let chart = new GoogleCharts.api.visualization.PieChart(chartWrap);
            let options = {
                colors: ['#198754', '#0074D9', '#FFC107', '#DC3545'],
            };
            chart.draw(dataTable, options);
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

<template v-if="!pending.fetchData">
    <div id="globalPieChart"></div>
</template>

<script>
import { GoogleCharts } from 'google-charts'

export default {
    data() {
        return {
            chartData: null,
        }
    },
    methods: {
        async fetchData() {
            this.chartData = [
                ['Réponses', 'Nombre'],
                ['S', 0],
                ['A', 0],
                ['M', 0],
                ['I', 0],
            ];
            const data = this.$assets.getCollection('collectesCollection').getCollection();
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
        },
        drawChart() {
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, false);
            let chartWrap = document.getElementById('globalPieChart');
            let chart = new GoogleCharts.api.visualization.PieChart(chartWrap);
            let options = {
                colors: ['#198754', '#0074D9', '#FFC107', '#DC3545'],
            };
            chart.draw(dataTable, options);
        }
    },
    mounted() {
        this.fetchData();
        GoogleCharts.load(this.drawChart, {
            packages: ['corechart'],
        })
    },
}
</script>

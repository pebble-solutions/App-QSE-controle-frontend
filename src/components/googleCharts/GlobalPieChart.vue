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
        fetchData() {
            this.chartData = [
                ['Réponses', 'Nombre'],
                ['S', 0],
                ['A', 0],
                ['M', 0],
                ['I', 0],
                ['Inconnu', 0],
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
                        this.chartData[5][1]++;
                        break;
                }
            });
        },
        drawChart() {
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, false);
            let chartWrap = document.getElementById('globalPieChart');
            let chart = new GoogleCharts.api.visualization.PieChart(chartWrap);
            let options = {
                colors: ['#198754', '#0074D9', '#FFC107', '#DC3545', '#6C757D'],
            };
            chart.draw(dataTable, options);
        }
    },
    mounted() {
        this.fetchData();
        GoogleCharts.load(this.drawChart, {
            packages: ['corechart'],
        });

        window.addEventListener("resize", this.drawChart)
    },
}
</script>

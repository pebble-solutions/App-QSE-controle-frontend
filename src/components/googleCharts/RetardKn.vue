<template v-if="!pending.fetchData">
    <div id="retardPieChart"></div>
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
                ['En retard', 0],
                ['À l\'heure', 0],
            ];
            const data = this.$assets.getCollection('collectesCollection').getCollection();
            const lateKn = data.filter(collecte => collecte.date_prevue.split(' ')[0] < collecte.date_done.split(' ')[0]);
            this.chartData[0][1] = lateKn.length;
            this.chartData[1][1] = data.length - lateKn.length;
        },
        drawChart() {
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, true);
            let chartWrap = document.getElementById('retardPieChart');
            let chart = new GoogleCharts.api.visualization.PieChart(chartWrap);
            let options = {
                colors: ['#dc3545', '#198754'],
            };
            chart.draw(dataTable, options);
        }
    },
    mounted() {
        this.fetchData();
        GoogleCharts.load(this.drawChart, {
            packages: ['corechart'],
        });

        window.addEventListener("resize", this.drawChart);
    }
}
</script>
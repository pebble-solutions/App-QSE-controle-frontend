<template v-if="!pending.fetchData">
    <div id="projectPieChart"></div>
</template>

<script>
import { GoogleCharts } from 'google-charts'

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
    methods: {
        fetchData() {
            let collection = this.$assets.getCollection('collectes');
            const data = collection.getCollection();

            this.chartData = [
                ['Réponses', 'Nombre']
            ];
            const ids = this.requeteStat.projets;

            ids.forEach(id => {
                data.forEach(collecte => {
                    if (collecte['projet_id'] == id) {
                        const index = this.chartData.findIndex(projet => ( projet[0] == 'Projet ' + id));
                        if (index >= 0) {
                            this.chartData[index][1]++;
                        } else {
                            this.chartData.push(["Projet " + id, 1]);
                        }
                    }
                });
            });
        },
        drawChart() {
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, false);
            let chartWrap = document.getElementById('projectPieChart');
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

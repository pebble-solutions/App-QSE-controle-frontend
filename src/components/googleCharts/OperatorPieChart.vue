<template v-if="!pending.fetchData">
    <div id="operatorPieChart"></div>
</template>

<script>
import { GoogleCharts } from 'google-charts'

export default {
    data() {
        return {
            chartData: null,
            pending: {
                fetchData: true,
            }
        }
    },
    props: {
        requeteStat: {
            type: Object,
            required: true
        }
    },
    watch: {
        requeteStat() {
            this.fetchData();
        }
    },
    methods: {
        fetchData() {
            let collection = this.$assets.getCollection('collectes');
            const data = collection.getCollection();

            this.chartData = [
                ['Réponses', 'Nombre']
            ];
            const ids = this.requeteStat.operateurs;

            ids.forEach(id => {
                data.forEach(collecte => {
                    if (collecte['personnel_id__operateur'] == id) {
                        const index = this.chartData.findIndex(operateur => (operateur[0] == 'Opérateur ' + id));
                        if (index >= 0) {
                            this.chartData[index][1]++;
                        } else {
                            this.chartData.push(["Opérateur " + id, 1]);
                        }
                    }
                });
            });
        },
        drawChart() {
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, false);
            let chartWrap = document.getElementById('operatorPieChart');
            let chart = new GoogleCharts.api.visualization.PieChart(chartWrap);
            chart.draw(dataTable);
        }
    },
    mounted() {
        this.pending.fetchData = true;
        this.fetchData();
        this.pending.fetchData = false;
        GoogleCharts.load(this.drawChart, {
            packages: ['corechart'],
        })

    },
}
</script>

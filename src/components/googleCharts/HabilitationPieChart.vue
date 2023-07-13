<template v-if="!pending.fetchData">
    <div id="knPieChart"></div>
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
            const ids = this.requeteStat.habilitation;

            ids.forEach(id => {
                data.forEach(collecte => {
                    if (collecte['habilitation_id'] == id) {
                        const index = this.chartData.findIndex(habilitation => ( habilitation[0] == 'Habilitation ' + id ));
                        if (index >= 0) {
                            this.chartData[index][1]++;
                        } else {
                            this.chartData.push(["Habilitation " + id, 1]);
                        }
                    }
                });
            });
        },
        drawChart() {
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, false);
            let chartWrap = document.getElementById('knPieChart');
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

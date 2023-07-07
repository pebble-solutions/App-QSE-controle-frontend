<template>
    <div id="agendaChart"></div>
</template>

<script>
import { GoogleCharts } from 'google-charts';

export default {
    data() {
        return {
            chartData: [],
            chartDataLoaded: false,
        }
    },
    methods: {
        async fetchData() {
            let collection = this.$assets.getCollection('collectes');
            await collection.load();
            const data = collection.getCollection();

            const dateOccurrences = {};
            for (const element of data) {
                if (element['date'] != null) {
                    const date = element['date'].split(' ')[0];
                    dateOccurrences[date] = dateOccurrences[date] ? dateOccurrences[date] + 1 : 1;
                }
            }

            this.chartData = [];
            for (const key in dateOccurrences) {
                let subArray = [new Date(key), dateOccurrences[key]];
                this.chartData.push(subArray);
            }
            this.chartDataLoaded = true;
        },

        drawChart() {
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, true);
            let chartWrap = document.getElementById('agendaChart');
            let chart = new GoogleCharts.api.visualization.Calendar(chartWrap);
            chart.draw(dataTable);
        }
    },

    async mounted() {
        await this.fetchData();
        GoogleCharts.load(this.drawChart, {
            packages: ['calendar'],
        });
    }
}
</script>

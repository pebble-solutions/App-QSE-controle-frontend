<template v-if="!pending.fetchData">
    <div id="agendaChart"></div>
</template>

<script>
import { GoogleCharts } from 'google-charts';

export default {
    data() {
        return {
            chartData: [],
        }
    },
    methods: {
        fetchData() {
            const data = this.$assets.getCollection('collectesCollection').getCollection();
            const dateOccurrences = {};
            data.forEach(element => {
                if (element['date_done'] != null) {
                    const date = element['date_done'].split(' ')[0];
                    dateOccurrences[date] = dateOccurrences[date] ? dateOccurrences[date] + 1 : 1;
                }
            });
        
            this.chartData = [];

            for (const key in dateOccurrences) {
                let subArray = [new Date(key), dateOccurrences[key]];
                this.chartData.push(subArray);
            }
        },

        drawChart() {
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, true);
            let chartWrap = document.getElementById('agendaChart');
            let chart = new GoogleCharts.api.visualization.Calendar(chartWrap);
            let options = {
                height: 460
            };
            chart.draw(dataTable, options);
        }
    },

    mounted() {
        this.fetchData();
        GoogleCharts.load(this.drawChart, {
            packages: ['calendar'],
        });
    }
}
</script>

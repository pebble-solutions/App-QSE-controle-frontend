<template v-if="!pending.fetchData">
    <div id="agendaChart"></div>
</template>

<script>
import { GoogleCharts } from 'google-charts';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            chartData: [],
            pending: {
                fetchData: true,
            },
        }
    },
    computed: {
        ...mapState(['statResult'])
    },
    methods: {
        fetchData() {
            const data = this.statResult;

            const dateOccurrences = {};
            for (const element of data) {
                if (element['date_done'] != null) {
                    const date = element['date_done'].split(' ')[0];
                    dateOccurrences[date] = dateOccurrences[date] ? dateOccurrences[date] + 1 : 1;
                }
            }

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
            chart.draw(dataTable);
        }
    },

    async mounted() {
        this.pending.fetchData = true;
        await this.fetchData();
        this.pending.fetchData = false;
        GoogleCharts.load(this.drawChart, {
            packages: ['calendar'],
        });
    }
}
</script>

<template :v-if="!pending.fetchData">
    <div id="knBarChart"></div>
</template>

<script>
import { GoogleCharts } from 'google-charts'
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
    props: {
        requeteStat: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapState(['statResult'])
    },
    methods: {
        async fetchData() {

            const data = this.statResult;

            this.chartData = [['Habilitations', 'S', 'A', 'M', 'I']];

            const ids = this.requeteStat.habilitation;

            for (const id of ids) {
                data.forEach(collecte => {
                    if (collecte['habilitation_id'] == id) {
                        const index = this.chartData.findIndex(habilitation => (habilitation[0] == 'Habilitation ' + id));
                        switch (collecte['sami']) {
                            case 'S':
                                if (index >= 0) {
                                    this.chartData[index][1]++;
                                } else {
                                    this.chartData.push(['Habilitation ' + id, 1, 0, 0, 0]);
                                }
                                break;
                            case 'A':
                                if (index >= 0) {
                                    this.chartData[index][2]++;
                                } else {
                                    this.chartData.push(['Habilitation ' + id, 0, 1, 0, 0]);
                                }
                                break;
                            case 'M':
                                if (index >= 0) {
                                    this.chartData[index][3]++;
                                } else {
                                    this.chartData.push(['Habilitation ' + id, 0, 0, 1, 0]);
                                }
                                break;
                            case 'I':
                                if (index >= 0) {
                                    this.chartData[index][4]++;
                                } else {
                                    this.chartData.push(['Habilitation ' + id, 0, 0, 0, 1]);
                                }
                                break;
                            default:
                                break;
                        }
                    }
                });
            }
            this.chartDataLoaded = true;
        },
        drawChart() {
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, false);
            let chartWrap = document.getElementById('knBarChart');
            let chart = new GoogleCharts.api.visualization.BarChart(chartWrap);
            let options = {
                isStacked: 'percent',
                colors: ['#198754', '#0074D9', '#FFC107', '#DC3545'],
            };
            chart.draw(dataTable, options);
        }
    },
    async mounted() {
        this.pending.fetchData = true;
        await this.fetchData();
        this.pending.fetchData = false;
        GoogleCharts.load(this.drawChart, {
            packages: ['corechart'],
        });
    },
}
</script>

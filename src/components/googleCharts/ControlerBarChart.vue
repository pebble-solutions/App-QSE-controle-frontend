<template v-if="!pending.fetchData">
    <div id="controlerBarChart"></div>
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
    computed: {
        ...mapState(['statResult'])
    },
    props: {
        requeteStat: {
            type: Object,
            required: true
        },
    },
    methods: {
        fetchData() {
            const data = this.statResult;

            this.chartData = [['Contrôleurs', 'S', 'A', 'M', 'I']];

            const ids = this.requeteStat.controleurs;
            for (const id of ids) {
                data.forEach(collecte => {
                    if (collecte['personnel_id__controleur'] == id) {
                        const index = this.chartData.findIndex(controleur => (controleur[0] == 'Contrôleur ' + id));
                        switch (collecte['sami']) {
                            case 'S':
                                if (index >= 0) {
                                    this.chartData[index][1]++;
                                } else {
                                    this.chartData.push(['Contrôleur ' + id, 1, 0, 0, 0]);
                                }
                                break;
                            case 'A':
                                if (index >= 0) {
                                    this.chartData[index][2]++;
                                } else {
                                    this.chartData.push(['Contrôleur ' + id, 0, 1, 0, 0]);
                                }
                                break;
                            case 'M':
                                if (index >= 0) {
                                    this.chartData[index][3]++;
                                } else {
                                    this.chartData.push(['Contrôleur ' + id, 0, 0, 1, 0]);
                                }
                                break;
                            case 'I':
                                if (index >= 0) {
                                    this.chartData[index][4]++;
                                } else {
                                    this.chartData.push(['Contrôleur ' + id, 0, 0, 0, 1]);
                                }
                                break;
                            default:
                                break;
                        }
                    }
                });
            }
        },
        drawChart() {
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, false);
            let chartWrap = document.getElementById('controlerBarChart');
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

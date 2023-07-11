<template>
    <div id="controlerBarChart" :v-if="chartDataLoaded"></div>
</template>

<script>
import { GoogleCharts } from 'google-charts'

export default {
    data() {
        return {
            chartData: [],
            chartDataLoaded: false,
        }
    },
    methods: {
        async fetchData() {
            this.chartDataLoaded = false;
            let collection = this.$assets.getCollection('collectes');
            const data = collection.getCollection();

            this.chartData = [['Contrôleurs', 'S', 'A', 'M', 'I']];

            const ids = [268, 133];
            let i = 1;
            for (const id of ids) {
                data.forEach(collecte => {
                    if (collecte['personnel_id__controleur'] == id) {
                        switch (collecte['sami']) {
                            case 'S':
                                if (this.chartData[i]) {
                                    this.chartData[i][1]++;
                                } else {
                                    this.chartData.push(['Contrôleur ' + id, 1, 0, 0, 0]);
                                }
                                break;
                            case 'A':
                                if (this.chartData[i]) {
                                    this.chartData[i][2]++;
                                } else {
                                    this.chartData.push(['Contrôleur ' + id, 0, 1, 0, 0]);
                                }
                                break;
                            case 'M':
                                if (this.chartData[i]) {
                                    this.chartData[i][3]++;
                                } else {
                                    this.chartData.push(['Contrôleur ' + id, 0, 0, 1, 0]);
                                }
                                break;
                            case 'I':
                                if (this.chartData[i]) {
                                    this.chartData[i][4]++;
                                } else {
                                    this.chartData.push(['Contrôleur ' + id, 0, 0, 0, 1]);
                                }
                                break;
                            default:
                                break;
                        }
                    }
                });
                i++;
            }
            this.chartDataLoaded = true;
        },
        async drawChart() {
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, false);
            let chartWrap = await document.getElementById('controlerBarChart');
            let chart = new GoogleCharts.api.visualization.BarChart(chartWrap);
            let options = {
                isStacked: 'percent',
            };
            chart.draw(dataTable, options);
        }
    },
    async mounted() {
        await this.fetchData();
        GoogleCharts.load(this.drawChart, {
            packages: ['corechart'],
        });
    },
}
</script>

<template>
    <div id="operatorBarChart" :v-if="chartDataLoaded"></div> {{ requeteStat }}
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
    props: {
        requeteStat: {
            type: Object,
            required: true
        }
    },
    methods: {
        async fetchData() {
            this.chartDataLoaded = false;
            let collection = this.$assets.getCollection('collectes');
            const data = collection.getCollection();

            console.log("before : ", this.chartData);
            console.log("between : ", this.chartData);
            this.chartData.push(['Opérateurs', 'S', 'A', 'M', 'I']);
            console.log("after : ",this.chartData);
            console.log(this.requeteStat,'requeteStat')
            let i = 1;
            for (const id of this.requeteStat.operateurs) {
                data.forEach(collecte => {
                    if (collecte['personnel_id__operateur'] == id) {
                        switch (collecte['sami']) {
                            case 'S':
                                if (this.chartData[i]) {
                                    this.chartData[i][1]++;
                                } else {
                                    this.chartData.push(['Opérateur ' + id, 1, 0, 0, 0]);
                                }
                                break;
                            case 'A':
                                if (this.chartData[i]) {
                                    this.chartData[i][2]++;
                                } else {
                                    this.chartData.push(['Opérateur ' + id, 0, 1, 0, 0]);
                                }
                                break;
                            case 'M':
                                if (this.chartData[i]) {
                                    this.chartData[i][3]++;
                                } else {
                                    this.chartData.push(['Opérateur ' + id, 0, 0, 1, 0]);
                                }
                                break;
                            case 'I':
                                if (this.chartData[i]) {
                                    this.chartData[i][4]++;
                                } else {
                                    this.chartData.push(['Opérateur ' + id, 0, 0, 0, 1]);
                                }
                                break;
                            default:
                                break;
                        }
                    }
                });
                i++;
            }
            console.log(this.chartData,'endfetch')
            this.chartDataLoaded = true;
        },
        async drawChart() {
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, false);
            let chartWrap = await document.getElementById('operatorBarChart');
            let chart = new GoogleCharts.api.visualization.BarChart(chartWrap);
            let options = {
                isStacked: 'percent',
                colors: ['#198754', '#0074D9', '#FFC107', '#DC3545'],
            };
            chart.draw(dataTable, options);
        }
    },
    async mounted() {
        await this.fetchData();
        console.log(this.chartData, 'mounted')
        GoogleCharts.load(this.drawChart, {
            packages: ['corechart'],
        });
    },
}
</script>

<template v-if="!pending.fetchData">
    <div id="operatorBarChart"></div>
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
        },
    },
    computed: {
        ...mapState(['statResult', 'personnels'])
    },
    methods: {
        fetchData() {
            const data = this.statResult;

            this.chartData = [['Opérateurs', 'S', 'A', 'M', 'I']];

            data.forEach(collecte => {
                    const id = collecte['personnel_id__operateur'];
                    const index = this.chartData.findIndex(operateur => (operateur[0] == id));
                    switch (collecte['sami']) {
                        case 'S':
                            if (index >= 0) {
                                this.chartData[index][1]++;
                            } else {
                                this.chartData.push([id, 1, 0, 0, 0]);
                            }
                            break;
                        case 'A':
                            if (index >= 0) {
                                this.chartData[index][2]++;
                            } else {
                                this.chartData.push([id, 0, 1, 0, 0]);
                            }
                            break;
                        case 'M':
                            if (index >= 0) {
                                this.chartData[index][3]++;
                            } else {
                                this.chartData.push([id, 0, 0, 1, 0]);
                            }
                            break;
                        case 'I':
                            if (index >= 0) {
                                this.chartData[index][4]++;
                            } else {
                                this.chartData.push([id, 0, 0, 0, 1]);
                            }
                            break;
                        default:
                            break;
                    }
            });
        },
        drawChart() {
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, false);
            let chartWrap = document.getElementById('operatorBarChart');
            let chart = new GoogleCharts.api.visualization.BarChart(chartWrap);

            var chartAreaHeight = this.chartData.length * 30;
            var chartHeight = chartAreaHeight + 80;

            let options = {
                isStacked: 'percent',
                colors: ['#198754', '#0074D9', '#FFC107', '#DC3545'],
                height: chartHeight,
                chartArea: {
                    height: chartAreaHeight,
                },
            };
            chart.draw(dataTable, options);
        },
        getOperatorById(){
            let personnels = this.personnels;
            this.chartData.forEach(chartDataRow => {
                const personnel = personnels.find(personnel => personnel.id === chartDataRow[0]);
                if(personnel != null){
                    chartDataRow[0] = personnel.cache_nom + " " + personnel.matricule;
                }else {
                    chartDataRow[0] = 'Opérateur ' + chartDataRow[0];
                }
            });
        }
    },
    async mounted() {
        this.pending.fetchData = true;
        await this.fetchData();
        this.getOperatorById();
        this.pending.fetchData = false;
        GoogleCharts.load(this.drawChart, {
            packages: ['corechart'],
        });
    },
}
</script>

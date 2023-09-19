<template v-if="!pending.fetchData">
    <div id="controlerBarChart"></div>
</template>

<script>
import { GoogleCharts } from 'google-charts'

export default {
    data() {
        return {
            chartData: [],
        }
    },
    props: {
        requeteStat: {
            type: Object,
            required: true
        },
    },
    methods: {
        fetchData() {
            const data = this.$assets.getCollection('collectesCollection').getCollection();

            this.chartData = [['Contrôleurs', 'S', 'A', 'M', 'I']];

            data.forEach(collecte => {
                const id = collecte['personnel_id__controleur'];
                const index = this.chartData.findIndex(controleur => (controleur[0] == this.getControlerCacheNomById(id)));
                switch (collecte['sami']) {
                    case 'S':
                        if (index >= 0) {
                            this.chartData[index][1]++;
                        } else {
                            this.chartData.push([this.getControlerCacheNomById(id), 1, 0, 0, 0]);
                        }
                        break;
                    case 'A':
                        if (index >= 0) {
                            this.chartData[index][2]++;
                        } else {
                            this.chartData.push([this.getControlerCacheNomById(id), 0, 1, 0, 0]);
                        }
                        break;
                    case 'M':
                        if (index >= 0) {
                            this.chartData[index][3]++;
                        } else {
                            this.chartData.push([this.getControlerCacheNomById(id), 0, 0, 1, 0]);
                        }
                        break;
                    case 'I':
                        if (index >= 0) {
                            this.chartData[index][4]++;
                        } else {
                            this.chartData.push([this.getControlerCacheNomById(id), 0, 0, 0, 1]);
                        }
                        break;
                    default:
                        break;
                }
            });
        },
        drawChart() {
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, false);
            let chartWrap = document.getElementById('controlerBarChart');
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
		getControlerCacheNomById(id) {
			let personnels = this.$assets.getCollection('personnels').getCollection();
			const personnel = personnels.find(e => e.id == id);
			return personnel ? personnel.label : 'Contrôleur (' + id + ') non trouvé'
		}
    },
    mounted() {
        this.fetchData();
        this.getOperatorById();
        GoogleCharts.load(this.drawChart, {
            packages: ['corechart'],
        });
        window.addEventListener("resize", this.drawChart);
    },
}
</script>

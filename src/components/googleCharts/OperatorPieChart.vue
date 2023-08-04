<template v-if="!pending.fetchData">
    <div id="operatorPieChart"></div>
</template>

<script>
import { GoogleCharts } from 'google-charts'

export default {
    data() {
        return {
            chartData: null,
        }
    },
    props: {
        requeteStat: {
            type: Object,
            required: true
        }
    },
    watch: {
        requeteStat() {
            this.fetchData();
        }
    },
    methods: {
        fetchData() {
            const data = this.$assets.getCollection('collectesCollection').getCollection();

            this.chartData = [
                ['Réponses', 'Nombre']
            ];

            data.forEach(collecte => {
                const id = collecte['personnel_id__operateur'];
                const index = this.chartData.findIndex(operateur => (operateur[0] == this.getOperatorCacheNomById(id)));
                if (index >= 0) {
                    this.chartData[index][1]++;
                } else {
                    this.chartData.push([this.getOperatorCacheNomById(id), 1]);
                }

            });
        },
        drawChart() {
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, false);
            let chartWrap = document.getElementById('operatorPieChart');
            let chart = new GoogleCharts.api.visualization.PieChart(chartWrap);
            let options = {
                sliceVisibilityThreshold: 1 / 100
            };
            chart.draw(dataTable, options);
        },
        getOperatorCacheNomById(id) {
			let personnels = this.$assets.getCollection('personnels').getCollection();
			const personnel = personnels.find(e => e.id == id);
			return personnel ? personnel.cache_nom : 'Opérateur (' + id + ') non trouvé'
		},
    },
    mounted() {
        this.fetchData();
        GoogleCharts.load(this.drawChart, {
            packages: ['corechart'],
        })

    },
}
</script>

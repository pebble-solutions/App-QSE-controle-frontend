<template v-if="!pending.fetchData">
    <div id="controlerPieChart"></div>
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

            this.chartData = [
                ['Réponses', 'Nombre']
            ];
            data.forEach(collecte => {
                const id = collecte['personnel_id__controleur'];
                const index = this.chartData.findIndex(controleur => (controleur[0] == this.getControlerCacheNomById(id)));
                if (index >= 0) {
                    this.chartData[index][1]++;
                } else {
                    this.chartData.push([this.getControlerCacheNomById(id), 1]);
                }
            });
        },
        drawChart() {
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, false);
            let chartWrap = document.getElementById('controlerPieChart');
            let chart = new GoogleCharts.api.visualization.PieChart(chartWrap);
            let options = {
                sliceVisibilityThreshold: 1/100
            };
            chart.draw(dataTable, options);
        },
		getControlerCacheNomById(id) {
			let personnels = this.$assets.getCollection('personnels').getCollection();
			const personnel = personnels.find(e => e.id == id);
			return personnel ? personnel.cache_nom : 'Contrôleur (' + id + ') non trouvé'
		}
    },
    mounted() {
        this.fetchData();
        GoogleCharts.load(this.drawChart, {
            packages: ['corechart'],
        });
        window.addEventListener("resize", this.drawChart);
    },
}
</script>

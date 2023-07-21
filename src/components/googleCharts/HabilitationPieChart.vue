<template v-if="!pending.fetchData">
    <div id="knPieChart"></div>
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
            required: true,
        }
    },
    methods: {
        fetchData() {
            const data = this.$assets.getCollection('collectesCollection').getCollection();

            this.chartData = [
                ['Réponses', 'Nombre']
            ];
            data.forEach(collecte => {
                const id = collecte['habilitation_id'];
                const index = this.chartData.findIndex(habilitation => (habilitation[0] == this.getHabilitaitonLabelById(id)));
                if (index >= 0) {
                    this.chartData[index][1]++;
                } else {
                    this.chartData.push([this.getHabilitaitonLabelById(id), 1]);
                }

            });
        },
        drawChart() {
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, false);
            let chartWrap = document.getElementById('knPieChart');
            let chart = new GoogleCharts.api.visualization.PieChart(chartWrap);
            let options = {
                sliceVisibilityThreshold: 1/100
            };
            chart.draw(dataTable, options);
        },
        getHabilitaitonLabelById(id) {
			let habilitations = this.$assets.getCollection('habilitationsCharacteristic').getCollection();
			const habilitation = habilitations.find(e => e.id == id);
			return habilitation ? habilitation.label : 'Habilitation (' + id + ') non trouvé'
		}
    },
    mounted() {
        this.fetchData();
        GoogleCharts.load(this.drawChart, {
            packages: ['corechart'],
        })

    },
}
</script>

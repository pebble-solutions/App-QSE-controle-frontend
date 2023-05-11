<template>
    <div class="container card m-2">
        <div class="card-header">
            <h3>Statistiques {opérateur}</h3>
        </div>
        <div class="card-body" id="piechart2" style="width:100%;"></div>
    </div>
</template>
<script>

import { mapState } from 'vuex';
import {GoogleCharts} from 'google-charts';

export default {

    computed: {
        ...mapState (['stat']),
    },

    methods: {
        drawVisualization() {
                let div = document.getElementById('piechart2');
                let datatable = [
                    ['lettre', 'nb'],
                    ['S',     11],
                    ['A',      2],
                    ['M',  2],
                    ['I', 2]
                ];

            

                let data = GoogleCharts.api.visualization.arrayToDataTable(datatable);

                let options = {
                title: 'données cumulées',
                is3D: true,
                pieSliceText: 'label',
                colors: ['green', 'lime', 'orange', 'red']
                };

                let chart = new GoogleCharts.api.visualization.PieChart(div);

                chart.draw(data, options);
                }

    },

    beforeUnmount() {
        window.removeEventListener("resize", this.drawVisualization)
    },

    mounted() {
        GoogleCharts.load(this.drawVisualization);
        window.addEventListener("resize", this.drawVisualization);
    },
}
</script>
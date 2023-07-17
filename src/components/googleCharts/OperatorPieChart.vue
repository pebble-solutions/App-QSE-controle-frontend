<template>
    <div>
        <GChart :type="type" :data="chartData" :options="options" v-if="chartDataLoaded" />
    </div>
</template>

<script>
import { GChart } from 'vue-google-charts'

export default {
    props: {
        jsonData: {
            type: Object,
            required: true
        }
    },

    components: { GChart },

    data() {
        return {
            type: "PieChart",
            chartData: null,
            chartDataLoaded: false,
            options: {}
        }
    },
    mounted() {
        this.fetchData(this.jsonData);
    },
    methods: {
        fetchData(jsonData) {
            console.log(jsonData);
            this.chartData = [
                ['Opérateurs', 'Amount'],
                ['Opérateur 1', 33],
                ['Opérateur 2', 33],
                ['Opérateur 3', 33],
                ['Opérateur 4 ', 33],
            ];
            this.chartDataLoaded = true;
        }
    }
}
</script>

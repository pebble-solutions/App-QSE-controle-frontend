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
                ['Projets', 'Amount'],
                ['Projets 1', 33],
                ['Project 2', 33],
                ['Project 3', 33],
                ['Project 4 ', 33],
            ];
            this.chartDataLoaded = true;
        }
    }
}
</script>

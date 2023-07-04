<template>
    <GChart :type="type" :data="chartData" :options="options" v-if="chartDataLoaded" />
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
            type: "BarChart",
            chartData: null,
            chartDataLoaded: false,
            options: {
                isStacked: "percent",
            },
        }
    },
    mounted() {
        this.fetchData(this.jsonData);
    },
    methods: {
        fetchData(jsonData) {
            console.log(jsonData),
                this.chartData = [
                    ['Opérateurs', 'S', 'A', 'M', 'I'],
                    ['Opérateur 1', 10, 3, 5, 2],
                ];
            this.chartDataLoaded = true;
        }
    }
}
</script>

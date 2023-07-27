<template v-if="!pending.fetchData">
    <div id="projectPieChart"></div>
</template>

<script>
import { GoogleCharts } from 'google-charts'
import { mapState } from 'vuex';

export default {
    data() {
        return {
            chartData: [],
        }
    },
    computed: {
        ...mapState(['projets'])
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
                const id = collecte['projet_id'];
                const index = this.chartData.findIndex(projet => (projet[0] == this.getProjectIntituleById(id)));
                if (index >= 0) {
                    this.chartData[index][1]++;
                } else {
                    this.chartData.push([this.getProjectIntituleById(id), 1]);
                }
            });
        },
        drawChart() {
            let dataTable = GoogleCharts.api.visualization.arrayToDataTable(this.chartData, false);
            let chartWrap = document.getElementById('projectPieChart');
            let chart = new GoogleCharts.api.visualization.PieChart(chartWrap);
            let colors = this.generateColorsTable();
            let options = {
                sliceVisibilityThreshold: 1 / 100,
                colors: colors,
            };
            chart.draw(dataTable, options);
        },
        getProjectIntituleById(id) {
            const projet = this.projets.find(e => e.id == id);
            return projet ? projet.intitule : 'Projet (' + id + ') non trouvé'
        },
        /**
 * Génère une couleur différente de celles utilisées pour le SAMI
 */
        generateColor() {
            const hexCharacters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"]
            let hexColor = "#";
            for (let i = 0; i < 6; i++) {
                const hexIndex = Math.floor(Math.random() * 16);
                hexColor += hexCharacters[hexIndex];
            }
            if (this.SAMIColor(hexColor)) {
                hexColor = this.generateColor();
            }
            return hexColor;
        },
        /**
         * Retourne vrai si la couleur donnée en paramètre correspond à une de celles utilisées pour les SAMI
         * @param {String} hexColor 
         */
        SAMIColor(hexColor) {
            switch (hexColor) {
                case '#198754'://Success
                    return true;
                case '#0d6efd'://Primary
                    return true;
                case '#ffc107'://Warning
                    return true;
                case '#dc3545'://Danger
                    return true;
                default:
                    return false;
            }
        },
        generateColorsTable() {
            let colors = [];
            for (let i = 0; i < this.chartData.length - 1; i++) {
                colors.push(this.generateColor());
            }
            return colors;
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

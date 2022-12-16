<template>
    <div>

        <div class="row">
            <div class="col-12 col-md-6">
                <div class="card my-2">
                    <div class="card-body">
                        <h3 class="fs-4">Répartition sur l'ensemble des contrôles</h3>
                        <div id="sami_piechart" style="width:100%; height:350px; position:relative;"></div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="card my-2">
                    <div class="card-body">
                        <h3 class="fs-4">Répartition par formulaires</h3>
                        <div id="chart_formulaires" style="width:100%; position:relative;"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12 col-md-6">
                <div class="card my-2">
                    <div class="card-body">
                        <h3 class="fs-4">Répartition par contrôles réalisés</h3>
                        <div id="chart_collectes" style="width:100%; position:relative;"></div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="card my-2">
                    <div class="card-body">
                        <h3 class="fs-4">Répartition par questions</h3>
                        <div id="chart_questions" style="width:100%; position:relative;"></div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import { GoogleCharts } from 'google-charts';
export default {

    props: {
        stats: Object
    },

    data() {
        return {
            chartColors: ['#28a745', '#007bff', '#ffc107', '#dc3545']
        }
    },

    watch: {
        stats() {
            this.drawCharts();
        }
    },

    methods: {
        sami_global_piechart() {
            let div = document.getElementById('sami_piechart');

            // Création des données depuis les statistiques
            let datatable = [
                ['lettre', 'nombre']
            ];

            let stats = this.stats.type?.sami;

            if (stats) {
                let lettres = ['S', 'A', 'M', 'I'];
    
                lettres.forEach(l => {
                    let qte = this.unifyQteFromSAMI(stats, l);
                    datatable.push([l, qte]);
                });
            }

            let data = GoogleCharts.api.visualization.arrayToDataTable(datatable);

            var options = {
                colors: this.chartColors,
                pieHole: 0.5
            };

            let chart = new GoogleCharts.api.visualization.PieChart(div);

            chart.draw(data, options);
        },

        /**
         * Dessine un graphique en barre google dans un élément HTML
         * 
         * @param {string} element_id ID de l'élément HTML contenant le graphique
         * @param {string} label Libellé du graphique affiché
         * @param {object} data Statistiques retournées par l'API
         */
        sami_bar_chars(element_id, label, data) {
            let div = document.getElementById(element_id);
            let datatable = [
                [ label, "S", "A", "M", "I" ]
            ];

            if (data) {
                for (const key in data) {
                    let stat = data[key];
                    let sami = stat.sami;

                    if (sami) {
                        let lettres = ['S', 'A', 'M', 'I'];

                        let row = [stat.intitule];
            
                        lettres.forEach(l => {
                            row.push(this.unifyQteFromSAMI(sami, l));
                        });

                        datatable.push(row);
                    }
                }
            }

            let data2 = GoogleCharts.api.visualization.arrayToDataTable(datatable);

            let options = {
                isStacked: 'percent',
                colors: this.chartColors,
                legend: { position: 'top', maxLines: 4 },
            };
            let chart = new GoogleCharts.api.visualization.BarChart(div);
            chart.draw(data2, options);
        },

        /**
         * Retourne la quantité d'une lettre d'un SAMI indépendemment de la case.
         * 
         * @param {object} sami Statistiques S A M I ou s a m i
         * @param {string} letter Lettre à récupérer en majuscule
         * 
         * @return {number}
         */
        unifyQteFromSAMI(sami, letter) {
            let qte = 0;
            if (sami[letter]) qte += parseInt(sami[letter]);
            if (sami[letter.toLowerCase()]) qte += parseInt(sami[letter.toLowerCase()]);
            return qte;
        },

        /**
         * Dessine l'ensemble des graphiques.
         */
        drawCharts() {
            this.sami_global_piechart();
            this.sami_bar_chars('chart_collectes', 'Collecte', this.stats.collecte);
            this.sami_bar_chars('chart_formulaires', 'Formulaire', this.stats.formulaire);
            this.sami_bar_chars('chart_questions', 'Question', this.stats.question);
        }
    },

    beforeUnmount() {
        window.removeEventListener("resize", this.drawCharts);
    },

    updated() {
        this.drawCharts();
    },

    mounted() {
        GoogleCharts.load(this.drawCharts);
        window.addEventListener("resize", this.drawCharts);
    }
}
</script>
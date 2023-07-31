<template>
    

    <div class="position-relative border-bottom border-secondary" :style="{height : tableHeightPx, width : tableWidthPx}">

        <div class="table-grid" :style="{width : tableWidthPx}">
            <div v-for="n in gridRows" class="table-row border border-secondary" :key="n" :style="{ top: getTopPosition(n, 'px', 2) }"></div>
            <div v-for="n in gridCols" class="table-col border border-secondary" :key="n" :style="{ left: getLeftPosition(n, 'px', 2) }"></div>
        </div>

        <div class="table-content" :style="{width : tableWidthPx}">
            <div class="table-row-content" :style="{top: getTopPosition(1, 'px')}">
                <div class="table-header mx-2">
                    <strong>{{ headerLabel }}</strong>
                </div>
                <div class="position-absolute text-center" 
                    :style="{ left:getLeftPosition(index+1, 'px'), width: columnWidthPx }" 
                    style="top: 0px" 
                    v-for="(week, index) in weeks" 
                    :key="index"
                    >

                    <div class="pt-1 fs-7 text-muted">{{ week.year }}</div>
                    <div>S{{ week.week }}</div>

                </div>
            </div>

            <slot></slot>
        </div>
    </div>

</template>

<style lang="scss" scoped>
@import "./grid.scss";
</style>

<script>
import { WeeksGrid } from '../../js/grid/WeeksGrid';

export default {
    props: {
        grid: WeeksGrid,
        headerLabel: String
    },

    computed: {
        /**
         * Retourne la hauteur complète du tableau en pixel
         * 
         * @return {string}
         */
        tableHeightPx() {
            return this.grid.getTableHeight("px");
        },

        /**
         * Retourne la largeur complète du tableau en pixel
         * 
         * @return {string}
         */
        tableWidthPx() {
            return this.grid.getTableWidth("px");
        },

        /**
         * Retourne la largeur de colonne en pixel
         * 
         * @return {string}
         */
        columnWidthPx() {
            return `${this.grid.columnWidth}px`;
        },

        /**
         * Retourne le nombre de lignes à tracer, incluant l'entête
         * 
         * @return {number}
         */
        gridRows() {
            return Math.trunc((this.grid.rows +1) / 2);
        },

        /**
         * Retourne le nombre de colonne à tracer incluant l'entête
         * 
         * @return {number}
         */
        gridCols() {
            return Math.round(this.weeks.length / 2);
        },

        /**
         * Retourne la liste des semaine
         * 
         * @return {array}
         */
        weeks() {
            return this.grid.getWeeks();
        }
    },

    methods: {
        /**
         * Retourne la position d'une ligne depuis le haut du tableau
         * 
         * @param {number} n Index de la ligne
         * @param {string} sx Suffix à ajouter à la valeur (ex : "px")
         * @param {number} coef Coeficient (2 = une ligne sur deux)
         * 
         * @return {string|number}
         */
        getTopPosition(n, sx, coef) {
            return this.grid.getTopPosition(n, sx, coef);
        },

        /**
         * Retourne la position d'une colonne depuis la gauche du tableau
         * 
         * @param {number} n Index de la colonne
         * @param {string} sx Suffix à ajouter à la valeur (ex : "px")
         * @param {number} coef Coeficient (2 = une colonne sur deux)
         * 
         * @return {string|number}
         */
        getLeftPosition(n, sx, coef) {
            return this.grid.getLeftPosition(n, sx, coef);
        }
    }
}
</script>

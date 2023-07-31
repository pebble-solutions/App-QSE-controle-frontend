<template>
    
    <div class="table-row-content" :style="{ top: getTopPosition(rowIndex+2, 'px') }">
        <div class="table-header mx-2 fs-7">
            {{ rowLabel }}
        </div>

        <habilitation-timeline-bar 
            :habilitationPersonnel="habilitationPersonnel" 
            :left="getLeftPosition(getWeekStartInTimeline(habilitationPersonnel.dd) +1)"
            :width="getWidth(getWeekEndInTimeline(habilitationPersonnel.dd, habilitationPersonnel.df))"
            v-for="habilitationPersonnel in habilitationsPersonnels" 
            :key="habilitationPersonnel.id" />

        <template v-for="contrat in contrats" :key="contrat.id">
            <contrat-timeline-bar 
                :contrat="contrat"
                :left="getLeftPosition(getWeekStartInTimeline(contrat.dentree) +1)"
                :width="getWidth(getWeekEndInTimeline(contrat.dsortie_reelle ? contrat.dsortie_relle : contrat.dsortie))" 
                v-if="isContratInPeriode(contrat)" />
        </template>

        <template 
            v-for="(control, rowIndex) in controls" 
            :key="control">

            <control-timeline-result 
                :blankWidth="getWidth(getControlBlankWeeks(rowIndex))"
                :control="control"
                :left="getLeftPosition(getWeekStartInTimeline(control.date_done) +1)"
                :width="getWidth(getControlValidityWeeks(rowIndex, 26))" />
        </template>
    </div>

</template>

<style lang="scss" scoped>
@import "../grid/grid.scss";
</style>

<script>
import { diffDate } from '../../js/date';

import { WeeksGrid } from '../../js/grid/WeeksGrid';
import ContratTimelineBar from './ContratTimelineBar.vue';
import ControlTimelineResult from './ControlTimelineResult.vue';
import HabilitationTimelineBar from './HabilitationTimelineBar.vue';

export default {
    components: { HabilitationTimelineBar, ContratTimelineBar, ControlTimelineResult },
    props: {
        rowIndex: Number,
        habilitationType: Object,
        habilitationsPersonnels: Array,
        contrats: Array,
        controls: Array,
        personnel: Object,
        rowLabel: String,
        grid: WeeksGrid
    },

    methods: {
        getTopPosition(n, sx, coef) {
            return this.grid.getTopPosition(n, sx, coef);
        },

        getLeftPosition(n, sx, coef) {
            return this.grid.getLeftPosition(n, sx, coef);
        },

        getWeekStartInTimeline(refDd) {
            return this.grid.getWeekStartInTimeline(refDd);
        },

        getWeekEndInTimeline(refDd, refDf) {
            return this.grid.getWeekEndInTimeline(refDd, refDf);
        },

        getWidth(cols, sx) {
            return this.grid.getWidth(cols, sx);
        },

        /**
         * Retourne true si le contrat est entre la periode défini sinon retourne false
         * 
         * @param {object}    contrat
         * 
         * @return {string}
         */
        isContratInPeriode(contrat) {
            const dsortie = contrat.dsortie_reelle ?? contrat.dsortie;
            if (contrat.dentree >= this.grid.dateStart && contrat.dentree <= this.grid.dateEnd
                || contrat.dentree <= this.grid.dateEnd && !dsortie
                || contrat.dentree <= this.grid.dateEnd && dsortie && dsortie >= this.grid.dateEnd
                || contrat.dentree <= this.grid.dateEnd && dsortie && dsortie >= this.grid.dateStart && dsortie <= this.grid.dateEnd) {
                    return true;
            }

            return false;
        },

        /**
         * Retourne la période entre de contôles valides (période d'invalidité du KN)
         * 
         * @param {number} index                Index du contrôle dans la collection des contrôles
         * @param {number} characteristicId     Déprécié
         * 
         * @return {number}
         */
        getControlBlankWeeks(index) {
            const diff = this.getControlValidityWeeks(index) - this.getControlValidityWeeks(index, 26);
            return diff > 0 ? diff : 0;
        },

        /**
         * Retourne le nombre de semaines de validité d'un contrôle par rapport au suivant,
         * borné sur a timeline
         * 
         * @param {number} index                L'index du contrôle dans la collection des controles
         * @param {number} expirationLimit      Nombre de semaines à expiration
         * 
         * @return {number}
         */
        getControlValidityWeeks(index, expirationLimit) {
            const controls = this.controls;
            const currentControl = controls[index];
            const nextControl = controls[index+1];

            const dateStart = currentControl.date_done;
            const dateEnd = nextControl ? nextControl.date_done : this.grid.dateEnd;

            const weeks_diff = Math.ceil( diffDate(dateStart, dateEnd, 'week'));

            return weeks_diff > expirationLimit && expirationLimit ? expirationLimit : weeks_diff;
        },
    }
}
</script>

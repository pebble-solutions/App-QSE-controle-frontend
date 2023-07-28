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
            v-for="(kn, rowIndex) in getControlsByCharacteristicTypeId(habilitationType.id)" 
            :key="kn">

            <div 
                class="control-timeline bg-gradient"
                :class="[getHabilitationBg(kn)]"
                :style="{ left: getLeftPosition(getWeekStartInTimeline(kn.date_done) +1), width: getWidth(getControlValidityWeeks(rowIndex, habilitationType.id, 26), 'px') }"></div>
            
            <div 
                class="control-timeline bg-danger bg-gradient fs-7"
                :style="{ left: getLeftPosition(getWeekStartInTimeline(kn.date_done) + 1 + getControlValidityWeeks(rowIndex, habilitationType.id, 26)), width: getWidth(getControlBlankWeeks(rowIndex, habilitationType.id), 'px') }"
                v-if="getControlBlankWeeks(rowIndex, habilitationType.id)"
                title="Contrôle expiré">
            </div>

            <div 
                class="control-result-item rounded m-1" 
                :class="[classSAMI(kn.sami)]" 
                :style="{ left: getLeftPosition(getWeekStartInTimeline(kn.date_done) +1) }"
                :title="kn.date_done">{{ kn.sami }}</div>
        </template>
    </div>

</template>

<script>

import { WeeksGrid } from '../../js/grid/WeeksGrid';
import ContratTimelineBar from './ContratTimelineBar.vue';
import HabilitationTimelineBar from './HabilitationTimelineBar.vue';

export default {
    components: { HabilitationTimelineBar, ContratTimelineBar },
    props: {
        rowIndex: Number,
        habilitationType: Object,
        habilitationsPersonnels: Array,
        contrats: Array,
        collectes: Array,
        personnel: Object,
        rowLabel: String,
        grid: WeeksGrid,
        echeancier: Object
    },

    data() {
        return {
            habilitationsPersonnels: []
        }
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
            if (contrat.dentree >= this.echeancier.dd && contrat.dentree <= this.echeancier.df
                || contrat.dentree <= this.echeancier.df && !dsortie
                || contrat.dentree <= this.echeancier.df && dsortie && dsortie >= this.echeancier.df
                || contrat.dentree <= this.echeancier.df && dsortie && dsortie >= this.echeancier.dd && dsortie <= this.echeancier.df) {
                    return true;
            }

            return false;
        },
    },

    mounted() {
        this.getHabilitationsPersonnels();
    }
}
</script>

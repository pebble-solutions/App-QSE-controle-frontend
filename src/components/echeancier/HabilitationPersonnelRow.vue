<template>
    
    <div class="table-row-content" :style="{ top: getTopPosition(rowIndex+2) }">
        <div class="table-header mx-2 fs-7">
            {{ rowLabel }}
        </div>

        <div  
            class="habilitation-timeline bg-info bg-gradient bg-opacity-25 border border-info fs-7 px-2" 
            :style="{left: getLeftPosition(getWeekStartInTimeline(habilitationPersonnel.dd) +1), width: getWidth(getWeekEndInTimeline(habilitationPersonnel.dd, habilitationPersonnel.df), 'px')}" 
            :title="getHabilitationPersonnelLabel(habilitationPersonnel)" 
            
            v-for="habilitationPersonnel in getHabilitationsPersonnelByTypeId(habilitationType.id)" 
            :key="habilitationPersonnel.id">

            <span class="label-timeline">{{ getHabilitationPersonnelLabel(habilitationPersonnel) }}</span>
        </div>

        <template v-for="contrat in personnelContrats" :key="contrat.id">
            <div 
                class="contrat-timeline bg-secondary bg-gradient bg-opacity-25 border border-secondary text-secondary fs-7 px-2" 
                :style="{left: getLeftPosition(getWeekStartInTimeline(contrat.dentree) +1), width: getWidth(getWeekEndInTimeline(contrat.dsortie_reelle ? contrat.dsortie_relle : contrat.dsortie), 'px')}" 
                v-if="isContratInPeriode(contrat)" 
                :title="getContratLabel(contrat)">
                <span class="label-timeline">{{ getContratLabel(contrat) }}</span>
            </div>
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

export default {
    props: {
        rowIndex: Number,
        habilitationType: Object,
        personnel: Object,
        rowLabel: String
    },

    data() {
        return {
            habilitationsPersonnels: []
        }
    },

    methods: {
        /**
         * Récupère la liste des habilitations du personnel sur le type d'habilitation fournie
         */
        getHabilitationsPersonnels() {
            const collection = this.$assets.getCollection("habilitationsPersonnels").getCollection();
            this.habilitationsPersonnels = collection.filter(e => e.habilitation_type_id == this.habilitationType.id && e.personnel_id == this.personnel.id);
        }
    },

    mounted() {
        this.getHabilitationsPersonnels();
    }
}
</script>

<template>
    
    <div 
        class="control-timeline bg-gradient"
        :class="[getHabilitationBg(control)]"
        :style="{ left: getLeftPosition(getWeekStartInTimeline(control.date_done) +1), width: getWidth(getControlValidityWeeks(rowIndex, habilitationType.id, 26), 'px') }"></div>
    
    <div 
        class="control-timeline bg-danger bg-gradient fs-7"
        :style="{ left: getLeftPosition(getWeekStartInTimeline(control.date_done) + 1 + getControlValidityWeeks(rowIndex, habilitationType.id, 26)), width: getWidth(getControlBlankWeeks(rowIndex, habilitationType.id), 'px') }"
        v-if="getControlBlankWeeks(rowIndex, habilitationType.id)"
        title="Contrôle expiré">
    </div>

    <div 
        class="control-result-item rounded m-1" 
        :class="[classSAMI(control.sami)]" 
        :style="{ left: getLeftPosition(getWeekStartInTimeline(control.date_done) +1) }"
        :title="control.date_done">{{ control.sami }}</div>

</template>

<style lang="scss" scoped>
@import "./calendar.scss";
</style>

<script>

export default {
    props: {
        control: Object
    }
}

</script>

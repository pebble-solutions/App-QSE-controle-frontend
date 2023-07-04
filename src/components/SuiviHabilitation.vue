<template>
    <div>
        <div >
            <div class="d-flex justify-content-between align-items-center my-1">
                <div class="fw-bold">Habilitation ASP (3 ans)</div>
                <div>{{ dd }} - {{ df }}</div>
                
            </div>
            <ProgressBar :dd="dd" :df="df" />
            <div class="d-flex justify-content-between align-items-center my-1">
                <div class="fw-bold">Habilitation VEILLE (6 mois)</div>
                <div>{{ ddveille }} - {{ dfveille }}</div>
                 
            </div>
             <ProgressBar :dd="ddveille" :df="dfveille" /> 
            <GroupResult></GroupResult>
            
        </div>
    </div>
</template>

<script>
import ProgressBar from './ProgressBar.vue';
import GroupResult from './GroupResult.vue';
export default {
    components: {
        ProgressBar,
        GroupResult,
    },

    data() {
        return {
            dd: '2022-02-23',
            df: '2024-05-23',
            ddveille: '2023-02-23',
            dfveille: '2023-08-23',
        }
    }
}

</script>
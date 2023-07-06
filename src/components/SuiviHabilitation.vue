<template>
    <div>
        <div>
            <div class="d-flex justify-content-between align-content-center my-1">
                <div class="fw-bold">Habilitation ASP (3 ans)</div>
                <div>{{ formatDate(dd) }} au {{ formatDate(df) }}</div>

            </div>
            <ProgressBar :dd="dd" :df="df" />

            <GroupResult></GroupResult>
            <div class="d-flex justify-content-between align-content-center my-1">
                <div class="fw-bold">Habilitation VEILLE (180 jours)</div>
                <div class="">{{ formatDate(ddveille) }} au <span style="color: red;">{{ formatDate(dfveille) }}</span></div>

            </div>
            <ProgressBar :dd="ddveille" :df="dfveille" />


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
            dd: '2022-05-09',
            df: '2025-05-09',
            ddveille:'2023-01-03',
            dfveille: '2023-07-03',
        }
    },
    methods: {
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString();
        },
}
}

</script>
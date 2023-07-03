<template>
    <div>
        <div class="p-2">
            <div class="d-flex justify-content-between align-items-center my-4">
                <div class="fw-bold">Habilitation ASP</div>
                <div>{{ dd }} - {{ df }}</div>
            </div>

            <ProgressBar :dd="dd" :df="df" />
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
            ddveille: '2022-02-23',
            dfveille: '2022-08-23',
        }
    }
}

</script>
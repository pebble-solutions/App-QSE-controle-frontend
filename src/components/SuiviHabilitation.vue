<template>
    <div>
        <div class="p-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="fw-bold">Habilitation ASP</div>
                <div>{{ dd }} - {{ df }}</div>
            </div>
            <ProgressBar :dd="dd" :df="df" />
            <div class="d-flex justify-content-start my-3 ">
                <span class="badge bg-success me-1">S</span>
                <span class="badge bg-success me-1">S</span>
                <span class="badge bg-primary me-1">A</span>
                <span class="badge bg-warning me-1">M</span>
                <span class="badge bg-warning me-1">M</span>
                <span class="badge bg-warning me-1">M</span>
                <span class="badge bg-primary me-1">A</span>
                <span class="badge bg-success me-1">S</span>
            </div>
        </div>
    </div>
</template>

<script>
import ProgressBar from './ProgressBar.vue';
export default {
    components: {
        ProgressBar
    },

    data() {
        return {
            dd: '2022-02-23',
            df: '2024-05-23'
        }
    }
}

</script>
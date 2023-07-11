<template>
    <div class="card">
        <div class="card-body">
            <div class="fw-light text-secondary text-center mb-1 fw-bold">HABILITATION MONITEUR</div>
            <div class="row">
                <div class="col-lg-4 col-12">
                    <div class="d-flex flex-column-reverse flex-lg-row justify-content-between align-content-center my-1">
                        <div class="fw-bold order-2 order-lg-1">Validité : 3 ans</div>
                        <div class="order-1 order-lg-2">{{ formatDate(dd) }} au {{ formatDate(df) }}</div>
                    </div>
                    <ProgressBar :dd="dd" :df="df" />
                </div>
                <div class="col-lg-4 col-12 mt-2">
                    <GroupResult></GroupResult>
                </div>
                <div class="col-lg-4 col-12">
                    <div class="d-flex flex-column-reverse flex-lg-row justify-content-between align-content-center my-1">
                        <div class="fw-bold order-2 order-lg-1">Veille : 180 jours</div>
                        <div class="order-1 order-lg-2">{{ formatDate(ddveille) }} au {{ formatDate(dfveille) }}</div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <ProgressBar class="flex-grow-1 me-2" :dd="ddveille" :df="dfveille" />
                        <SablierDeJours :date="dfveille"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import GroupResult from './GroupResult.vue';
import ProgressBar from './ProgressBar.vue';
import SablierDeJours from './SablierDeJours.vue';

export default {
    data() {
        return {
            date: '2021-05-09',
            dd: '2022-05-09',
            df: '2025-05-09',
            ddveille: '2023-01-14',
            dfveille: '2023-07-14',
        };
    },
    components: {
        GroupResult,
        ProgressBar,
        SablierDeJours,
    },
    props: {
       
    },
    methods: {
        formatDate(dateString) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        },
    },
};
</script>
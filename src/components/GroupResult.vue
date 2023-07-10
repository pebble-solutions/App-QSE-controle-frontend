<template>
    <div class="d-flex align-items-center justify-content-start my-2">
        <span v-for="(value, key) in results" :key="key" 
              :class="['badge', getBadgeClass(value.result), 'me-2', 'fs-6', 'px-2', 'py-1', 'text-nowrap']">{{ value.result }}</span>
        <DernierControleBadge :resultat="resultat" :lastControlDate="lastControlDate"></DernierControleBadge>
    </div>
</template>

<script>
import DernierControleBadge from './DernierControleBadge.vue';
export default {
    data() {
        return {
            results: {
                1: {
                    result: "S",
                    label: "Satisfaisant",
                    color: "success",
                },
                2: {
                    result: "A",
                    label: "Satisfaisant",
                    color: "primary",
                },
                3: {
                    result: "M",
                    label: "Moyen",
                    color: "warning",
                },
                4: {
                    result: "I",
                    label: "Insuffisant",
                    color: "danger",
                },
            },
            resultat: 'I', // la valeur de `result` qui est passée au composant enfant.
            lastControlDate: '2023-02-01', // la valeur de `lastControlDate` qui est passée au composant enfant.
        };
    },
    methods: {
        getBadgeClass(result) {
            switch (result) {
                case "S":
                    return "bg-success text-light";
                case "A":
                    return "bg-primary text-light";
                case "M":
                    return "bg-warning text-dark";
                case "I":
                    return "bg-danger text-light";
                default:
                    return "bg-secondary text-light";
            }
        },
    },
    components: { DernierControleBadge }
};
</script>

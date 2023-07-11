<template>
        <span :class="['badge', getBadgeClass(resultat)]">
            <i class="bi bi-arrow-repeat"></i> {{ resultat || '?' }}
        </span>
</template>

<script>
export default {
    props: {
        resultat: {
            type: String,
            default: null,
        },
    },

    methods: {
        getBadgeClass(resultat) {
            switch (resultat) {
                case 'S':
                    return 'bg-success text-light';
                case 'A':
                    return 'bg-primary text-light';
                case 'M':
                    return 'bg-warning text-dark';
                case 'I':
                    return 'bg-danger text-light';
                default:
                    return 'bg-secondary text-light';
            }
        },
    },
};
</script>
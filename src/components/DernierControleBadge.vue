<template>
    <div class="d-flex align-items-center">
        <span :class="['badge', getBadgeClass(resultat), 'me-2', 'fs-6', 'text-nowrap']">{{ resultat || '?' }}</span>
        <p class="mb-0">
            <span v-if="resultat">Dernier contrôle : {{ formatDate(lastControlDate) }}</span>
            <span v-else>Pas encore contrôlé</span>
        </p>
    </div>
</template>=

<script>
export default {
    props: {
        resultat: {
            type: String,
            default: null,
        },
        lastControlDate: {
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

        formatDate(dateString) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        },
    },
};
</script>

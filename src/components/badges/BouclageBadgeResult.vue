Copy code
<template>
  <span :class="['badge', 'badge-sm', 'badge-square', getBadgeClass(resultat)]">
    <i class="bi bi-arrow-repeat"></i>
  </span>
</template>

<style scoped>
  .badge-sm {
    padding: 0.3rem;
    font-size: 0.7rem;
  }

  .badge-square {
    border-radius: 0.25rem;
  }
</style>
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
<template>
    <!-- ce span affiche un badge vert si il y a un id renseigné, et un bagde gris si le chanp id est null.-->
    <span class="badge" :class="badgeClass">
        <i class="bi bi-check-circle"></i> Kn²
    </span>
</template>

<script>
export default {
    props: {
        // 'id' est une propriété transmise au composant, qui peut être null ou non.
        id: {
            type: [String, Number, null],
            default: null,
        },
    },
    computed: {
        badgeClass() {
            // Si 'id' n'est pas null, retourne 'badge bg-success' pour rendre la badge verte.
            // Sinon, retourne 'badge bg-secondary' pour rendre la badge grise.
            if (this.id != null) {
                return 'badge bg-success';
            } else {
                return 'badge bg-secondary';
            }
        },
    },
};
</script>

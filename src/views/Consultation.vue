<template>
    <div class="my-3">
        <h1 class="fs-3 mb-3">Consultation des KN Terminés</h1>

        <div class="alert alert-info d-flex">
            <i class="bi bi-info-circle me-2"></i>
            <div>
                Utilisez cet espace pour consulter vos KN. Sélectionnez
                un type de KN dans la liste de gauche pour consulter les enregistrements.
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';


export default {
    computed: {
        ...mapState(['collecte']),
    },
}
</script>
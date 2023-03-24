<template>

<div class="d-flex align-items-center">
    <UserImage class="me-2" :name="collecte.cible_nom"></UserImage>
    <span class="me-2 d-none d-md-inline">{{collecte.cible_nom}}</span>
    <span class="fw-lighter">
        <span class="me-2">#{{collecte.id}}</span>
        <span>{{collecte.projet_label}}</span>
    </span>
</div>

</template>

<script>

import UserImage from '../pebble-ui/UserImage.vue';

export default {
    props: {
        collecte: Object
    },
    computed: {
        /**
         * Retourne le libellé du formulaire ou retourne une information non trouvée.
         *
         * @return {string}
         */
        formulaireLabel() {
            return this.collecte.formulaire?.groupe ?? "Formulaire non trouvé";
        }
    },
    components: { UserImage }
}

</script>
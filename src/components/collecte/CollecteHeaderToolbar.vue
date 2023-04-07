<template>

    <div class="d-flex align-items-center">
        <UserImage class="me-2" :name="collecte.cible_nom"></UserImage>
        <span class="me-2 d-none d-md-inline">{{collecte.cible_nom}}</span>
        <span class="me-2 fw-lighter">#{{collecte.id}}</span>
        <projet-toggler :collecte="collecte" @projet-change="projetChange($event)" :readonly="!projetToggler" />
    </div>

</template>

<script>

import UserImage from '../pebble-ui/UserImage.vue';
import ProjetToggler from './ProjetToggler.vue';

export default {
    props: {
        collecte: Object,
        projetToggler: Boolean
    },

    emits: ['projet-change'],

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

    methods: {
        /**
         * Envoie un événement pour informer de la modification de la collecte
         * 
         * @param {object} collecte La collecte mise à jour
         */
        projetChange(collecte) {
            this.$emit('projet-change', {
                projet_id: collecte.projet_id,
                projet_label: collecte.projet_label
            });
        }
    },

    components: { UserImage, ProjetToggler }
}

</script>
<template>

    <span class="badge badge-sm border border-light badge-bouclage" :class="[badgeClassName]" :title="bouclageTitle">
        <i class="bi bi-arrow-repeat"></i>
        <span v-if="bouclageLabel" class="ms-1">{{ bouclageLabel }}</span>
    </span>

</template>

<style lang="scss" scoped>
.badge-bouclage {
    position:absolute;
    top:-14px;
    left:-14px;
}
</style>

<script>
import { classNameFromSAMI } from '../../js/collecte';


export default {
    props: {
        collecte: Object
    },

    computed: {
        /**
         * Retourne le libellé du bouclage
         * - Si il y a un résultat, pas de libellé
         * - Si il y a un bouclage en cours, ...
         * - Si aucune bouclage n'est lancé sur une note I ou M, !
         */
        bouclageLabel() {
            return this.getLabelFromDict([null, "...", "!", null]);
        },

        /**
         * Retourne un titre en fonction de status de bouclage.
         */
        bouclageTitle() {
            return this.getLabelFromDict(["Contrôle bouclé", "Bouclage en cours", "Bouclage nécessaire", null]);
        },

        /**
         * Retourne une classe CSS par rapport à une réponse S A M I
         * 
         * @return {string}
         */
        badgeClassName() {
            if ((this.collecte.result_var.toUpperCase() === 'I' || this.collecte.result_var.toUpperCase() === 'M') && !this.collecte.following_id) {
                return "text-bg-danger";
            }
            return classNameFromSAMI(this.collecte.following_result);
        }
    },

    methods: {
        /**
         * Retourne le libellé du bouclage depuis un dictionnaire
         * 
         * @param {array} dict Dictionnaire
         * - Clé 0 : Bouclage fait avec un résultat
         * - Clé 1 : Bouclage en cours sans résultat
         * - Clé 2 : Pas de bouclage sur une note I et M
         * - Clé 3 : Valeur par défaut
         * 
         * @return {mixed}
         */
        getLabelFromDict(dict) {
            if (this.collecte.following_result && this.collecte.following_result != 'null') {
                return dict[0];
            }

            if (this.collecte.following_id && (!this.collecte.following_result || this.collecte.following_result === 'null')) {
                return dict[1];
            }

            if ((this.collecte.result_var.toUpperCase() === 'I' || this.collecte.result_var.toUpperCase() === 'M') && !this.collecte.following_id) {
                return dict[2];
            }
            
            return dict[3];
        }
    }
}

</script>

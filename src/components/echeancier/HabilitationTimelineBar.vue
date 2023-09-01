<template>
    <div  
        class="habilitation-timeline bg-info bg-gradient bg-opacity-25 border border-info fs-7 px-2" 
        :style="{left: leftPx, width: widthPx}" 
        :title="habilitationPersonnelLabel">

        <span class="label-timeline">{{ habilitationPersonnelLabel }}</span>
    </div>
</template>

<style lang="scss" scoped>
@import "./calendar.scss";
</style>

<script>
import { dateFormat } from '../../js/date';

export default {
    props: {
        habilitationPersonnel: Object,
        left: Number,
        width: Number
    },

    computed: {
        /**
         * Retourne un libellé indiquant la date de début et de fin d'une habilitation pour un personnel.
         * 
         * @return {string}
         */
        habilitationPersonnelLabel() {
            return "Habilité du "+dateFormat(this.habilitationPersonnel.dd)+" au "+dateFormat(this.habilitationPersonnel.df);
        },

        /**
         * Retourne l'espace à gauche en pixel
         */
        leftPx() {
            return `${this.left}px`;
        },

        /**
         * Retourne la largeur de la barre en pixel
         */
        widthPx() {
            return `${this.width}px`;
        }
    }
}

</script>

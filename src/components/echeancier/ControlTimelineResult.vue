<template>
    
    <div 
        class="control-timeline bg-gradient"
        :class="[SAMIClassName]"
        :style="{ left: leftPx, width: widthPx }"></div>
    
    <div 
        class="control-timeline control-expired bg-danger bg-gradient fs-7 text-danger"
        :style="{ left: blankWeeksLeftPx, width: blankWidthPx }"
        v-if="blankWidth > 0"
        title="Contrôle expiré">
    </div>

    <div 
        class="control-result-item rounded m-1" 
        :class="[SAMIClassName]" 
        :style="{ left: leftPx }"
        :title="control.date_done">{{ control.sami }}</div>

</template>

<style lang="scss" scoped>
@import "./calendar.scss";
</style>

<script>

import { classNameFromSAMI } from '../../js/collecte'

export default {
    props: {
        control: Object,
        left: Number,
        width: Number,
        blankWidth: Number
    },

    computed: {
        /**
         * Retourne le nom de la classe CSS en fonction du résultat SAMI du contrôle
         * 
         * @return {string}
         */
        SAMIClassName() {
            return classNameFromSAMI(this.control.sami);
        },
        
        /**
         * Retourne la position de gauche avec le suffix 'px'
         */
        leftPx() {
            return this.number2px(this.left);
        },

        /**
         * Retourne la taille de la période de validité avec le suffix 'px'
         */
        widthPx() {
            return this.number2px(this.width);
        },

        /**
         * Retourne la taille de la période expirée avec le suffixe "px"
         */
        blankWidthPx() {
            return this.number2px(this.blankWidth);
        },

        /**
         * Retourne la position de gauche de la période expirée
         */
        blankWeeksLeft() {
            return this.left + this.width;
        },

        /**
         * Retourne la position de gauche de la période expirée avec le suffix "px"
         */
        blankWeeksLeftPx() {
            return this.number2px(this.blankWeeksLeft);
        }
    },

    methods: {
        /**
         * Ajoute le suffix 'px' à un nombre
         * 
         * @param {number} val      La valuer à passer en pixel
         * 
         * @return {string}
         */
        number2px(val) {
            return `${val}px`;
        }
    }
}

</script>

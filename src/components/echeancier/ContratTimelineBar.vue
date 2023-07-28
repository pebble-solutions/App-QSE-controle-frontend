<template>
    <div 
        class="contrat-timeline bg-secondary bg-gradient bg-opacity-25 border border-secondary text-secondary fs-7 px-2" 
        :style="{left: leftPx, width: widthPx}" 
        :title="label">
        <span class="label-timeline">{{ label }}</span>
    </div>
</template>

<style lang="scss" scoped>
@import "./calendar.scss";
</style>

<script>
import { dateFormat } from '../../js/date';


export default {
    props: {
        contrat: Object,
        left: Number,
        width: Number
    },

    compted: {
        /**
         * Retourne le libellé du contrat incluant la date de début et de fin
         * 
         * @returns {string}  
         */
        label() {
            if (!this.contrat.dentree) {
                return "Erreur : pas de date sur le contrat";
            }

            let label = "Contrat du " + dateFormat(this.contrat.dentree);

            const dsortie = this.contrat.dsortie_reelle ? this.contrat.dsortie_reelle : this.contrat.dsortie;

            if (dsortie) {
                label += " au "+dateFormat(dsortie);
            }
            else {
                label += " sans date de sortie prévue.";
            }

            return label;
        },

        widthPx() {
            return `${this.width}px`;
        },

        leftPx() {
            return `${this.left}px`;
        }
    }
}

</script>

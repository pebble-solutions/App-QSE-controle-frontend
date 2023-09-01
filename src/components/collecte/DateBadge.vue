<template>
    <div class=" badge rounded-pill border" :class="className">
        <i class="bi me-1" :class="icon"></i>
        <span>{{ dateLabel }}</span>
    </div>
</template>

<script>

import { dateFormat } from '../../js/collecte';

export default {

    props: {
        collecte: Object
    },

    computed: {
        /**
         * Retourne la date à afficher
         * 
         * date_done si renseignée, date si programmée, null dans les autres cas
         * 
         * @return {string}
         */
        date() {
            const date = this.collecte.date_start ?? this.collecte.date;
            return date && date !== 'null' && date !== 'NULL' && date !== '0000-00-00 00:00:00' ? date : null;
        },

        /**
         * Retourne les classes CSS à appliquer en fonction de l'état.
         * 
         * @return {string}
         */
        className() {
            let className = '';
            if (!this.date) {
                className += 'text-bg-warning';
            }
            else {
                className += 'text-bg-light';
            }

            if (this.collecte.date_done) {
                className += ' text-success border-success';
            }
            
            return className;
        },

        /**
         * Retourne la classe d'icon boostrap en fonction de l'état
         * 
         * @return {string}
         */
        icon() {
            return this.collecte.date_done ? 'bi-calendar-check' : 'bi-calendar-event';
        },

        /**
         * Retourne la date à afficher dans un format lisible ou non-renseignée
         * 
         * @return {string}
         */
        dateLabel() {
            return this.date ? dateFormat(this.date) : 'Non renseignée';
        }
    },
}

</script>
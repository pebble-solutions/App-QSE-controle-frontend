<template>
    <div class="progress-container">
        <div class="progress">
            <!-- Boucle pour chaque élément de progressItems -->
            <div v-for="(item, index) in progressItems" :key="index" class="progress-bar" :class="item.class"
                role="progressbar" :style="{ width: item.width }" :aria-valuenow="item.value" aria-valuemin="0"
                aria-valuemax="100">
                {{ item.label }}
            </div>
        </div>
        <!-- Indicateurs de position-->
        <div class="indicator" :style="{ left: calculateProgressPosition(n1Obj) + '%' }"></div>
        <!-- Indicateur de position général -->
        <div class="generalIndicator" :style="{ left: calculateProgressPosition(n2Obj) + '%' }"></div>
        <!-- Indicateur de position avec image utilisateur, il est calé au dessus de indicator-->
        <div class="userImageIndicator" :style="{ left: calculateProgressPosition(n1Obj) + '%' }">
            <UserImage size="sm" :name="name"></UserImage>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import UserImage from './pebble-ui/UserImage.vue';

export default {

    props: {
        personnalAverage: {
            type: Number,
            required: true,
        },
        generalAverage: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            progressItems: [

                { label: 'S', class: 'bg-success', value: 25, width: '25%' },
                { label: 'A', class: 'bg-primary', value: 25, width: '25%' },
                { label: 'M', class: 'bg-warning', value: 25, width: '25%' },
                { label: 'I', class: 'bg-danger', value: 25, width: '25%' }
            ],

        }
    },

    computed: {
        ...mapState(['formulaires']),
        n1Obj() {
            return { value: this.personnalAverage };
        },
        n2Obj() {
            return { value: this.generalAverage };
        },
    },
    methods: {
        /**
         * Calcule la position de l'indicateur en fonction de la moyenne
         * 
         * @param {object} obj - Objet contenant la valeur de la note
         * @returns {number} Position en pourcentage de l'indicateur
         */
        calculateProgressPosition(obj) {
            const minAverage = 0;
            const maxAverage = 10;
            const minPosition = 12.5;
            const maxPosition = 87.5;
            const average = obj.value;

            // Calcul de la position en pourcentage en fonction de la moyenne
            const position = Math.min(
                Math.max(
                    ((average - minAverage) / (maxAverage - minAverage)) * (maxPosition - minPosition) + minPosition,
                    minPosition
                ),
                maxPosition
            );

            return maxPosition - position + minPosition; // Inverse la progression
        },




        /**
         * Formate la date en utilisant les options spécifiées
         * 
         * @param {Date} date - Date à formater
         * @returns {string} Date formatée
         */
        formatDate(date) {
            // Vérifie si la date est un objet Date valide
            if (!(date instanceof Date && !isNaN(date))) {
                return 'Invalid Date';
            }

            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Intl.DateTimeFormat('fr-FR', options).format(date);
        },

        /**
         * Calcule la largeur de la barre de progression en pourcentage en fonction de la note
         * 
         * @param {object} obj - Objet contenant la valeur de la note
         * @returns {number} Largeur de la barre de progression en pourcentage
         */
        getProgressBarWidth(obj) {
            return (obj.value / 10) * 100; // Convertir la note en pourcentage pour la barre de progression
        },

        /**
         * Calcule la moyenne en arrondissant à une décimale
         * 
         * @param {object} obj - Objet contenant la valeur de la note
         * @returns {string} Moyenne arrondie à une décimale
         */
        getAverage(obj) {
            const average = obj.value;
            const roundedAverage = Math.round(average * 10) / 10; // Arrondir la moyenne à une décimale

            // Vérifier si la partie décimale est nulle
            if (roundedAverage % 1 === 0) {
                return roundedAverage.toFixed(0); // Afficher la moyenne sans décimale si elle est nulle
            } else {
                return roundedAverage.toFixed(1); // Sinon, afficher une décimale
            }
        },
    },
    components: { UserImage, },
};
</script>
  

<style scoped>
.progress {
    position: relative;
    height: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    text-align: center;
}

.progress-container {
    position: relative;
    height: 25px;
    background-color: transparent;
    z-index: 1;
}

.indicator {
    position: absolute;
    top: -2px;
    transform: translate(-50%, -50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid grey;
    z-index: 1;
}

.generalIndicator {
    position: absolute;
    top: -10px;
    transform: translate(-50%, -50%);
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 22px solid rgba(128, 128, 128, 0.5);
    /* Gris transparent */
    z-index: 1;
}

.userImageIndicator {
    position: absolute;
    top: -16px;
    transform: translate(-50%, -50%);
    z-index: 2;
}
</style>
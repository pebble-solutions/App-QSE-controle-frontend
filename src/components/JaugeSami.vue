<template>
    <div class="progress-container d-flex justify-content-between align-items-center text-center position-relative bg-transparent z-1">
        <div class="progress position-relative w-100 z-1">
            <div v-for="(item, index) in progressItems" :key="index" class="progress-bar" :class="item.class"
                role="progressbar" :style="styleProgressItems(item)" :aria-valuenow="item.value" aria-valuemin="0"
                aria-valuemax="100">
                {{ item.label }}
            </div>
        </div>
        <!-- Indicateurs de position-->
        <div class="personnelIndicator indicator position-absolute w-0 h-O z-1" :style="{ left: calculateProgressPosition(personnalAverage) + '%' }"></div>
        <!-- Indicateur de position général -->
        <div class="generalIndicator indicator position-absolute z-1 w-0 h-0" :style="{ left: calculateProgressPosition(generalAverage) + '%' }"></div>
        <!-- Indicateur de position avec image utilisateur, il est calé au dessus de indicator-->
        <div class="userImageIndicator position-absolute w-0 h-0 z-2" :style="{ left: calculateProgressPosition(personnalAverage) + '%' }">
            <UserImage size="sm" :name="name"></UserImage>
        </div>

        <div class="generalIconIndicator position-absolute w-0 h-0" :style="{ left: calculateProgressPosition(generalAverage) + '%' }">
            <i class="bi bi-people-fill iconColor"></i>
        </div>
    </div>
</template>

<script>
import UserImage from './pebble-ui/UserImage.vue';

export default {
    components: { UserImage },

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

    methods: {
        /**
         * methode pour la boucle pour l'affichage de la progress bar
         * 
         * @param {object} item - Objet contenant les valeurs de la progress bar
         * 
         * @returns {string} 
         */
        styleProgressItems(item) {
            return 'width: ' + item.width;
        },


        /**
         * Calcule la position de l'indicateur en fonction de la moyenne
         * 
         * @param {object} obj - Objet contenant la valeur de la note
         * 
         * @returns {number} Position en pourcentage de l'indicateur
         */
        calculateProgressPosition(obj) {
            const minAverage = 0;
            const maxAverage = 10;
            const minPosition = 12.5;
            const maxPosition = 87.5;
            const average = obj;

            // Calcul de la position en pourcentage en fonction de la moyenne
            let position = Math.min(
                Math.max(
                    ((average - minAverage) / (maxAverage - minAverage)) * (maxPosition - minPosition) + minPosition,
                    minPosition
                ),
                maxPosition
            );

            return maxPosition - position + minPosition; // Inverse la progression
        }
    }
}
</script>
  

<style scoped>
.progress {
    height: 20px;
    color: white;
}

.progress-container {
    height: 25px;
}

.indicator {
    transform: translate(-50%, -50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
}

.personnelIndicator {
    top: 0px;
    border-top: 6px solid grey;
}

.generalIndicator {
    top: 25px;
    border-bottom: 6px solid grey;
}

.userImageIndicator {
    top: -13px;
    transform: translate(-50%, -50%);
}

.generalIconIndicator {
    top: 35px;
    transform: translate(-50%, -50%);
}

.iconColor {
    color: grey;
}
</style>
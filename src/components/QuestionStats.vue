<template>
    <div>
        <div class="row">
            <div class="col-12 col-md-6">
                <div class="progress-container mb-md-5">
                    <div class="progress">
                        <div class="progress-bar bg-success" role="progressbar" :style="{ width: '25%' }" aria-valuenow="25"
                            aria-valuemin="0" aria-valuemax="100">
                            S
                        </div>
                        <div class="progress-bar bg-primary" role="progressbar" :style="{ width: '25%' }" aria-valuenow="25"
                            aria-valuemin="0" aria-valuemax="100">
                            A
                        </div>
                        <div class="progress-bar bg-warning" role="progressbar" :style="{ width: '25%' }" aria-valuenow="25"
                            aria-valuemin="0" aria-valuemax="100">
                            M
                        </div>
                        <div class="progress-bar bg-danger" role="progressbar" :style="{ width: '25%' }" aria-valuenow="25"
                            aria-valuemin="0" aria-valuemax="100">
                            I
                        </div>
                    </div>
                    <div class="indicator" :style="{ left: calculateProgressPosition(n1Obj) + '%' }"></div>
                    <div class="generalIndicator" :style="{ left: calculateProgressPosition(n2Obj) + '%' }"></div>
                    <div class="userImageIndicator" :style="{ left: calculateProgressPosition(n1Obj) + '%' }">
                        <UserImage size="sm" name="N" />
                    </div>
                </div>
            </div>

            <div class="col-12 col-md-6">
                <div class="row">
                    <div class="col-6">
                        <div class="col-12 fs-7">
                            Moyenne : {{ getAverage(n1Obj) }}/10
                        </div>
                        <div class="col-12 fs-7" style="color:rgba(128, 128, 128, 0.6);">
                            (générale : {{ getAverage(n2Obj) }})
                        </div>
                    </div>
                    <div class="col-6">
                        <LastControlAndResult date="2023-04-15" result="M" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { mapState } from 'vuex';
import LastControlAndResult from './LastControlAndResult.vue';
import UserImage from './pebble-ui/UserImage.vue';

export default {
    props: {
        stats: Array,
        n1: {
            type: Number,
            required: true,
        },
        n2: {
            type: Number,
            required: true,
        },
    },
    computed: {
        ...mapState(['formulaires']),
        // n1Obj représente la note "S" (Score)
        n1Obj() {
            return { value: this.n1 };
        },
        // n2Obj représente la note "A" (Avis) test
        n2Obj() {
            return { value: this.n2 };
        },
        // n3Obj représente la note "M" (Moyenne) en soustrayant la note "S" de 5
        n3Obj() {
            return { value: 5 - this.n1 };
        },
        // n4Obj représente la note "I" (Insatisfaction) en soustrayant la note "A" de 5
        n4Obj() {
            return { value: 5 - this.n2 };
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

            return maxPosition - position + minPosition; // Inverser la progression
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
    components: { LastControlAndResult, UserImage, },
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

/*  ancien design triangle 
  .indicator {
  position: absolute;
  top: -6px;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 10px solid black;
  z-index: 1;

 */
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


/* .generalIndicator {
        position: absolute;
        top: 35%;
        transform: translate(-50%, -50%);
        border-left: 2px solid rgba(247, 140, 107, 0.3);
        border-right: 2px solid rgba(247, 140, 107, 0.3);
        width: 10%;
        height: 30px; 
        background-color: rgba(247, 140, 107, 0.4); 
        z-index: 0; 
    }
    */

.average-display {
    position: absolute;
    top: -23px;
    /* adjust this to position the element correctly */
    width: 100%;
    color: rgba(247, 140, 107, 0.55);
}

.light-gray {
    color: rgba(255, 140, 83, 0.377);
    /*You can adjust the color code to get the exact shade of gray you want*/
}

.text-style {
    font-size: 14px;
    /* ou la taille que vous souhaitez */
    font-weight: bold;
    color: rgba(128, 128, 128, 0.6);
}

.progress-container {
    /* ... (vos autres propriétés) ... */
    margin-bottom: 0;
    /* Réinitialisez la marge inférieure */
}
</style>
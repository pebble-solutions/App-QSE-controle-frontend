<template>
    <div>
        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <i class="bi bi-clock-history"></i>
        
                <div class="m-2 fs-7">{{ lastResultDate }}</div>
            </div>

            <button class="btn btn-outline-secondary" @click.prevent="showAnswer()" :title="displayTitle">
                <i v-if="!displayAnswer" class="bi bi-eye-fill"></i>
                <i v-else class="bi bi-eye-slash-fill"></i>
            </button>
        </div>

        <div v-if="displayAnswer" class="pt-2 fw-lighter">
            {{ value }}
        </div>
    </div>
</template>

<script>

import { dateFormat } from '../js/date';

export default {
    props: {
        date: String,
		value: String
    },

    data() {
        return {
            displayAnswer: false
        }
    },

    computed: {
        /**
         * Retourne la date du dernier resultat au bon format
         */
        lastResultDate() {
            return dateFormat(this.date);
        },

        /**
         * text du title a afficher
         */
        displayTitle() {
            if (this.displayAnswer) {
                return 'cacher la dernière réponse';
            }
            return 'voir la dernière réponse';
        }
    },

    methods: {
        /**
         * Affiche ou cache la reponse
         */
        showAnswer() {
            this.displayAnswer = !this.displayAnswer;
        }
    },
};

</script>
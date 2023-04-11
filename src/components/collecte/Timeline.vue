<template>

    <div class="timeline d-flex align-items-start justify-content-between">
        <timeline-nav-element 
            :route="route" 
            :collecte="{id: collecte.previous_id, result_var: collecte.previous_result}" 
            direction="previous"
            v-if="collecte.previous_id" />
        <div v-else></div>

        <div class="timeline-el link-secondary">
            <div class="timeline-label">
                <span class="badge rounded-pill text-uppercase fs-5 mb-1" :class="classNameFromSAMI(collecte.result_var)">
                    <template v-if="hasResult(collecte)">{{ collecte.result_var }}</template>
                    <template v-else>
                        <i class="bi bi-question-circle" v-if="collecte.locked"></i>
                        <i class="bi bi-hourglass-split" v-else></i>
                    </template>
                </span>
                <h4 class="fs-5 card-title">
                    <span>#{{ collecte.id }} <span class="fw-lighter"> {{collecte.formulaire.groupe}} </span> du {{changeFormatDateLit(collecte.date)}}</span>
                </h4>
                <div class="text-primary border border-primary badge rounded-pill text-bg-light" v-if="collecte.date_done">
                    <i class="bi bi-calendar-check me-1"></i>
                    <span class="d-none d-sm-inline">Clôturé le</span>
                    {{changeFormatDateLit(collecte.date_done)}}
                </div>
            </div>
        </div>

        <timeline-nav-element 
            :route="route" 
            :collecte="{id: collecte.following_id, result_var: collecte.following_result}" 
            direction="following"
            v-if="collecte.following_id" />
            <!-- <div v-else>Veille?</div> -->
       <!-- <TimelineProgElementVue v-else></TimelineProgElementVue> -->

        <TimelineProgElement :collecte="collecte" v-else-if="this.$route.name.includes('consultation')"/>
        <div v-else></div>
    </div>
    

</template>

<style lang="scss">
.timeline {
    position: relative;
}

.timeline:before {
    content: '';
    display:block;
    position:absolute;
    top:12px;
    left:0px;
    right:0px;
    border-bottom:3px solid #dee2e6;
    z-index:0;
}

.timeline-el {
    text-align:center;
    z-index: 10;
    text-decoration: none;
}

.timeline-el.active {
    font-weight: bold;
}

</style>

<script>

import {classNameFromSAMI, dateFormat} from '../../js/collecte.js';
import TimelineNavElement from './TimelineNavElement.vue';
import TimelineProgElement from './TimelineProgElement.vue';

export default {
    props: {
        collecte: Object,
        route: {
            type: String,
            default: 'consultation'
        }
    },
    methods: {
        /**
         * Retourne une classe CSS par rapport à une réponse S A M I
         *
         * @param {string} reponse S A M I
         *
         * @return {string}
         */
        classNameFromSAMI(reponse) {
            return classNameFromSAMI(reponse);
        },

        /**
         * Modifie le format de la date entrée en paramètre et la retourne
         * sous le format 01 févr. 2021
         * @param {string} date
         */
        changeFormatDateLit(el) {
            return dateFormat(el);
        },

        /**
         * Teste une collecte afin de déterminer si elle a un résultat
         * 
         * @param {object} collecte La collecte à tester
         * 
         * @return {boolean}
         */
        hasResult(collecte) {
            return collecte.result_var && collecte.result_var != "null";
        }
    },

    components: {  TimelineNavElement, TimelineProgElement }
}

</script>
<template>

    <div class="timeline d-flex align-items-start justify-content-between">
        <router-link :to="'/'+route+'/'+collecte.previous_id" v-slot="{navigate,href}" v-if="collecte.previous_id" custom>
            <a :href="href"  @click="navigate" class="timeline-el link-secondary">
                <div class="timeline-label">
                    <span class="badge rounded-pill mb-1" :class="classNameFromSAMI(collecte.previous_result)">
                        <template v-if="collecte.previous_result">{{ collecte.previous_result}}</template>
                        <i class="bi bi-question-circle" v-else></i>
                    </span><br>
                    <span>
                        <i class="bi bi-arrow-left"></i>
                        <span class="fw-light ms-1">#{{collecte.previous_id}}</span>
                        <span>
                        </span>
                    </span>
                </div>
            </a>
        </router-link>
        <div v-else></div>

            <div class="timeline-el link-secondary">
                <div class="timeline-label">
                    <span class="badge rounded-pill text-uppercase fs-5 mb-1" :class="classNameFromSAMI(collecte.result_var)">
                        <template v-if="collecte.result_var">{{ collecte.result_var }}</template>
                        <i class="bi bi-hourglass-split" v-else></i>
                    </span>
                    <h4 class="fs-5 card-title">
                        <span>#{{ collecte.id }} <span class="fw-lighter"> {{collecte.formulaire.groupe}} </span> du {{changeFormatDateLit(collecte.date)}}</span>
                    </h4>
                    <div class="text-primary border border-primary badge rounded-pill text-bg-light" v-if="collecte.date_done">
                        <i class="bi bi-calendar-check me-1"></i>
                        <span class="d-none d-sm-inline">Terminé le</span>
                        {{changeFormatDateLit(collecte.date_done)}}
                    </div>
                </div>
            </div>

        <router-link :to="'/'+route+'/'+collecte.following_id" v-slot="{navigate,href}" v-if="collecte.following_id" custom>
            <a :href="href" @click="navigate" class="timeline-el link-secondary" >
                <div class="timeline-label">
                    <span class="badge rounded-pill mb-1" :class="classNameFromSAMI(collecte.following_result)">
                        <template v-if="collecte.following_result">{{ collecte.following_result}}</template>
                        <i class="bi bi-question-circle" v-else></i>
                    </span><br>
                    <span>
                        <span class="fw-light me-1">#{{collecte.following_id}}</span>
                        <i class="bi bi-arrow-right"></i>
                    </span>
                </div>
            </a>
        </router-link>
        <div v-else></div>

    </div>
    

</template>

<style lang="scss" scoped>
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

import { RouterLink } from 'vue-router';
import {classNameFromSAMI, dateFormat} from '../../js/collecte.js';

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
    },
    components: {  RouterLink }
}

</script>
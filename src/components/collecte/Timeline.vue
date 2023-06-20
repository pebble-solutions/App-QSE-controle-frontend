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
                    <span class="me-1">#{{ collecte.id }}</span>
                    <span class="fw-lighter me-1"> {{collecte.formulaire.groupe}} </span>
                    <span v-if="collecte.date_start">commencé le {{changeFormatDateLit(collecte.date_start)}} </span>
                    <span v-else-if="collecte.date"> du {{changeFormatDateLit(collecte.date)}}</span>
                    <span v-else> date non définie</span>
                    
                </h4>
                <div class="text-primary border border-primary badge rounded-pill text-bg-light" v-if="collecte.date_done">
                    <i class="bi bi-calendar-check me-1"></i>
                    <span class="d-none d-sm-inline">Clôturé le</span>
                    {{changeFormatDateLit(collecte.date_done)}}
                </div>
                    <div v-if="collecte.date_start || collecte.date" class="mb-2"> 
                        <span v-if="collecte.unlocked" class="badge text-danger bg-info ms-1"><i class="bi bi-unlock-fill me-1"></i>à compléter</span>
                        <!-- <span class="badge rounded-pill ms-1 bg-secondary"  v-else-if="collecte.date_start && !collecte.unlocked">start et unlocked</span>
                        <span v-else-if="remainingLock >= 0 & !collecte.date_done"><i  class="bi bi-unlock-fill"></i> verrouillage dans {{ remainingLock }}</span> 
                        <span v-else>autre</span> -->
                    </div>
                <div v-if="collecte.notes.length >= 1" class="m-3">
                    <button class=" position-relative btn btn-sm btn-outline-secondary" @click.prevent="displayNotes()">
                        <i class="bi bi-card-list me-2"></i>Étapes
                        <span class="badge position-absolute top-0 start-100 translate-middle text-bg-primary">{{ collecte.notes.length }}</span>
                    </button>
                </div>
                <div v-if="readNotes" class="list-group">
                    <div class ="list-group-item" v-for="note in collecte.notes" :key="note.id">
                        <div class="d-flex flex-column">
                            <span>{{changeFormatDateLit(note.date)}}</span>
                            <span>{{ note.titre }}</span>
                            <span>{{note.note}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <timeline-nav-element 
            :route="route" 
            :collecte="{id: collecte.following_id, result_var: collecte.following_result}" 
            direction="following"
            v-if="collecte.following_id" />

        <TimelineProgElement :collecte="collecte" v-else-if="this.$route.fullPath.match(/consultation/)"/>
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

    data() {
        return {
            readNotes: false
        }
    },

    props: {
        collecte: Object,
        route: {
            type: String,
            default: 'consultation'
        }
    },
    computed: {
        /**
		 * Retourne le nombre de jours restants avant le verrouillage automatique
		 * @return	{number}
		 */
		remainingLock(){
			const now = new Date();
			const collecteDateStart = new Date(this.collecte.date_start);
             if(this.collecte.groupe_lock_timeout){
                 const delay = this.collecte.groupe_lock_timeout
                 
                 const datestartS = collecteDateStart.getTime()/ 1000;
                 const delayS = delay*24*60*60;
                 const nowS = now.getTime() /1000;
                 
                 const dateLockSecond =  datestartS - nowS + delayS;
                 const daysBeforeLock = Math.floor(dateLockSecond / (60* 60 * 24) +1);
     
                 return daysBeforeLock;
             }
             else {
                 return  'pas de délai';

             }
            // const dayBeforeLock = 'pas de délai'  
		},
        /**
         * Retourne la classe à appliquer au bage verrouillage
         */
		lockClass(){
			return this.getLockClass()
		},
    },
    methods: {

        displayNotes(){
            this.readNotes =!this.readNotes

        },
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
         * retourne une classe CSS en fonction du nombre de jours restants avant verrouillage
         */
        getLockClass() {
			if(this.remainingLock > 10) return 'bg-success';
			else if (this.remainingLock > 5) return 'bg-primary';
			else if (this.remainingLock >2) return 'bg-warning';
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
        },

       

    },

    components: {  TimelineNavElement, TimelineProgElement },
    
}

</script>
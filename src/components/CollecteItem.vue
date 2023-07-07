<template>

	<div class="d-flex align-items-center">
		
		<div class="me-2">
			<UserImage :name="personnelName"></UserImage>
		</div>

		<div class="d-flex flex-column align-content-between">
			<div class="d-flex align-items-center">
				<small class="fw-lighter me-2">#{{collecte.id}}</small>
				<date-badge :collecte="collecte" />
				<span v-if="collecte.unlocked" class="badge text-danger bg-info ms-1"><i class="bi bi-unlock-fill">à compléter</i></span>
				<!-- <span class="badge rounded-pill ms-1" :class="lockClass" v-else-if="collecte.date_start && !collecte.unlocked"><i class="bi bi-unlock-fill"></i> {{ remainingLock }} J</span>
				<span v-else></span> -->
			</div>

			<personnel-name :personnel-name="collecte.cible_nom" :personnel-id="collecte.cible__structure__personnel_id" />

			<div class="d-flex align-items-center" >
				<i class="bi bi-check me-1" v-if="collecte.done == 'OUI'"></i>
				<formulaire-name :name="formulaireName" v-if="formulaireName" />
			</div>

			<projet-name :name="collecte.projet_label" v-if="collecte.projet_label" />
		</div>
	</div>	
		
</template>

<script>

import { mapState } from 'vuex';
import UserImage from './pebble-ui/UserImage.vue';
import { dateFormat } from '../js/collecte';
import DateBadge from './collecte/DateBadge.vue';
import PersonnelName from './collecte/PersonnelName.vue';
import FormulaireName from './collecte/FormulaireName.vue';
import ProjetName from './collecte/ProjetName.vue';

export default {
    props: {
        collecte: Object
    },

    computed: {
        ...mapState(['formulaires', 'listActifs', 'projets']),

		/**
		 * Modifie le format de la date entrée en paramètre et la retourne 
		 * sous le format 01 févr. 2021
		 * 
		 * @return {string}
		 */
		dateLabel() {
			if (!this.collecte.date) {
				return 'Date non renseignée';
			}
			else {
				return dateFormat(this.collecte.date);
			}
		},

		/**
		 * Retourne une classe CSS pour la date en fonction des informations renseignées.
		 * 
		 * @return {string}
		 */
		dateClassName() {
			return !this.collecte.date ? 'text-bg-warning' : 'text-bg-secondary';
		},

		/**
		 * Retourne une classe CSS pour le badge de date (text-bg-danger, text-bg-success, text-bg-warning)
		 * 
		 * @return {string}
		 */
		badgeClassName() {
			return this.getRemaningString("text-bg-warning", "text-bg-danger", "text-bg-success");
		},

		/**
		 * Retourne un libellé de décompte des jours. (Dans X jours, Aujourd'hui, -X jours...)
		 * 
		 * @return {string}
		 */
		remaningLabel() {
			return this.remainingDays === 0 ? "Aujourd'hui" : `${this.remainingDays} J`;
		},

		/**
		 * Retourne le nombre de jours entre aujourd'hui et la date de la collecte.
		 * 
		 * @return {number}
		 */
		remainingDays() {
			const now = new Date();
			const collecteDate = new Date(this.collecte.date);

			const seconds = collecteDate.getTime() - now.getTime();

			const minutes = Math.round(seconds / (1000 * 60));
			const days = Math.floor(minutes / (60 * 24)) + 1;

			return days;
		},
		/**
		 * Retourne le nombre de jours restants avant le verrouillage automatique
		 * @return	{number}
		 */
		remainingLock(){
			const now = new Date();
			const collecteDateStart = new Date(this.collecte.date_start);
			const delay = this.collecte.groupe_lock_timeout
			
			const datestartS = collecteDateStart.getTime()/ 1000;
			const delayS = delay*24*60*60;
			const nowS = now.getTime() /1000;
			
			const dateLockSecond =  datestartS - nowS + delayS;
			

			// const minutes = Math.round(dateLockSecond / 60 );
			const daysBeforeLock = Math.floor(dateLockSecond / (60* 60 * 24)+1);

			return daysBeforeLock;
		},
		lockClass(){
			return this.getLockClass()
		},

		/**
		 * Retourne l'icon bootstrap à utiliser en fonction du nombre de jours entre aujourd'hui
		 * et la date de la collecte.
		 */
		remaningIcon() {
			return this.getRemaningString("bi-calendar-event-fill", "bi-calendar-x-fill", "bi-calendar-check-fill");
			// return this.getRemaningString("bi bi-lock-fill", "bi bi-unlock-fill", "bi bi-unlock-fill");

		},

		/**
		 * Retourne le nom du personnel correspondant à la collecte.
		 * 
		 * @return {string}
		 */
		personnelName() {
			if (this.collecte.cible__structure__personnel_id) {
				return this.collecte.cible_nom ?? `Personnel introuvable (${this.collecte.cible__structure__personnel_id})`;
			}
			return "Personnel non renseigné";
		},

		/**
		 * Retourne le nom du formulaire correspondant à la collecte
		 * 
		 * @return {string}
		 */
		formulaireName() {
			return this.getGroupNameFromId(this.collecte.information__groupe_id);
		}
    },

    methods: {

		/**
		 * Retourne une chaine de caractère en fonction du nombre de jours entre la collecte 
		 * et aujourd'hui.
		 * 
		 * @param {string} strToday Valeur à retourner si c'est aujourd'hui
		 * @param {string} strPast Valeur à retourner si c'est dans le passé
		 * @param {string} strFuture Valeur à retourner si c'est dans l'avenir
		 * 
		 * @return {string}
		 */
		getRemaningString(strToday, strPast, strFuture) {
			if (this.remainingDays === 0) return strToday;
			else if (this.remainingDays < 0) return strPast;
			else return strFuture;
		},

		getLockClass() {
			if(this.remainingLock > 10) return 'text-bg-success';
			else if (this.remainingLock > 5) return 'text-bg-primary';
			else if (this.remainingLock >2) return 'text-bg-warning';
			else if (this.remainingLock <= 0) return 'text-bg-danger';
			else return 'text-bg-secondary';
		},
        /**
		 * Récupere le nom du groupe d'information de la collect via un id de
		 * 
		 * @param {number} groupInformationId l'id du group information de la collecte
		 * 
		 * @return {string}
		 */
		getGroupNameFromId(groupInformationId) {
			let groupInformation = this.formulaires.find(e => e.id == groupInformationId);

			if (groupInformation) {
				return groupInformation.groupe;
			} else { 
				return 'Formulaire non renseigné';
			}
		}
    },

	components: {
		UserImage, DateBadge,
		PersonnelName,
		FormulaireName,
		ProjetName
		}
}

</script>
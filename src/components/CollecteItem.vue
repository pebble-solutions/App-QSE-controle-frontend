<template>

	<div class="d-flex align-items-center">
		<div class="me-2">
			<UserImage :name="personnelName"></UserImage>
		</div>

		<div class="d-flex flex-column align-content-between">
			<div class="d-flex align-items-center">
				<small class="fw-lighter me-2">#{{collecte.id}}</small>
				<span :class="dateClassName" class="badge me-2">{{dateLabel}}</span>

				<span v-if="collecte.date"
					class="badge"
					:class="badgeClassName"
				>
					<i class="bi" :class="remaningIcon"></i>
					{{ remaningLabel }}
				</span>
			</div>

			<div>
				{{personnelName}}
			</div>

			<div class="fw-lighter" >
				<i class="bi bi-check me-1" v-if="collecte.done == 'OUI'"></i>
				{{formulaireName}}
			</div>

			<div class="d-flex fs-7 fw-light" v-if="collecte.projet_label">
				<i class="bi bi-boxes me-2"></i>
				{{collecte.projet_label}}
			</div>
		</div>
	</div>	
		
</template>

<script>

import { mapState } from 'vuex';
import UserImage from './pebble-ui/UserImage.vue';
import date from 'date-and-time';
//import fr from 'date-and-time/locale/fr';


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
				//date.locale(fr);
				return date.format(new Date(this.collecte.date), 'DD MMM YYYY');
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
		 * Retourne l'icon bootstrap à utiliser en fonction du nombre de jours entre aujourd'hui
		 * et la date de la collecte.
		 */
		remaningIcon() {
			return this.getRemaningString("bi-calendar-event-fill", "bi-calendar-x-fill", "bi-calendar-check-fill");
		},

		/**
		 * Retourne le nom du personnel correspondant à la collecte.
		 * 
		 * @return {string}
		 */
		personnelName() {
			return this.getPersonnelNameFromId(this.collecte.cible__structure__personnel_id);
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
				return 'formulaire non renseigné';
			}
		},

		/**
		 * Récupère le nom d'un personnel actif via un id
		 * 
		 * @param {number} personnelId l'id d'un personnel actif
		 * 
		 * @return {string}
		 */
		getPersonnelNameFromId(personnelId) {
			if (!personnelId) return 'Personnel non renseigné';
			else {
				let personnelName = this.listActifs.find(personnel => personnel.id == personnelId);
				return personnelName ? personnelName.cache_nom : `Personnel inconnu (${personnelId})`;
			}
		}
    },

	components: {
		UserImage
	}
}

</script>
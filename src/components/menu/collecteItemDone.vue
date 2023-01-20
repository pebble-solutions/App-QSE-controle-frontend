<template>

	<div class="d-flex align-items-center">
		<div class="me-2">
			<UserImage :name="personnelName"></UserImage>
		</div>

		<div class="d-flex flex-column align-content-between">
			<div class="d-flex align-items-center">
				<small class="fw-lighter me-2">#{{collecte.id}}</small>
				<span :class="dateClassName" class="badge me-2">{{dateLabel}}</span>
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
import UserImage from '../pebble-ui/UserImage.vue';
import date from 'date-and-time';

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
				return date.format(new Date(this.collecte.date_done), 'DD MMM YYYY');
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
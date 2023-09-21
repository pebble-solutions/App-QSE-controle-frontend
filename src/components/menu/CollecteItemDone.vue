<template>
	<div class="d-flex align-items-center justify-content-between">
		<div class="me-4">
			<UserImage :name="collecte.cible_nom ?? '?'"></UserImage>
		</div>

		<div class="d-flex flex-column flexwrap align-content-start justify-content-start w-100 position-relative">
			<div class="d-flex align-items-center">
    <small class="fw-lighter me-3">#{{ collecte.id }}</small> <!-- Augmentation de la marge ici -->
    <date-badge :collecte="collecte" />
  </div>

			<personnel-name :personnel-name="collecte.cible_nom" :personnel-id="collecte.cible__structure__personnel_id" />

			<formulaire-name :name="formulaireName" v-if="formulaireName" />

			<projet-name :name="collecte.projet_label" v-if="collecte.projet_label" />
		</div>

		<button v-if="collecte.result_var && collecte.result_var != 'null'"
			class="badge fs-6 text-uppercase border border-light position-relative"
			:class="['text-bg', classNameFromSAMI(collecte.result_var)]">
			<Bouclage :collecte="collecte" v-if="hasBouclageInfo" />
			{{ collecte.result_var }}
		</button>
		<button v-else class="badge fs-6 text-uppercase border border-light"
			:class="['text-bg', classNameFromSAMI(collecte.result_var)]">
			?
		</button>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import UserImage from '../pebble-ui/UserImage.vue';
import DateBadge from '../collecte/DateBadge.vue';
import PersonnelName from '../collecte/PersonnelName.vue';
import FormulaireName from '../collecte/FormulaireName.vue';
import ProjetName from '../collecte/ProjetName.vue';
import { classNameFromSAMI } from '../../js/collecte';
import Bouclage from '../badges/Bouclage.vue';


export default {
	props: {
		collecte: Object
	},

	computed: {
		...mapState(['formulaires']),

		/**
		 * Retourne le nom du formulaire correspondant à la collecte
		 * 
		 * @return {string}
		 */
		formulaireName() {
			return this.getGroupNameFromId(this.collecte.information__groupe_id);
		},

		/**
		 * Contrôle si il y a des infos à afficher sur le bouclage
		 */
		hasBouclageInfo() {
			if (['I', 'M'].includes(this.collecte.result_var.toUpperCase())) {
				return true;
			}

			if (this.collecte.following_id) {
				return true;
			}

			return false;
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
			}
			return null;
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
	},

	components: {
		UserImage,
		DateBadge,
		PersonnelName,
		FormulaireName,
		ProjetName,
		Bouclage
	}
}


</script>
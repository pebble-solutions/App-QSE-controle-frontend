<template>

	<div class="container py-2">

		<template v-if="!stat">
			<h1 class="fs-3 mb-3">Statistiques par opérateur</h1>
			<alert-message icon="bi-info-circle me-2">
				Utilisez le formulaire du menu de gauche pour afficher les statistiques.
			</alert-message>
		</template>

		<template v-else>
			<div class="d-flex align-items-center mb-3">
				<h1 class="fs-3 m-0 me-3">{{personnelNom}}</h1>
				<div class="fw-light text-secondary text-end">du {{changeFormatDateLit(requeteStat.dd)}} au {{changeFormatDateLit(requeteStat.df)}}</div>
			</div>
		
			<charts :stats="stats" v-if="stats" />
		</template>
	</div>


</template>


<script>
import { mapActions, mapState } from 'vuex';
import Charts from '../components/Charts.vue';

import date from 'date-and-time';
import fr from 'date-and-time/locale/fr';
import AlertMessage from '../components/pebble-ui/AlertMessage.vue';

export default {
	computed: {
		...mapState(['stat', 'requeteStat', 'listActifs']),

		/**
		 * Retourne la première ligne de stats contenue dans le store
		 * 
		 * @return {object}
		 */
		stats() {
			let stats = null;

			if (this.stat) {
				for (const key in this.stat.stats) {
					stats = this.stat.stats[key];
					break;
				}
			}

			return stats;
		},

		/**
		 * Retourne le nom du personnel chargé.
		 * 
		 * @return {string}
		 */
		personnelNom() {
			if (this.stats) {
				return this.stats.nom;
			}
			return "Sans nom";
		}
	},

	components: {Charts, AlertMessage},

	methods: {
		...mapActions(['refreshStat']),

		/**
		 * Modifie le format de la date entrée en paramètre et la retourne 
		 * sous le format 01 févr. 2021
		 * @param {string} date 
		 */

		changeFormatDateLit(el) {
			date.locale(fr);
			return date.format(new Date(el), 'DD MMM YYYY')
		},
	},

	/**
	 * Avant de démonter la vue, on décharge tout.
	 */
	beforeUnmount() {
		this.refreshStat(null);
	}

}

</script>



<template>
	
	<div class="py-2">
		<FormStats></FormStats>
	</div>

	<div class="card" v-if="stats">
		<div class="card-header">
			<h2 class="fs-4">{{personnelNom}}</h2>
			<div class="fs-light">du {{changeFormatDateLit(requeteStat.dd)}} au {{changeFormatDateLit(requeteStat.df)}}</div>
		</div>
	</div>

	<charts :stats="stats" v-if="stats" />

</template>


<script>
import { mapState } from 'vuex';
import FormStats from '../components/FormStats.vue';
import Charts from '../components/Charts.vue';

import date from 'date-and-time';
import fr from 'date-and-time/locale/fr';

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

	components: {FormStats, Charts},

	methods: {
		/**
		 * Modifie le format de la date entrée en paramètre et la retourne 
		 * sous le format 01 févr. 2021
		 * @param {string} date 
		 */

		changeFormatDateLit(el) {
			date.locale(fr);
			return date.format(new Date(el), 'DD MMM YYYY')
		},
	}


}

</script>



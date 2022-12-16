<template>

	<div class="container py-2">

		<template v-if="!stats">
			<h1 class="fs-3 mb-3">Statistiques par opérateur</h1>

			<alert-message variant="warning" icon="bi-exclamation-circle me-2" v-if="stat">Aucun résultat pour cette recherche.</alert-message>

			<div class="card my-3">
				<div class="card-body">
					<div class="row align-items-center">
						<div class="col-md-6 col-lg-4 col-12">
							<img src="../assets/chart.jpg" class="img-fluid" alt="Extraction de statistiques">
						</div>
						<div class="col display-6 fs-4 text-center">
							Ici, vous pouvez consultez les statistiques de réponse par opérateur afin d'établir. Utilisez le formulaire 
							du menu à gauche afin de sélectionner une période et un opérateur.
						</div>
					</div>
				</div>
			</div>
		</template>

		<template v-else>
			<div class="d-flex align-items-center my-3">
				<div class="d-flex align-items-center">
					<user-image :name="personnelNom" className="me-2" />
					<h1 class="fs-3 m-0 me-3">{{personnelNom}}</h1>
				</div>
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
import UserImage from '../components/pebble-ui/UserImage.vue';

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

	components: {Charts, AlertMessage, UserImage},

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



<template>
	
	<div>
		<FormStats></FormStats>
	</div>

	<charts :stats="stats" v-if="stats" />

	<div>
		<StatPersonnelCard></StatPersonnelCard>
	</div>
	<div>
		<StatPersonnelGraph2></StatPersonnelGraph2>
		<StatPersonnelGraph></StatPersonnelGraph>
	</div>
</template>


<script>
import FormStats from '../components/FormStats.vue';
import StatPersonnelCard from '../components/StatPersonnelCard.vue';
import StatPersonnelGraph2 from '../components/StatPersonnelGraph2.vue';
import StatPersonnelGraph from '../components/StatPersonnelGraph.vue';
import Charts from '../components/Charts.vue';
import { mapState } from 'vuex';

export default {
	computed: {
		...mapState(['stat']),

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
		}
	},

	components: {FormStats,StatPersonnelCard, StatPersonnelGraph, StatPersonnelGraph2, Charts},

}

</script>



<template>
	
	<div v-if="!stat">
		<FormStats></FormStats>
	</div>
	<div v-if="stat">
		<StatPersonnelCard></StatPersonnelCard>
	</div>
	<div v-if="stat">
		<StatPersonnelGraph2></StatPersonnelGraph2>
		<!-- <StatPersonnelGraph></StatPersonnelGraph> -->
	</div>
	<div v-if="requeteStat">
		{{requeteStat}}
	</div>
	<div v-if="stat">
		
		{{stat}}
	</div>
</template>


<script>
import { mapState } from 'vuex';
import FormStats from '../components/FormStats.vue';
import StatPersonnelCard from '../components/StatPersonnelCard.vue';
import StatPersonnelGraph2 from '../components/StatPersonnelGraph2.vue';
// import StatPersonnelGraph from '../components/StatPersonnelGraph.vue';

export default {

	components: {FormStats,StatPersonnelCard,  StatPersonnelGraph2},

	computed: {

		...mapState(['stat', 'requeteStat', 'listActifs']),
	},

	methods: {

		// searchAgent() {
		// 	let req = this.requeteStat

		// },

		searchID() {
            let req = this.requeteStat;

            return req.cible_personnel;
        },

        searchStatPersonnel() {
            let tata = this.stat.stats;
            let titi='';
            for (const property in tata) {
            titi = tata[property];
            }
            return titi

        }
	}


}

</script>



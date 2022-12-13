<template>
	
	<div>
		<FormStats></FormStats>
	</div>
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

export default {

	components: {FormStats,StatPersonnelCard, StatPersonnelGraph, StatPersonnelGraph2}
}

</script>



<template>

	<div class="d-flex justify-content-start my-4">
		<span class="badge me-1"  v-for="result in results" :key="result">{{result.result}}</span>
	</div>
	<div class="d-flex justify-content-start my-4 ">
		
		<span class="badge text-bg-success me-1">S</span>
		<span class="badge bg-primary me-1">A</span>
		<span class="badge bg-warning me-1">M</span>
		<span class="badge bg-warning me-1">M</span>
		<span class="badge bg-warning me-1">M</span>
		<span class="badge bg-primary me-1">A</span>
		<span class="badge bg-success me-1">S</span>
	</div>
</template>

<script>
export default {
	data() {
		return {
			results: {
				1: {
					result: 'A',
					label: 'Satisfaisant',
					color: 'success',
				},
			
				2: {
					result: 'S',
					label: 'Satisfaisant',
					color: 'success',
				},
				3: {
					result: 'M',
					label: 'Moyen',
					color: 'warning',
				},
				4: {
					result: 'I',
					label: 'Insuffisant',
					color: 'danger',
				},
			}
		}

	}
}





</script>
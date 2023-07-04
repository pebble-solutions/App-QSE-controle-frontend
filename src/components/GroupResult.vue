<template>
	<div class="d-flex justify-content-start my-2">
		<span v-for="result in results" :key="result" :class="['badge', getBadgeClass(result.result), 'me-2']">{{
			result.result }}</span>
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
			},
		};
	},
	methods: {
		getBadgeClass(result) {
			switch (result) {
				case 'A':
					return 'bg-success text-light';
				case 'S':
					return 'bg-success text-light';
				case 'M':
					return 'bg-warning text-dark';
				case 'I':
					return 'bg-danger text-light';
				default:
					return 'bg-secondary text-light';
			}
		},
	},
};
</script>

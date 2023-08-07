<template>
	<div class="last-control-and-result">
		<div class="text-container">
			<!-- Ligne 1 : Dernier résultat -->
			<div class="text-line">
				<div class="fs-7">Dernier résultat</div>
			</div>

			<!-- Ligne 2 : Date -->
			<div class="text-line">
				<div class="fw-bold fs-8">{{ changeFormatDateLit(lastControl) }}</div>
			</div>
		</div>

		<!-- Bouton -->
		<div class="button-container mt-1"> <!-- Ajoutez la marge supérieure ici -->
			<button
				:class="['btn', 'btn-sm', classNameFromSAMI(result), 'me-2', 'fs-6', 'px-2', 'text-nowrap', 'btn-square']"
				style="pointer-events: none;">
				{{ result }}
			</button>
		</div>
	</div>
</template>

<script>
import { classNameFromSAMI } from '../js/collecte';

export default {
	props: {
		date: String,
		result: String,
	},
	computed: {
		lastControl() {
			return this.date;
		},
	},
	methods: {
		changeFormatDateLit(el) {
			// Code for formatting the date if necessary
			return el;
		},
		classNameFromSAMI(result) {
			return classNameFromSAMI(result);
		},
	},
};
</script>

<style scoped>
.last-control-and-result {
	display: flex;
	align-items: center;
	justify-content: flex-end; /* Aligner tout à droite */
}

.text-container {
	display: flex;
	flex-direction: column;
}

.text-line {
	margin-bottom: -5px; /* Ajuster la marge entre les deux lignes de texte */
}

.button-container {
	margin-left: 5px; /* Ajuster la marge entre le texte et le bouton */

}

.btn-square {
	width: 30px;
	height: 30px;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.btn {
	width: 30px;
	height: 30px;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}
</style>

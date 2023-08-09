<template>
	<div class="last-control-and-result">
		<div class="text-container">
			<!-- Dernier résultat  et date -->
			<div class="col-12 fs-7">Dernier résultat</div>
			<div class="col-12 fs-7">{{ changeFormatDateLit(lastControl) }}</div>
		</div>
		<!-- Bouton : style="pointer-events: none;" empeche le clic ou le survol-->
		<div class="button-container ms-2">
			<button :class="['btn', 'btn-sm', classNameFromSAMI(result), 'fs-6', 'px-2', 'text-nowrap', 'btn-square']"
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
		/**
		 * Change le format de la date si nécessaire
		 * @param {string} el - Date à formater
		 * @returns {string} Date formatée
		 */
		changeFormatDateLit(el) {
			// Code pour formater la date si nécessaire
			return el;
		},

		/**
		 * Obtient la classe CSS en fonction du résultat SAMI
		 * @param {string} result - Résultat SAMI (S, A, M, I)
		 * @returns {string} Classe CSS correspondante
		 */
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
	justify-content: flex-end;
}

.text-container {
	display: flex;
	justify-content: flex-end;
	flex-direction: column;
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
  
<template>
	<div class="last-control-and-result">
		<div class="text-container">
			<!-- Dernier résultat  et date -->
			<div class="col-12 fs-7">Dernier résultat</div>
			<div class="col-12 fs-7">{{ dateFormat(date) }}</div>
		</div>
		<!-- Bouton : style="pointer-events: none;" empeche le clic ou le survol-->
		<div class="button-container ms-2">
			<button class="btn btn-sm fs-6 px-2 text-nowrap btn-square muted-tutton" :class="classNameFromSAMI(result)">
				{{ result }}
			</button>
		</div>
	</div>
</template>
  
<script>
import { classNameFromSAMI } from '../js/collecte';
import { dateFormat } from '../js/collecte';

export default {
	props: {
		date: String,
		result: String,
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
.mutted-tutton {
	pointer-events: none;
}
</style>
  
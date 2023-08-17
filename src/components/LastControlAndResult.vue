<template>
	<div class="d-flex align-items-center" :class="className">
		<div class="d-flex justify-content-between align-items-center">
			<i class="bi bi-clock-history"></i>
	
			<div class="m-2 fs-7">{{ lastResultDate }}</div>
		</div>

		<div class="fs-6 px-2 d-flex justify-content-center align-items-center rounded btnSAMI" :class="classNameBtn">
			{{ value }}
		</div>
	</div>
</template>
  
<script>
import { classNameFromSAMI } from '../js/collecte';
import { dateFormat } from '../js/date';

export default {
	props: {
		date: String,
		value: String,
		textStart: {
			type : Boolean,
			default: false
		}
	},

    computed: {
        /**
         * Retourne la date du dernier resultat au bon format
         */
        lastResultDate() {
            return dateFormat(this.date);
        },

        /**
         * Retourne la bonne classe en fonction de la valeur
         */
		classNameBtn() {
            return classNameFromSAMI(this.value);
        },

		className() {
			let classList = "";

			if (this.textStart) {
				classList += 'justify-content-start flex-column';
			} else {
				classList += "justify-content-end";
			}
			
			return classList;
		}
    }
};
</script>
  
<style scoped>
.btnSAMI {
	width: 30px;
	height: 30px;
}
</style>
  
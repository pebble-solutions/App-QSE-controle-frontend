<template>
    
    <span :class="classList">
        <strong class="fs-7 text-secondary" v-if="displayFonction">{{ fonctionLabel }}:</strong>
        {{ personnelLabel }}
    </span>

</template>

<script>

export default {

    props: {
        className: String,
        personnelId: Number,
        personnelName: String,
        fonctionLabel: {
            type: String,
            default: "Personnel"
        },
        displayFonction: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        /**
         * Retourne le libellé du personnel.
         * 
         * - Le nom fournis
         * - Personnel non renseigné
         * - Personnel non trouvé (ID personnel)
         */
        personnelLabel() {
            let label = '';

            
            if (this.personnelId) {
                label += this.personnelName ?? `introuvable (${this.personnelId})`;
			}
            else {
                if (!this.displayFonction) {
                    label += this.fonctionLabel+' ';
                }
                label += "non renseigné";
            }

            return label.charAt(0).toUpperCase() + label.slice(1);
        },

        /**
         * Retourne la liste des classes CSS à appliquer
         * 
         * @return {string}
         */
        classList() {
            let classList = this.className;

            if (!this.personnelName) {
                classList += ' text-warning fst-italic';
            }

            return classList;
        }
    }
}

</script>
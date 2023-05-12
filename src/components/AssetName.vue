<template>
    
    <span :class="className" class="d-flex align-items-center">
        <i class="bi me-1" :class="icon" v-if="icon"></i>
        {{ label }}
    </span>

</template>

<script>

export default {
    props: {
        icon: String,
        className: String,
        value: String,
        name: {
            type: String,
            default: "Donnée"
        },
        feminine: {
            type: Boolean,
            default: true
        }
    },

    computed: {
        /**
         * Retourne le libellé
         * 
         * @return {string}
         */
        label() {
            let e = '';
            if (this.feminine) {
                e = 'e';
            }
            return this.value ?? `${this.name} non-renseigné${e}`;
        }
    }
}

</script>
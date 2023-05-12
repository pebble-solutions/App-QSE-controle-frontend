<template>
    <span 
        v-if="value"
        class="badge mx-2"
        :class="className"
        
        >{{value.toUpperCase()}}</span>
</template>

<script>

export default {
    props: {
        value: String
    },

    computed: {
        /**
         * Retourne la classe CSS en fonction de la valeur
         * @return {string}
         */
        className() {
            const classList = {
                S: 'bg-success',
                A: 'bg-primary',
                M: 'bg-warning',
                I: 'bg-danger'
            };

            return classList[this.value?.toUpperCase()] ?? "";
        }
    }


}

</script>

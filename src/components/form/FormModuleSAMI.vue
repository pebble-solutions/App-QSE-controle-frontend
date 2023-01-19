<template>
    <div>
        <div class="row">
            
            <div v-for="val in samiDict" :key="question.id+'-'+val" class="col d-grid">
                <button 
                    @click.prevent="refreshValue(val)" 
                    type="button" class="btn" 
                    :class="buttonsClassName[val]">{{val}}</button>
                
            </div>
        </div>
    </div>
</template>


<script>

export default {

    props: {
        question: Object,
        value: String
    },

    emits: ['update:value'],

    data() {
        return {
            samiDict: ['S', 'A', 'M', 'I']
        }
    },
    
    computed: {
        /**
         * Retourne les noms des classes CSS de chaque type de bouton SAMI
         * 
         * Chaque clé de l'objet retourné est un type SAMI avec sa classe CSS en valeur.
         * 
         * @return {object}
         */
        buttonsClassName() {
            let px = {
                S: null,
                A: null,
                M: null,
                I: null
            };

            ['S', 'A', 'M', 'I'].forEach(samiVal => {
                px[samiVal] = "btn";
                if (samiVal != this.value?.toUpperCase()) {
                    px[samiVal] += "-outline";
                }
            });

            return {
                S: px.S+'-success',
                A: px.A+'-primary',
                M: px.M+'-warning',
                I: px.I+'-danger'
            };
        },
    },

    methods: {
        /**
         * Informe l'élément parent d'une modification de la valeur.
         * 
         * @param {string} value S,A,M,I
         */
        refreshValue(value) {
            if (this.value == value) {
                this.$emit('update:value', null);
            } else {
                this.$emit('update:value', value);
            }
        }
    }
}
</script>

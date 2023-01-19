<template>
    <div class="d-flex justify-content-between">
        <button class="btn btn-secondary" v-if="prevBloc" @click.prevent="navigate(prevBloc)" :disabled="pending.bloc">
            <span v-if="pending.bloc" class="spinner-border spinner-border-sm" role="status"></span>
            <i v-else class="bi bi-box-arrow-left"></i> 
            {{ prevBloc.bloc }}
        </button>

        <button class="btn btn-secondary ms-auto" v-if="nextBloc" @click.prevent="navigate(nextBloc)" :disabled="pending.bloc">
            {{nextBloc.bloc}} 
            <span v-if="pending.bloc" class="spinner-border spinner-border-sm" role="status"></span>
            <i v-else class="bi bi-box-arrow-right"></i>
        </button>

        <button v-else class="btn btn-success ms-auto" @click.prevent="navigate('end')" :disabled="pending.bloc">
            <span v-if="pending.bloc" class="spinner-border spinner-border-sm" role="status"></span>
            <i v-else class="bi bi-file-earmark-text"></i>
            Évaluation générale
        </button>
    </div>
</template>

<script>

export default {
    props: {
        pending: Boolean,
        bloc: Object,
        blocs: Array
    },

    emits: ['navigate'],

    computed: {
        nextBloc() {
            return this.findBloc(+1);
        },

        prevBloc() {
            return this.findBloc(-1);
        }
    },

    methods: {
        /**
         * Récupère le bloc correspondant
         * @param {*} i 
         * 
         * @return {Object}
         */  
        findBloc(i) {
            const selfIndex = this.blocs.findIndex(e => e.id == this.bloc.id);
            return this.blocs[selfIndex+i];
        },

        /**
         * Envoie une commande de navigation
         * @param {object} to Le bloc vers lequel naviguer
         */
        navigate(to) {
            this.$emit('navigate', to);
        }
    }
}

</script>
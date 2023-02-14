<template>
    
    <div>
        <ControlResultForm :stats="stats"></ControlResultForm>
    </div>
</template>

<script>

import ControlResultForm from '@/components/ControlResultForm.vue';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            stats: null
        }
    },
    
    components: { ControlResultForm },

    computed: {
        ...mapState(['collecte'])
    },

    methods: {
        /**
         * Récupère les stats de la collecte
         */
        getCollecteStats() {
            this.$app.apiGet('data/GET/stats', {
                environnement: 'private',
                collecte: this.collecte.id,
                type: 'formulaire'
            }).then((data) => {
                this.stats = data.stats;
                    // if(this.stats.lenght == 0);
                    // alert('oups')

            }).catch(this.$app.catchError);
        }
    },

    mounted() {
        if (this.collecte) {
            this.getCollecteStats();
        }
    }
}

</script>
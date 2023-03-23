<template>
    
    <div>
        <ControlResultForm :stats="stats"></ControlResultForm>
    </div>

    <FooterToolbar>
        Bouton finaliser
    </FooterToolbar>

</template>

<script>

import ControlResultForm from '@/components/ControlResultForm.vue';
import { mapState } from 'vuex';
import FooterToolbar from '../components/pebble-ui/toolbar/FooterToolbar.vue';

export default {
    data() {
        return {
            stats: null
        }
    },
    
    components: { ControlResultForm, FooterToolbar },

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
                console.log(this.stats);
                    if(this.stats.lenght == 0);
                    alert('oups')

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
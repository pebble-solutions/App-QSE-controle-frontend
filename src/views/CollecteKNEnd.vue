<template>
    
    <div>
        <ControlResultForm :stats="stats"></ControlResultForm>
    </div>

    <FooterToolbar wrapper-class="px-2 py-1 border-top border-dark" class-name="bg-dark">
        <div class="d-flex justify-content-center align-items-center">

            <button class="btn btn-primary" @click.prevent="validate()" >Terminer</button>
        </div>
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
        ...mapState(['collecte', 'responses', 'collecte'])
       
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
                    

            }).catch(this.$app.catchError);
        },
        /**
         * Envoie les données a l'api pour valider le KN
         */
         validate() {
            alert('contrôle terminé ?')
            // this.pending.validation = true;
            // this.itemResponse.done = 'OUI';

            // if (confirm('Une fois le contrôle terminé, vous ne pourrez plus le modifier. Confirmez-vous l\'enregistrement définitif de ce contrôle ?')) {
            //     this.$app.apiPost('data/POST/collecte/'+this.collecte.id, this.itemResponse,)
            //     .then((data) => {
            //         return this.refreshCollectes([data]);
            //     })
            //     .then(() => {
            //         return this.$app.apiGet('data/GET/collecte/'+this.collecte.id, {
            //             environnement: 'private'
            //         });
            //     })
            //     .then((collecte) => {
            //         this.refreshCollecte(collecte);
            //         this.$router.push({name:'collecteKN', params:{id:this.collecte.id}});

            //     })
            //     .catch(this.$app.catchError).finally(() => this.pending.validation = false);
            // } else {
            //     this.pending.validation = false;
            // }
        },
    },

    mounted() {
        if (this.collecte) {
            this.getCollecteStats();
        }
    }
}

</script>
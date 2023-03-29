<template>
    
    <div>
        <ControlResultForm :stats="stats" @update="updateItem($event)"></ControlResultForm>
    </div>

    <FooterToolbar wrapper-class="px-2 py-1 border-top border-dark" class-name="bg-dark">
        <div class="d-flex justify-content-center align-items-center">
            <button class="btn btn-secondary" @click.prevent="check()" >Vérifier</button>
        </div>
    </FooterToolbar>
        
    

</template>

<script>

import ControlResultForm from '@/components/ControlResultForm.vue';
import { mapActions, mapState } from 'vuex';
import FooterToolbar from '../components/pebble-ui/toolbar/FooterToolbar.vue';

export default {
    data() {
        return {
            stats: null,
            itemResponse: {
                result_type: 'sami',
                result: '',
                rapport: '',
                actions: '',
                environnement: 'private',
                done: '',
            },
            pending: {
                validation: false
            }
        }
    },
    
    components: { ControlResultForm, FooterToolbar },

    computed: {
        ...mapState(['collecte', 'responses', 'collecte'])
       
    },

    methods: {
        ...mapActions(['refreshCollectes', 'refreshCollecte', 'addDocumentToCollecte']),

        updateItem(val){
            this.itemResponse = val
        },

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
         check() {

            this.pending.validation = true;
            this.itemResponse.done = 'NON';
            console.log(this.itemResponse, 'item response')
            this.$app.apiPost('data/POST/collecte/'+this.collecte.id, this.itemResponse,)
                .then((data) => {
                    return this.refreshCollectes([data]);
                })
                .then(() => {
                    return this.$app.apiGet('data/GET/collecte/'+this.collecte.id, {
                        environnement: 'private'
                    });
                })
                .then((collecte) => {
                    this.refreshCollecte(collecte);
                    this.$router.push({name:'CollecteVerif', params:{id:this.collecte.id}});

                })
                .catch(this.$app.catchError).finally(() => this.pending.validation = false);
           
        },
       
    },
    

    mounted() {
        if (this.collecte) {
            this.getCollecteStats();
            this.itemResponse.rapport = this.collecte.rapport;
            this.itemResponse.result = this.collecte.result_var;
            this.itemResponse.actions = this.collecte.actions;
        }
    }
}

</script>
<template>
    
    <div>
        <ControlResultForm :stats="stats" @update="updateItem($event)"></ControlResultForm>
    </div>

    <FooterToolbar wrapper-class="px-2 py-1 border-top border-dark" class-name="bg-dark">
        <div class="d-flex justify-content-between align-items-center">
            <button class="btn btn-secondary" @click.prevent="retour()" >
                <i class="bi bi-box-arrow-left me-2"></i>
                Retour
            </button>

            <button class="btn btn-primary" @click.prevent="check()" >
                <i class="bi bi-save me-2"></i>
                Vérifier
            </button>
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
        ...mapActions(['refreshCollectes', 'refreshCollecte', 'addDocumentToCollecte', 'refreshResponse']),

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
                    if(this.stats.lenght == 0);
            }).catch(this.$app.catchError);
        },
        /**
         * Envoie les données du KN a l'api et met à jour le store 
         */
         record() {

            this.pending.validation = true;
            this.itemResponse.done = 'NON';
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
                    this.getReponses(collecte);
                })
                .catch(this.$app.catchError).finally(() => this.pending.validation = false);
           
        },
        /**
         * Récupère les réponses de la collecte pour les déplacer dans un élément tampon
         * du store.
         */
         getReponses(collecte) {
            collecte.reponses.forEach((resp) => {
                let itemReponse = {};

                itemReponse.question = resp.ligne;
                itemReponse.reponse = resp.data;
                itemReponse.commentaire = resp.commentaire;
                itemReponse.documents = resp.documents;

                let findBloc = this.collecte.formulaire.questions.find((question) => question.id == resp.ligne);
                itemReponse.bloc = findBloc.information__bloc_id;

                this.refreshResponse(itemReponse);
            })
        },
        /**
         * envoie les données saisies à l'api, met à jour le store et retourne à la vue précedente
         */

        retour(){
            this.record()
            this.$router.go(-1)
        },
        /**
         * envoie les données saisies à l'api, met à jour le store et envoie sur la route de cloture du controle
         */
        check(){
            this.record()
            this.$router.push({name:'CollecteVerif', params:{id:this.collecte.id}});
        }
       
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
<template>
    <div class="btn-group me-2">
        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-list"></i>
            <span class="ms-2 d-none d-md-inline">Liste des sections</span>
        </button>
        
        <ul class="dropdown-menu">
            <li v-for="blocItem in blocs" :key="blocItem.id">
                <button class="dropdown-item d-flex justify-content-between" type="button" @click.prevent="navigate(blocItem)">
                    {{blocItem.bloc}}
                    <i class="bi bi-check2 ms-1" v-if="currentBlocId == blocItem.id"></i>
                </button>
            </li>
            
        </ul>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
    data() {
        return {
            pending: {
                collecte: true,
                recordCollecte: false
            },
        }
    },
    props: {
        currentBlocId: String
    },

    computed: {
        ...mapState(['collecte', 'responses']),

        blocs() {
            return this.collecte.formulaire.blocs
        }
    },

    methods: {
        ...mapActions(['refreshCollectes', 'refreshCollecte', 'refreshResponse']),

        navigate(options) {
            this.pending.recordCollecte = true;

            this.$app.apiPost('data/POST/collecte/'+this.collecte.id, {
                reponses: JSON.stringify(this.responses),
                environnement:'private',
            })
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
            .catch(this.$app.catchError).finally(() => this.pending.recordCollecte = false);

            if ('end' === options) {
                this.$router.push({name: 'CollectKnEnd', params:{id: this.collecte.id}})
            } else {
                this.$router.push('/collecte/'+this.collecte.id+'/bloc/'+options.id);
            }
        },
        /**
         * Récupère les réponses stockées dans la collecte pour les déplacer dans un élément tampon
         * du store.
         */
         getReponses() {
            this.collecte.reponses.forEach((resp) => {
                let itemReponse = {};

                itemReponse.question = resp.ligne;
                itemReponse.reponse = resp.data;
                itemReponse.commentaire = resp.commentaire;
                itemReponse.documents = resp.documents;

                let findBloc = this.collecte.formulaire.questions.find((question) => question.id == resp.ligne);
                itemReponse.bloc = findBloc.information__bloc_id;

                this.refreshResponse(itemReponse);
            })
        }
    }
}
</script>
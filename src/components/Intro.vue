<template>
    
    <div class="my-2" v-if="collecte">
        <div class="card-body">
            <div class="card-title">
                <label for="context" class="form-label">
                    Contexte général du contrôle:
                </label>

                <textarea class="form-control" id="context" name="context" rows="6" placeholder="contexte..." v-model="itemResponse.commentaire"></textarea>
            </div>
            
            <div class="mt-3 text-end" v-if="collecte.formulaire?.blocs?.length">
                <button type="button" class="btn btn-primary" @click.prevent="startControl()" :disabled="pending.collecte">
                    Commencer
                    <span v-if="pending.collecte" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <i v-else class="bi bi-chevron-right"></i>
                </button>
            </div>
        </div>
    </div>

</template>

<script>
import {mapState, mapActions} from 'vuex';

export default {
    data() {
        return {
            itemResponse: {
                commentaire: "",
                environnement: "private"
            },
            pending: {
                collecte: false
            }
        };
    },
    computed: {
        ...mapState(["collecte"])
    },
    watch: {
        collecte(val) {
            this.itemResponse.commentaire = val.commentaire;
        }
    },
    methods: {

        ...mapActions(['refreshCollecte','refreshCollectes']),
        /**
         * Démarre le contrôle.
         */
        startControl() {
            if (this.collecte.commentaire !== this.itemResponse.commentaire) {
                this.pending.collecte = true;
                this.itemResponse.environnement = "private";
                console.log(this.itemResponse.commentaire,'commentaire');
                this.$app.apiPost("data/POST/collecte/" + this.collecte.id, this.itemResponse)
                    .then((data) => {
                        console.log(data, 'retour api');
                        return this.refreshCollectes([data]);
                    })
                    .then(() => {
                        return this.$app.apiGet('data/GET/collecte/'+this.collecte.id, {
                        environnement: 'private'
                        });
                    })
                    .then ((collecte)=> {
                        this.refreshCollecte(collecte);
                        this.routeToQuestions();
                    })
                    .catch(this.$app.catchError).finally(this.pending.collecte = false);
            } else {this.routeToQuestions()}
            
        },
        /**
         * Redirige la route vers l'étape des questions
         */
        routeToQuestions() {
            this.$router.push({
                name: "collecteKnBloc",
                params: {
                    id: this.collecte.id,
                    bloc: this.collecte.formulaire.blocs[0].id
                }
            });
        }
    },
    

    mounted() {
        if (this.collecte) {
            this.itemResponse.commentaire = this.collecte.commentaire;
        }
    },
}
</script>
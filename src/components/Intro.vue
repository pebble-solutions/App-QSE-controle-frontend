<template>
    
    <div class="my-2" v-if="collecte">
        <div class="card-body">
            <div class="card-title">
                <label for="context" class="form-label">
                    Décrivez ici le contexte général dans lequel se déroule le contrôle:
                </label>

                <textarea class="form-control" id="context" name="context" rows="6" placeholder="contexte..." v-model="itemResponse.commentaire"></textarea>
            </div>
            
            <div class="mt-3 text-end" v-if="collecte.formulaire?.blocs?.length">
                <button type="button" class="btn btn-outline-primary" @click.prevent="startControl()" :disabled="pending.collecte">
                    Commencer
                    <span v-if="pending.collecte" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <i v-else class="bi bi-chevron-right"></i>
                </button>
            </div>
        </div>
    </div>

</template>

<script>
import {mapState} from 'vuex'

export default {
    data() {
        return {
            itemResponse: {
                commentaire: null,
                environnement: 'private'
            },
            pending: {
                collecte: false
            }
        }
    },
    computed: {
        ...mapState(['collecte'])
    },

    watch: {
        collecte(val) {
            this.itemResponse.commentaire = val.commentaire
        }
    },

    methods: {
        /**
         * Démarre le contrôle.
         */
        startControl() {
            if (this.collecte.commentaire !== this.itemResponse.commentaire) {
                this.pending.collecte = true;
    
                this.itemResponse.environnement = 'private';
                this.$app.apiPost('data/POST/collecte/'+this.collecte.id, this.itemResponse)
                .then(() => {
                    this.routeToQuestions();
                }).catch(this.$app.catchError).finally(this.pending.collecte = false);
            }
            else {
                this.routeToQuestions();
            }
        },

        /**
         * Redirige la route vers l'étape des questions
         */
        routeToQuestions() {
            this.$router.push({
                name: 'collecteKnBloc', 
                params: {
                    id: this.collecte.id, 
                    bloc: this.collecte.formulaire.blocs[0].id
                }
            });
        }
    },

    mounted() {
        if (this.collecte) {
            this.itemResponse.commentaire = this.collecte.commentaire
        }
    }
}
</script>
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
                <button class="btn btn-outline-primary" @click="beginKn()" :disabled="pending.buttonBegin">
                    <span v-if="pending.buttonBegin" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <i v-else class="bi bi-box-arrow-in-up-right"></i>
                    Commencer
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
                buttonBegin: false
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
        beginKn() {
            if (this.itemResponse.commentaire) {
                this.pending.buttonBegin = true;

                this.itemResponse.environnement = 'private';
                this.$app.apiPost('data/POST/collecte/'+this.collecte.id, this.itemResponse)
                .then(() => {
                    this.$router.push({name:'collecteKnBloc', params:{id: this.collecte.id, bloc: this.collecte.formulaire.blocs[0].id}});
                }).catch(this.$app.catchError).finally(this.pending.begin = false);
            } else {
                this.$router.push({name:'collecteKnBloc', params:{id: this.collecte.id, bloc: this.collecte.formulaire.blocs[0].id}});
            }
        }
    },

    mounted() {
        if (this.collecte) {
            this.itemResponse.commentaire = this.collecte.commentaire
        }
    }
}
</script>
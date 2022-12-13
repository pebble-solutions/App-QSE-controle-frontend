<template>
    
    <div class="my-2" v-if="collecte">
        <div class="card-body">
            <div class="card-title">
                <label for="context" class="form-label">Décrivez ici le contexte général dans lequel se déroule le contrôle:</label>
                <textarea class="form-control" id="context" name="context" rows="6" placeholder="contexte..." v-model="itemResponse.commentaire"></textarea>
            </div>

            <div class="text-end" v-if="collecte.formulaire?.blocs?.length">
                <!-- <router-link :to="'/collecte/'+collecte.id+'/bloc/'+collecte.formulaire.blocs[0].id" custom v-slot="{ navigate, href }">
                    <a class="btn btn-outline-primary"  :href="href" @click="navigate">Commencer</a>
                </router-link> -->

                <button class="btn btn-outline-primary" @click="beginKn()">
                    Commencer
                </button>
            </div>
        </div>
    </div>

</template>

<script>
import {mapActions, mapState} from 'vuex'

export default {
    data() {
        return {
            itemResponse: {
                commentaire: null,
                environnement: 'private'
            }
        }
    },
    computed: {
        ...mapState(['collecte'])
    },

    methods: {
        ...mapActions(['refreshCollecte']),

        beginKn() {
            if (this.itemResponse.commentaire) {
                this.$app.apiPost('data/POST/collecte/'+this.collecte.id, this.itemResponse)
                .then((data) => {
                    console.log(data);
                    //this.refreshCollecte(data);
                    
                    this.$router.push({name:'collecteKnBloc', params:{id: this.collecte.id, bloc: this.collecte.formulaire.blocs[0].id}});
                }).catch(this.$app.catchError);
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
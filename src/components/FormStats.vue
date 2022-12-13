<template>
    <form action="post">
        <div class="row mt-3">
            <div class="col">
                <div class="mb-3">
                    <label class="form-label" for="DateDebut">Date de début</label>
                    <input type="date" class="form-control" id="dd" name="date" v-model="requete.dd">
                </div>
            </div>
            <div class="col">
                <div class="mb-3">
                    <label class="form-label" for="DateFin">Date de fin</label>
                    <input type="date" class="form-control" id="df" name="date" v-model="requete.df">
                </div>

            </div>
        </div>
        <div class="col mb-3">
            <label for="Type" class="form-label">Type:</label>
            <select class="form-select" id="type" name="type" v-model="requete.type">
                <option value="cible" key="cible">Opérateur</option>
                <option  value="'formulaire'" key="formulaire">KN</option>
            </select>
        </div>
        <div class="row">
            <div class="col mb-3">
                <label for="operateur" class="form-label">Opérateur</label>
                <select class="form-select" id="cible_personnel" name="operateur" v-model="requete.cible_personnel" >
                    <option value="">non</option>
                    <option v-for="(agent) in listActifs" :value="agent.id" :key="agent.id">{{agent.cache_nom}}</option>
                </select>
            </div>
            <div class="col mb-3">
                <label for="kn" class="form-label">KN</label>
                <select class="form-select" id="formulaire" name="kn" v-model="requete.formulaire" >
                    <option value="">non</option>
                    <option v-for="(form) in formulaires" :value="form.id" :key="form.id">{{form.groupe}}</option>
                </select>
            </div>
        </div>
        
        <div class="text-center">
            <button class="btn btn-outline-primary" @click.prevent="searchStats">Valider</button>
        </div>
    </form>
</template>
<script>
import { mapActions, mapState } from 'vuex';

export default {

    data() {
        return {

            requete: {
                formulaire: null,
                cible_personnel: null,
                dd: null,
                df: null,
                type: null, // cible ou formulaire
                done:'OUI',
                environnement:'private',
                // mari:
            }

        }
    },

    computed: {
        ...mapState(['formulaires','listActifs']),
    },


    methods: {

        ...mapActions(['refreshStat','setRequete']),

        searchStats() {
            console.log(this.requete);
            this.setRequete(this.requete);
            this.$app.apiGet('data/GET/stats', this.requete)
            .then((data) => {
                console.log(data);
                this.refreshStat(data);
            })
            .catch(this.$app.catchError);

        }
    }
}

</script>
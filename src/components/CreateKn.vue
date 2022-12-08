<template>
    <form method="post" @submit.prevent="createCollecte()">
        <div class="row g-2">
            <div class="col mb-3">
                <label for="collecteFormulaire" class="form-label">Type de KN</label>
                <select class="form-select" id="collecteFormulaire" name="formulaire" v-model="collecte.formulaire">
                    <option v-for="(form) in forms" :value="form.id" :key="form.id" >{{form.groupe}}</option>
                </select>
            </div>
        </div>
        <div class="row g-2">
            <div class="col mb-3">
                <label for="collecteCible" class="form-label">Agent </label>
                <select class="form-select" id="collecteCible" name="cible_personnel" v-model="collecte.cible_personnel">
                    <option v-for="(agent) in listActifs" :value="agent.id" :key="agent.id" > {{agent.cache_nom}} </option>
                </select>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label" for="collectedDate">Date de réalisation</label>
            <input type="date" class="form-control" id="collecteDate" name="date" v-model="collecte.date">
        </div>
        <div class="col mb-3">
            <label for="collecteEnqueteur" class="form-label">Nom du contrôleur</label>
            <select class="form-select" id="collecteEnqueteur" name="enqueteur_personnel" v-model="collecte.enqueteur_personnel">
                <option  v-for="(controleur) in listActifs" :value="controleur.id" :key="controleur.id">{{controleur.cache_nom}}</option>
            </select>
        </div>
        <button  type="submit" class="btn btn-outline-primary">Valider</button>

        {{collecte}}
    </form>
</template>
<script>

import { mapActions } from 'vuex';
import { mapState } from 'vuex';
// import Datepicker from '@vuepic/vue-datepicker';

export default {
    // components: {Datepicker},

    data() {
        return {
            collecte: {
                formulaire: null,
                cible_personnel: null,
                enqueteur_personnel: null,
                date: null,
                environnement: 'private'
            }
        }
    },

    computed: {
        ...mapState(['openedElement', 'forms', 'listActifs'])
    },

    methods: {

        ...mapActions(['refreshForms','refreshListActifs']),

        loadForm() {
            this.$app.apiGet('data/GET/formulaire')
                .then((data) => {
                    console.log (data, 'formulaires');
                    this.refreshForms(data);
                })
                .catch(this.$app.catchError);
        },
        loadAgent() {
            this.$app.apiGet('structurePersonnel/GET/list', {
                actif:true
            })
                .then((data) => {
                    console.log (data, 'agents');
                    this.refreshListActifs(data);
                })
                .catch(this.$app.catchError);
        },
        createCollecte(){
            console.log("creation en cours : ", this.collecte)
            
            
            this.$app.apiPost('data/POST/collecte', this.collecte)
            .then((data) => {
                console.log (data, 'collecte crée')
            })
            .catch(this.$app.catchError);
        }
    },
}

</script>
<template>
    <form method="post" @submit.prevent="createCollecte()" v-if="(listActifs && formulaires)">
        <div class="row g-2">
            <div class="col mb-3">
                <label for="collecteFormulaire" class="form-label">Type de KN</label>
                <select class="form-select" id="collecteFormulaire" name="formulaire" v-model="collecte.formulaire">
                    <option v-for="(form) in formulaires" :value="form.id" :key="form.id" >{{form.groupe}}</option>
                </select>
            </div>
        </div>
        <div class="row g-2">
            <div class="col mb-3">
                <label for="collecteCible" class="form-label">Opérateur </label>
                <select class="form-select" id="collecteCible" name="cible_personnel" v-model="collecte.cible_personnel">
                    <option v-for="(agent) in listActifs" :value="agent.id" :key="agent.id" > {{agent.cache_nom}} </option>
                </select>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label" for="collecteDate">Date programmée</label>
            <input type="date" class="form-control" id="collecteDate" name="date" v-model="collecte.date">
        </div>
        <div class="col mb-3">
            <label for="collecteEnqueteur" class="form-label">Nom du contrôleur</label>
            <select class="form-select" id="collecteEnqueteur" name="enqueteur_personnel" v-model="collecte.enqueteur_personnel">
                <option  v-for="(controleur) in listActifs" :value="controleur.id" :key="controleur.id">{{controleur.cache_nom}}</option>
            </select>
        </div>
        <!-- <button  type="submit" class="btn btn-outline-primary">Valider</button> -->
    </form>
</template>
<script>

import { mapActions } from 'vuex';
import { mapState } from 'vuex';

export default {
    props: {
        collkn:Object
    },

    data() {
        return {


            pending: {
                loadForm: true,
                loadAgent: true
            },
            collecte: {
                id:'',
                formulaire: null,
                cible_personnel: null,
                enqueteur_personnel: null,
                date: null,
                environnement: 'private',
            }
        }
    },

    computed: {
        ...mapState(['openedElement', 'formulaires', 'listActifs','collectes']),

        // returnCollecte() {
        //     let collecte ={}

        //     console.log('collKn', this.collkn);
        //     console.log('collecte',this.collecte);
        //     collecte.id = this.collkn.id;
        //     collecte.formulaire = this.collkn.formulaire;
        //     collecte.cible_personnel = this.collkn.cible_personnel;
        //     collecte.enqueteur_personnel = this.collkn.enqueteur_personnel;
        //     collecte.date = this.collkn.date;
        //     return collecte;
        // }

        
    },

    emits:['edit-formulaire', 'edit-cible-personnel','edit-enqueteur-personnel','edit-date', 'update-collecte'],

    watch: {
        /**
         * Envoie un événement à l'élément parent lorsque le formualire est modifié.
         * 
         * @param {number} newVal Nouveau formulaire
         */
        formulaire(newVal) {
            this.$emit('edit-formulaire', newVal);
        },
        /**
         * Envoie un événement à l'élément parent lorsque l'opérateur est modifié.
         * 
         * @param {number} newVal Nouvel opérateur
         */
        cible_personnel(newVal) {
            this.$emit('edit-cible-personnel', newVal);
        },
        /**
         * Envoie un événement à l'élément parent lorsque l'enqueteur est modifié.
         * 
         * @param {String} newVal Nouvel enqueteur
         */
        enqueteur_personnel(newVal) {
            this.$emit('edit-enqueteur-personnel', newVal);
        },
        /**
         * Envoie un événement à l'élément parent lorsque la date  est modifiée.
         * 
         * @param {Date} newVal Nouvel enqueteur
         */
        date(newVal) {
            this.$emit('edit-date', newVal);
        },

    },

    methods: {

        ...mapActions(['refreshFormulaires','refreshListActifs']),

        loadForm() {
            this.pending.loadForm = true;
            this.$app.apiGet('data/GET/formulaire')
                .then((data) => {
                    console.log (data, 'formulaires create');
                    this.refreshFormulaires(data);
                })
                .catch(this.$app.catchError)
                .finally(this.pending.loadForm = false);
        },
        loadAgent() {
            this.pending.loadAgent = true;
            this.$app.apiGet('structurePersonnel/GET/list', {
                actif:true
            })
                .then((data) => {
                    console.log (data, 'agents create');
                    this.refreshListActifs(data);
                })
                .catch(this.$app.catchError)
                .finally(this.pending.loadAgent = false);
        },
        // /**
        //  * crée une nouvelle collecte  sur le serveur
        //  * 
        //  */
        // createCollecte(){
        //     console.log("creation en cours : ", this.collecte)
                        
        //     this.$app.apiPost('data/POST/collecte', this.collecte)
        //     .then((data) => {
        //         console.log(data, 'collecte crée')
        //         // this.$emit('newKn');
        //         alert ('collecte crée', data, this.collecte);
        //         // this.collecte.formulaire = null;
        //         // this.collecte.cible_personnel = null;
        //         // this.collecte.enqueteur_personnel = null,
        //         // this.collecte.date = null;
        //         this.routeToParent();
        //     })
        //     .catch(this.$app.catchError);
        // }, 
        // createCollecte(){
        //     console.log("creation en cours : ", this.collecte)
                        
        //     this.$app.apiPost('data/POST/collecte', this.collecte)
        //     .then((data) => {
        //         console.log(data)
        //         this.$emit('newKn');
        //         alert ('collecte crée', data, this.collecte.formulaire);
        //         // this.collecte.formulaire = null;
        //         // this.collecte.cible_personnel = null;
        //         // this.collecte.enqueteur_personnel = null,
        //         // this.collecte.date = null;
        //     })
        //     .catch(this.$app.catchError);
        // }
    },
    mounted() {
        // this.loadForm();
        // this.loadAgent();
        console.log('collKn', this.collkn);
        console.log('collecte',this.collecte);
        this.collecte.id = this.collkn.id
        this.collecte.formulaire = this.collkn.formulaire;
        this.collecte.cible_personnel = this.collkn.cible_personnel;
        this.collecte.enqueteur_personnel = this.collkn.enqueteur_personnel;
        this.collecte.date = this.collkn.date;
        
        console.log('formacollecte', this.collecte, this.collkn)
        this.$emit('update-collecte', this.collecte)

    },
}

</script>
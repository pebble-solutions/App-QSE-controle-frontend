<template>
    <form class="p-2 my-1" @submit.prevent="searchStat()">
        <div class="row">

            <div class=" col-6 mb-3">
                <label class="form-label" for="DateDebut">Date de début</label>
                <input type="date" class="form-control" id="dd" name="date" v-model="requete.dd" required>
            </div>
    
            <div class="col-6 mb-3">
                <label class="form-label" for="DateFin">Date de fin</label>
                <input type="date" class="form-control" id="df" name="date" v-model="requete.df" required>
            </div>
        </div>

        <div class="mb-3">
            <label for="habilitation" class="form-label">Habilitation :</label>
            <input type="text" class="form-control px-2" placeholder="Rechercher habilitation..." v-model="displaySearchHab">
            <select class="form-select" id="habilitation_id" name="habilitation" v-model="requete.habilitation" multiple size="7">
                <option value="" selected>Toutes</option>
                <option v-for="(hab) in restrictSearchHab(allHabilitations)" :value="hab.id" :key="hab.id"> {{hab.id}} {{hab.label}}</option>
            </select>
        </div>

        <div v-if="!pending.agents" class="mb-3">
            <label for="operateur" class="form-label">Opérateur:</label>
            <input type="text" class="form-control px-2" placeholder="Rechercher opérateur..." v-model="displaySearch">
            <select class="form-select" id="cible_personnel" name="operateur" v-model="requete.operateurs" multiple size="7">
                <option value="" selected>Tous</option>
                <option v-for="(agent) in restrictSearch(operateurs)" :value="agent.id" :key="agent.id">{{agent.cache_nom}} {{ agent.id }}</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label for="projet" class="form-label">Projet</label>
            <input type="text" class="form-control px-2" placeholder="Rechercher projet..." v-model="displaySearchProjets">
            <select class="form-select" id="projet" name="projet" v-model="requete.projets" multiple size="6">
                <option :value="projets" selected>Tous</option>
                <option v-for="(projet) in restrictSearchProjets(projets)" :value="projet.id" :key="projet.id"> {{ projet.id }} -{{projet.intitule}} </option>
            </select>
        </div>
        
        <div v-if="!pending.agents" class="mb-3">
            <label for="controleur" class="form-label">Contrôleur</label>
            <input type="text" class="form-control mb-2 px-2" placeholder="Rechercher contrôleur..." v-model="displaySearchControleurs">
            <select class="form-select" id="enqueteur_personnel" name="controleur" v-model="requete.controleurs" multiple size="7">
                <option value="" selected>Tous</option>
                <option v-for="(agent) in restrictSearchControleurs(controleurs)" :value="agent.id" :key="agent.id">{{agent.cache_nom}} {{ agent.id }}</option>
            </select>
        </div>
        <spinner v-else></spinner>
        

        
        <div class="text-center">
            <button class="btn btn-primary btn-lg" type="submit" :disabled="pending.requete">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="pending.requete"></span>
                <i class="me-2 bi bi-calendar2-check" v-else></i>
                Afficher
            </button>
        </div>
    </form>
</template>

<script>

import { mapActions, mapState } from 'vuex';
import Spinner from './pebble-ui/Spinner.vue';

export default {
    components: {Spinner},

    data() {
        return {

            requete: {
                operateurs: [''],
                projets: [''],
                controleurs: [''],
                dd: null,
                df: null,
                habilitation: [''],
                priorite: true,
                environnement:'private'
            },
            pending: {
                habilitations: false,
                agents: false,
                requete: false,
            },
            allHabilitations: null,
            operateurs: [],
            controleurs:[],
            // projets: [this.projets],

            displaySearch : '',
            displaySearchHab : '',
            displaySearchControleurs : '',
            displaySearchProjets : '',
        }
    },
    computed: {
        ...mapState(['projets'])
    },
    
    methods: {

        ...mapActions(['setRequete']),

       

        /**
         * Retourne la list trié en fonction de la recherche des opérateurs et tri alphabetiquement le resultat
         * 
         * @param {Array} list
         * 
         * @returns {Array} 
         */
        restrictSearch(list){
            let filteredList = list.filter((item) => {
                return item.cache_nom.match(this.displaySearch);
            });

            filteredList.sort((a, b) => {
                const nameA = a.cache_nom.toUpperCase();
                const nameB = b.cache_nom.toUpperCase();

                if (nameA < nameB) {
                    return -1;
                }

                if (nameA > nameB) {
                    return 1;
                }

                return 0;
            });
            return filteredList;
        },
         /**
         * Retourne la list trié en fonction de la recherche des controleurs et tri alphabetiquement le resultat
         * 
         * @param {Array} list
         * 
         * @returns {Array} 
         */
         restrictSearchControleurs(list){
            let filteredList = list.filter((item) => {
                return item.cache_nom.match(this.displaySearchControleurs);
            });

            filteredList.sort((a, b) => {
                const nameA = a.cache_nom.toUpperCase();
                const nameB = b.cache_nom.toUpperCase();

                if (nameA < nameB) {
                    return -1;
                }

                if (nameA > nameB) {
                    return 1;
                }

                return 0;
            });

            return filteredList;
        },
         /**
         * Retourne la liste triée en fonction de la recherche des projets et tri alphabetiquement le resultat
         * 
         * @param {Array} list
         * 
         * @returns {Array} 
         */
         restrictSearchProjets(list){
            let filteredList = list.filter((item) => {
                return item.intitule.match(this.displaySearchProjets);
            });

            filteredList.sort((a, b) => {
                const nameA = a.intitule.toUpperCase();
                const nameB = b.intitule.toUpperCase();

                if (nameA < nameB) {
                    return -1;
                }

                if (nameA > nameB) {
                    return 1;
                }

                return 0;
            });

            return filteredList;
        },

        /**
         * Retourne la list trié en fonction de la recherche des habilitations et tri alphabetiquement le resultat
         * 
         * @param {Array} list
         * 
         * @returns {Array} 
         */
        restrictSearchHab(list){
            if(list){
                let filteredList = list.filter((item) => {
                    return item.label.match(this.displaySearchHab);
                });
    
                filteredList.sort((a, b) => {
                    const nameA = a.label.toUpperCase();
                    const nameB = b.label.toUpperCase();
    
                    if (nameA < nameB) {
                        return -1;
                    }
    
                    if (nameA > nameB) {
                        return 1;
                    }
    
                    return 0;
                });

                return filteredList;
            } else {
                return list
            }

        },

        /**
         * Enregistre le résultat de la recherche/ des filtres dans le store.
         */
        searchStat() {
            this.pending.requete = true;
            let query = this.requete
            if(query.operateurs == ""){
                query.operateurs = []
            }
            if(query.controleurs == ""){
                query.controleurs = []
            }
            if(query.habilitation == ""){
                query.habilitation = []
            }
            if(query.projets == ""){
                query.projets = []
            }
            console.log(query,'queru')
            console.log(this.requete, 'avant init')
            this.setRequete(query);
            this.requete =  {
                operateurs: [''],
                projets: [''],
                controleurs: [''],
                dd: null,
                df: null,
                habilitation: [''],
                priorite: true,
                environnement:'private'
            },
            console.log(this.requete, 'apres')
            this.pending.requete = false;
            // this.$router.push({name: 'NewRequest'});

        },

        /**
         * Charge les données des habilitations via un appel API
         */
        getHabilitations(){
            this.pending.habilitations = true
            this.$app.api.get('/v2/characteristic/')
                .then(data => {
                    this.allHabilitations = data;
                })
                .catch(this.$app.catchError).finally(this.pending.habilitations = false);
        },

        /**
         * Charge les données des opérateurs via un appel API
         */
        getOp(){
            this.pending.agents = true
            this.$app.api.get('/v2/personnel', {
                limit: 999,
                
            })
                .then(data => {
                    this.controleurs = data;
                    this.operateurs = data;
                })
                .catch(this.$app.catchError).finally(this.pending.agents = false);
        },
        /**
         * Charge les données des projets via un appel API
         */
        //  getProjets(){
        //     this.$app.api.get('/v2/')
        //         .then(data => {
        //             this.projets = data;
        //         })
        //         .catch(this.$app.catchError);
        // }
    },

    mounted(){
        this.getHabilitations();
        this.getOp();
        
    }
}

</script>
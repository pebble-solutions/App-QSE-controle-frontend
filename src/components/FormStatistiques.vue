<template>
    <form class="p-2 my-2" @submit.prevent="searchStat()">

        <div class="mb-3">
            <h5>Période</h5>
            <label class="form-label" for="DateDebut">Date de début</label>
            <input type="date" class="form-control" id="dd" name="date" v-model="requete.dd" required>
        </div>

        <div class="mb-3">
            <label class="form-label" for="DateFin">Date de fin</label>
            <input type="date" class="form-control" id="df" name="date" v-model="requete.df" required>
        </div>

        <div class="mb-3">
            <label for="habilitation" class="form-label"><h5>Habilitation</h5></label>
            <input type="text" class="form-control mb-2 px-2" placeholder="Rechercher..." v-model="displaySearchHab">
            <select class="form-select" id="habilitation_id" name="habilitation" v-model="requete.habilitation" multiple size="8" :onclick='selectMe()'>
                <option value="" selected>Toutes</option>
                <option v-for="(hab) in restrictSearchHab(allHabilitations)" :value="hab.id" :key="hab.id">{{hab.label}}</option>
            </select>
        </div>

        <div class="mb-3">
            <label for="operateur" class="form-label"><h5>Opérateur</h5></label>
            <input type="text" class="form-control mb-2 px-2" placeholder="Rechercher..." v-model="displaySearch">
            <select class="form-select" id="cible_personnel" name="operateur" v-model="requete.operateurs" multiple size="8">
                <option value="" selected>Tous</option>
                <option v-for="(agent) in restrictSearch(operateurs)" :value="agent.id" :key="agent.id">{{agent.cache_nom}}</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label for="projet" class="form-label"><h5>Projet</h5></label>
            <input type="text" class="form-control mb-2 px-2" placeholder="Rechercher..." v-model="displaySearchProjets">
            <select class="form-select" id="projet" name="projet" v-model="requete.projets" multiple size="8">
                <option value="" selected>Tous</option>
                <option v-for="(projet) in restrictSearchProjets(projets)" :value="projet.id" :key="projet.id">{{projet.intitule}}</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label for="controleur" class="form-label"><h5>Contrôleur</h5></label>
            <input type="text" class="form-control mb-2 px-2" placeholder="Rechercher..." v-model="displaySearchControleurs">
            <select class="form-select" id="enqueteur_personnel" name="controleur" v-model="requete.controleurs" multiple size="8">
                <option value="" selected>Tous</option>
                <option v-for="(agent) in restrictSearchControleurs(controleurs)" :value="agent.id" :key="agent.id">{{agent.cache_nom}}</option>
            </select>
        </div>
        

        
        <div class="text-center">
            <button class="btn btn-primary btn-lg" type="submit" :disabled="pending.echeance">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="pending.echeance"></span>
                <i class="me-2 bi bi-calendar2-check" v-else></i>
                Afficher
            </button>
        </div>
    </form>
</template>

<script>

import { mapActions, mapState } from 'vuex';

export default {

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
                echeance: false
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

        ...mapActions(['requeteStat']),

        selectMe(){
            // console.log("/// Select me ///")
            // console.log(this.requete.habilitation[this.requete.habilitation.length])
            // console.log("/////////////////")
        },

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
            this.requeteStat(query)
        },

        /**
         * Charge les données des habilitations via un appel API
         */
        getHabilitations(){
            this.$app.api.get('/v2/characteristic/')
                .then(data => {
                    this.allHabilitations = data;
                })
                .catch(this.$app.catchError);
        },

        /**
         * Charge les données des opérateurs via un appel API
         */
        getOp(){
            this.$app.api.get('/v2/personnel', {
                limit: 999,
                
            })
                .then(data => {
                    this.controleurs = data;
                    this.operateurs = data;
                })
                .catch(this.$app.catchError);
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
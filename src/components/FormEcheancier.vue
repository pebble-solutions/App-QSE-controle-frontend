<template>
    <div class="text-secondary" v-if="pending.echeance || pending.habilitations || pending.operateurs">
        <span class="spinner-border spinner-border" role="status" aria-hidden="true"></span>
        Chargement...
    </div>

    <form v-else class="p-2 my-2" @submit.prevent="searchEcheancier()">

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
            <input type="text" class="form-control mb-2 px-2" placeholder="Rechercher..." v-model="habilitationsTypeSearchValue">

            <select class="form-select" id="habilitation_id" name="habilitation" v-model="requete.habilitation" multiple size="5">
                <option value="" selected>Toutes</option>
                <option v-for="(hab) in filteredHabilitationsTypes" :value="hab.id" :key="hab.id">{{hab.nom}}</option>
            </select>
        </div>


        <div class="mb-3">
            <label for="operateur" class="form-label"><h5>Opérateur</h5></label>
            <input type="text" class="form-control mb-2 px-2" placeholder="Rechercher..." v-model="operateursSearchValue">
            <select class="form-select" id="cible_personnel" name="operateur" v-model="requete.operateurs" multiple size="5">
                <option value="" selected>Tous</option>
                <option v-for="(agent) in filteredOperateurs" :value="agent.id" :key="agent.id">{{agent.cache_nom}}</option>
            </select>
        </div>

        <!-- Désactivé pour stabilisation -->
        <!-- <div class="mb-3">
            <label for="kn" class="form-label"><h5>Regrouper</h5></label>

            <div class="btn-group w-100" role="group" aria-label="Basic radio toggle button group">
                <input type="radio" class="btn-check" name="priorite" id="switchOperateurs" autocomplete="off" v-model="requete.priorite" :value="false">
                <label class="btn btn-outline-secondary" for="switchOperateurs">Par opérateurs</label>

                <input type="radio" class="btn-check" name="priorite" id="switchHabilitation" autocomplete="off" v-model="requete.priorite" :value="true">
                <label class="btn btn-outline-secondary" for="switchHabilitation">Par habilitations</label>
            </div>
        </div> -->
        
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

import { mapActions } from 'vuex';

export default {

    data() {
        return {
            requete: {
                operateurs: [''],
                dd: null,
                df: null,
                habilitation: [''],
                priorite: true,
                environnement:'private'
            },
            pending: {
                echeance: false
            },
            allHabilitationsTypes: [],
            allOperateurs: [],

            operateursSearchValue : '',
            habilitationsTypeSearchValue : ''
        }
    },

    computed: {
        /**
         * Retourne la liste des types d'habilitations classées par nom et filtrés en fonction 
         * de la recherche
         */
        filteredHabilitationsTypes() {
            return this.filterAndSort(this.allHabilitationsTypes, "nom", this.habilitationsTypeSearchValue);
        },

        /**
         * Retourne la liste des opérateurs classés par nom et filtrés en fonction de la recherche
         */
        filteredOperateurs() {
            return this.filterAndSort(this.allOperateurs, "cache_nom", this.operateursSearchValue);
        }
    },
    
    methods: {

        ...mapActions(['setEcheance']),


        /**
         * Retourne la list trié en fonction de la recherche des opérateurs et tri alphabetiquement le resultat
         * 
         * @param {Array} list
         * 
         * @returns {Array} 
         */
        filterAndSort(list, keyName, searchValue) {

            if(!list) return [];

            let sortedList = list.filter((item) => {
                return item[keyName]?.toUpperCase()?.match(searchValue.toUpperCase());
            });

            if (!sortedList) return [];

            sortedList.sort((a, b) => {
                const nameA = a[keyName].toUpperCase();
                const nameB = b[keyName].toUpperCase();

                if (nameA < nameB) {
                    return -1;
                }

                if (nameA > nameB) {
                    return 1;
                }

                return 0;
            });

            return sortedList;
        },

        /**
         * Enregistre le résultat de la recherche/ des filtres dans le store.
         */
        searchEcheancier() {
            let query = this.requete;

            if (query.operateurs == "") {
                query.operateurs = [];
            }

            if (query.habilitation == "") {
                query.habilitation = [];
            }
            this.setEcheance(JSON.parse(JSON.stringify(query)));
        },

        /**
         * Charge les données des habilitations via un appel API
         */
        getHabilitations() {
            this.allHabilitationsTypes = this.$assets.getCollection("habilitationsTypes").getCollection();
        },

        /**
         * Charge les données des opérateurs via un appel API
         */
        getOperateurs() {
            this.allOperateurs = this.$assets.getCollection("personnels").getCollection();
        }
    },

    mounted() {
        this.getHabilitations();
        this.getOperateurs();
    }
}

</script>
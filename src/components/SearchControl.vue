<template>
    <form @submit.prevent="search()" class="m-1">
        <div class="input-group mb-1">
            <input type="date" class="form-control" id="dateDebutDone"  v-model="searchDd">
            <input type="date" class="form-control" id="dateFinDone" v-model="searchDf">
            <button class="btn btn-primary" type="submit" :disabled="pendingSearch">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="pendingSearch"></span>
                <i class="bi bi-funnel" v-else></i>
            </button>
        </div>
        <div class="dropdown d-grid mb-1">
            <button type="button" class="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="pendingSearch"></span>
                <i class="bi bi-list" v-else></i>
                {{currentModeLabel}}
            </button>
            <ul class="dropdown-menu">
                <button type="button" class="dropdown-item d-flex align-items-center justify-content-between" 
                    @click.prevent="setModeAndSearch(index)" 
                    v-for="(label, index) in modesDict" 
                    :key="index">
                    {{label}}
                    <i class="bi bi-check text-success" v-if="index == mode"></i>
                </button>
            </ul>
        </div>
    </form>
</template>
<script>

import date from 'date-and-time';
import { searchConsultation } from '../js/search-consultation';
import { mapActions } from 'vuex';

export default {
    props: {
        dd: {
            type: String,
        },
        df: {
            type: String,
        },
        mode: {
            type: String,
            default: 'collecte',
            required: true,
        },
        pendingSearch: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            searchDd: null,
            searchDf: null,
            searchMode: 'collecte',
            modesDict: {
                collecte: "Tous les contrôles",
                formulaire: "Grouper par questionnaire",
                projet: "Grouper par projet"
            }
        }
    },

    emits: ['update:dd', 'update:df', 'update:mode', 'update:pendingSearch', 'search-result'],

    computed: {
        /**
         * Retourne le libellé du mode d'affichage sélectionné
         * @return {string}
         */
        currentModeLabel() {
            return this.modesDict[this.mode];
        }
    },

    watch: {
        /**
         * Observe le changement de valeur date début et émet un évènement
         * @param {date} newVal 
         */
        searchDd(newVal) {
            this.updateVal('dd', newVal);
        },
        /**
         * Observe le changement de valeur date fin et émet un évènement
         * 
         * @param {date} newVal 
         */
        searchDf(newVal) {
            this.updateVal('df', newVal);
            
        },
        /**
         * Observe le changement de valeur du choix des options de tri et émet un évènement
         * 
         * @param   {string} newVal
         */
        searchMode(newVal){
            this.updateVal('mode', newVal);
        },

    },

    methods: {
        ...mapActions(['setSearchResults']),

        /**
         * 
         * @param {*} key 
         * @param {*} val 
         */
        updateVal(key, val) {
            this.$emit('update:'+key, val);
        },

        /**
		 * Modifie le format de la date entrée en paramètre et la retourne 
		 * sous le format 01 févr. 2021
		 * @param {string} date 
		 */
		changeFormatDateLit(el) {
			return date.format(new Date(el), 'DD MMM YYYY')
		},

        /**
         * Change le mode de recherche et d'affichage et lance la recherche
         * 
         * @param {string} mode        'collecte', 'formulaire', 'projet'
         */
        setModeAndSearch(mode) {
            this.searchMode = mode;
            this.search();
        },

        /**
         * Lance une recherche, met à jour les informations sur le store.
         */
        search() {
            this.updateVal('pendingSearch', true);

            searchConsultation({
                dd: this.searchDd,
                df: this.searchDf,
                mode: this.searchMode
            }, this.$app).then(data => {
                this.$emit('search-result', data);
                this.setSearchResults(data);
            }).catch(this.$app.catchError).finally(() => this.updateVal('pendingSearch', false));
        }
    },

    mounted() {
        this.searchDd = this.dd;
        this.searchDf = this.df;
        this.searchMode = this.mode;
    }
    
}

</script>
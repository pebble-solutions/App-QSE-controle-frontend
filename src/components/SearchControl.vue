<template>
    <form @submit.prevent="search()" class="m-1">
        <div class="dropdown d-grid mb-1">
            <button type="button" class="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown">
                <i class="bi bi-list"></i>
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
        <div class="input-group">
            <input type="date" class="form-control" id="dateDebutDone"  v-model="searchDd">
            <input type="date" class="form-control" id="dateFinDone" v-model="searchDf">
            <button class="btn btn-primary" type="submit">
                <i class="bi bi-funnel"></i>
            </button>
        </div>
    </form>
</template>
<script>

import date from 'date-and-time';

export default {
    props: {
        dd: {
            type: String,
        },
        df: {
            type: String,
        },
        mode: {
            option: String,
            default: 'collecte',
            required: true,
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

    emits: ['update:dd', 'update:df', 'update:mode', 'search'],

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
         * Envoie un événement pour lancer la recherche
         */
        search() {
            this.$emit('search');
        }
    },

    mounted() {
        this.searchDd = this.dd;
        this.searchDf = this.df;
        this.searchMode = this.mode;
    }
    
}

</script>
<template>
    <form @submit.prevent="search()" class="m-1">
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
        <div class="input-group mb-1">
            <input type="date" class="form-control" id="dateDebutDone"  v-model="searchDd">
            <input type="date" class="form-control" id="dateFinDone" v-model="searchDf">
            <button class="btn btn-primary" type="submit" :disabled="pendingSearch">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="pendingSearch"></span>
                <i class="bi bi-funnel" v-else></i>
            </button>
        </div>
        <div v-if="mode == 'kn_wtbcl'" class="d-flex justify-content-around mt-2">
            <div v-for="(label, index) in valueSAMI" :key="index">
                <input type="checkbox" class="btn-check" :id="'btn-' + index" autocomplete="off" :value="label" v-model="valueSAMI[index].value">
                <label class="btn " :class="label.style" :for="'btn-' + index" style="width:40px">{{ index }}</label><br>
            </div>

        </div>
    </form>
    
</template>
<script>

import { searchConsultation } from '../js/search-consultation';
import { mapActions } from 'vuex';
import { dateFormat } from '../js/collecte';

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
        },
        
    },

    data() {
        return {
            searchDd: null,
            searchDf: null,
            searchMode: 'collecte',
            searchStart: 0,
            searchLimit: 50,
            noMoreAvailable: false,
            modesDict: {
                collecte: "Tous les contrôles",
                formulaire: "Grouper par questionnaire",
                projet: "Grouper par projet",
                kn_wtbcl: "Contrôles non-bouclés",
                ss_operateur: "Contrôles non-affectés à un opérateur",
                ss_controleur: "Contrôles non-affectés à un contrôleur",
                operateur: "Grouper par opérateur",
                controleur: "Grouper par contrôleur",
                kndekn : "Contrôles de contrôle",
                knsskn : "Contrôles non contrôlés"
                
            },

            valueSAMI: {
                S:{ value: false, style:'btn-outline-success'},
                A:{ value: false, style:'btn-outline-primary'},
                M:{ value: true, style:'btn-outline-warning'},
                I:{ value: true, style:'btn-outline-danger'},
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
        },
        


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
			return dateFormat(el);
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
            let knsFilter = Object.keys(this.valueSAMI).filter((sami) => this.valueSAMI[sami].value);

            this.updateVal('pendingSearch', true)
                      searchConsultation({
                dd: this.searchDd,
                df: this.searchDf,
                mode: this.searchMode,
                start: this.searchStart,
                limit: this.searchLimit,
                kns: knsFilter
            }, this.$app).then(data => {
                this.$emit('search-result', data);
                this.setSearchResults(data);
                this.routeToVue(this.searchMode);
            }).catch(this.$app.catchError).finally(() => this.updateVal('pendingSearch', false));
        },
        /**
         * Affiche la liste des contrôles programmés avec le formulaire
         * 
         * @param {object} collecte
         */ 
		routeToVue(mode) {
			let route = mode === 'collecte' ? '/consultation' : '/consultation/'+mode;
            this.$router.push(route);
        },
    },

    mounted() {
        this.searchDd = this.dd;
        this.searchDf = this.df;
        this.searchMode = this.mode;
    }
    
}

</script>
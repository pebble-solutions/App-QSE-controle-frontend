<template>
    <form @submit.prevent="search()" class="m-1">
        <div class="dropdown d-grid mb-1">
            <button type="button" class="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="pendingSearch"></span>
                <i class="bi bi-list" v-else></i>
                {{currentModeLabel}}
            </button>
            <ul class="dropdown-menu">
                <li v-for="(label, index) in modesDict" :key="index">
                    <button
                    type="button"
                    class="dropdown-item d-flex align-items-center justify-content-between"
                    @click.prevent="setModeAndSearch(index)">
                        {{ label }}
                        <i class="bi bi-check text-success" v-if="index === mode"></i>
                    </button>
                </li>
            </ul>
        </div>

        <div v-if="isFilterable">
            <div class="input-group mb-1" v-if="isFilterable">
                <input type="date" class="form-control" id="dateDebutDone"  v-model="searchDd">
                <input type="date" class="form-control" id="dateFinDone" v-model="searchDf">
                <button class="btn" :class="filterButtonClassName" type="button" @click.prevent="toggleFilter()">
                    <span class="me-1" v-if="filterCount">{{ filterCount }}</span>
                    <i class="bi bi-filter"></i>
                </button>
                <button class="btn btn-primary" type="submit" :disabled="pendingSearch">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="pendingSearch"></span>
                    <i class="bi bi-funnel" v-else></i>
                </button>
            </div>
            <div class="d-flex justify-content-around mt-2" v-if="displayFilter">
                <div v-for="(label, index) in valueSAMI" :key="index">
                    <input
                        type="checkbox"
                        class="btn-check"
                        :id="'btn-' + index"
                        autocomplete="off"
                        :value="label"
                        v-model="valueSAMI[index].value">
                    <label
                        class="btn"
                        :class="label.style"
                        :for="'btn-' + index"
                        style="width: 40px">
                        {{ index }}
                    </label>
                </div>
                <div>
                    <input
                    type="checkbox"
                    class="btn-check"
                    id="btn-sansResultat"
                    autocomplete="off"
                    :value="valueNOSami.label"
                    v-model="valueNOSami.value" />
                    <label
                    class="btn btn-outline-secondary"
                    for="btn-sansResultat"
                    style="width: 40px">{{ valueNOSami.label }}</label>
                </div>
            </div>
        </div>
    </form>
    
</template>
<script>

import { searchConsultation } from '../../js/search-consultation';
import { mapActions } from 'vuex';
import { dateFormat } from '../../js/collecte';

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
            displayFilter: false,
            modesDict: {
                collecte: "Tous les contrôles",
                formulaire: "Grouper par questionnaire",
                projet: "Grouper par projet",
                kn_wtbcl: "Contrôles non-bouclés",
                ss_operateur: "Contrôles sans opérateur",
                ss_controleur: "Contrôles sans contrôleur",
                operateur: "Grouper par opérateur",
                controleur: "Grouper par contrôleur",
                kndekn : "Contrôles de contrôle",
                knsskn : "Contrôles non contrôlés"
            },
            filterableModes: ["collecte", "kn_wtbcl", "ss_operateur", "ss_controleur", "kndekn", "knsskn"],

            valueSAMI: {
                S:{ value: true, style:'btn-outline-success'},
                A:{ value: true, style:'btn-outline-primary'},
                M:{ value: true, style:'btn-outline-warning'},
                I:{ value: true, style:'btn-outline-danger'},
            },
            valueNOSami : { label : '?',value : true }
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

        /**
         * Retourne le nom de la classe du bouton de filtre
         * 
         * - Si les filtres sont affichés, le bouton est plein. 
         * - Si les filtres sont masqués, le bouton est outline.
         * - Si des filtres sont actifs, le bouton est warning
         * 
         * @return {string}
         */
        filterButtonClassName() {
            let color = "secondary";

            if (this.filterCount > 0) {
                color = "warning";
            }

            if (this.displayFilter) {
                return "btn-"+color;
            }

            return "btn-outline-"+color;
        },

        /**
         * Retourne le nombre de filtre cochés par rapport aux valeurs de base.
         * 
         * @return {number}
         */
        filterCount() {
            let count = 0;

            for (const key in this.valueSAMI) {
                if (!this.valueSAMI[key].value) {
                    count += 1;
                    break;
                }
            }

            if (!this.valueNOSami.value && !count) {
                count += 1;
            }

            return count;
        },

        /**
         * Retourne true si le mode d'affichage peut être filtré
         * 
         * @return {bool}
         */
        isFilterable() {
            return this.filterableModes.includes(this.mode);
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
        searchMode(newVal) {
            this.updateVal('mode', newVal);
        },

        /**
         * Lorsque les filtres sont masqués, la recherche est re-lancée.
         * 
         * @param {bool} newVal Nouvelle valeur d'affichage
         */
        displayFilter(newVal) {
            if (!newVal) {
                this.search();
            }
        }

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

            if(this.valueNOSami.value == true){
                knsFilter.push(this.valueNOSami.label);
            }

            this.updateVal('pendingSearch', true);
            searchConsultation({
                dd: this.searchDd,
                df: this.searchDf,
                mode: this.searchMode,
                start: this.searchStart,
                limit: this.searchLimit,
                result_var: knsFilter
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

        /**
         * Basculer l'affichage des filtres de recherche
         * 
         * @param {bool} val Forcer un mode
         */
        toggleFilter(val) {
            if (typeof val === "undefined") {
                val = !this.displayFilter;
            }

            this.displayFilter = val;
        }
    },

    mounted() {
        this.searchDd = this.dd;
        this.searchDf = this.df;
        this.searchMode = this.mode;
    }
    
}

</script>
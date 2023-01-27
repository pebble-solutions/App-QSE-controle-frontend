<template>
    <div>
        <div class="m-2 text-center"  >
            <span v-if="dd" class="badge bg-primary me-1">du  {{ changeFormatDateLit(searchDd) }}</span>
            <span v-if="df" class="badge bg-primary me-1"> au {{ changeFormatDateLit(searchDf) }}</span>
            <span class="badge bg-primary me-1" >{{displayMode(searchMode)}}</span>  
        </div>

        <form @submit.prevent="search()" class="m-1">   
            <div class="input-group">
                <div class="col">
                    <input type="date" class="form-control" id="dateDebutDone"  v-model="searchDd">
                    <input type="date" class="form-control" id="dateFinDone" v-model="searchDf">
                </div>

                <div class="btn-group col">
                    <button type="button" class="btn rounded-0 btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown"><i class="bi bi-list"></i>Options</button>
                    <ul class="dropdown-menu">
                        <button type="button" class="dropdown-item" @click.prevent="setModeAndSearch('collecte')">Tous les contrôles<span><i v-if="this.mode == 'collecte'" class="ms-1 bi bi-check"></i></span></button>
                        <button type="button" class="dropdown-item" @click.prevent="setModeAndSearch('formulaire')">Grouper par questionnaire<span><i v-if="this.mode == 'formulaire'" class="ms-1 bi bi-check"></i></span></button>
                        <button type="button" class="dropdown-item" @click.prevent="setModeAndSearch('projet')">Grouper par projet<span><i v-if="this.mode == 'projet'" class="ms-1 bi bi-check"></i></span></button>
                    </ul>
                </div>
            </div>
        </form>

        
    </div>
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
        setModeAndSearch(mode){
            this.searchMode= mode
        },
        /**
         * Affiche les options de tri choisies par l'utilisateur
         * 
         */
        displayMode(){
            if(this.mode == 'collecte'){
                return 'Tous les contrôles'
            }
            else if (this.mode === 'formulaire'){
        
                return 'par formulaires'
            }
            else if (this.mode === 'projet'){
                return 'par projets'
            }
            else {
                return 'Tous les contrôles'
            }
        },
    },

    mounted() {
        this.searchDd = this.dd;
        this.searchDf = this.df;
        this.searchmode = 'collecte'
    }
    
}

</script>
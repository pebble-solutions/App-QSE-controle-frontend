<template>
    <div>
        <div class="m-2 text-center"  >
            <span v-if="dd" class="badge bg-primary me-1">du  {{ changeFormatDateLit(dd) }}</span>
            <span v-if="df" class="badge bg-primary me-1"> au {{ changeFormatDateLit(df) }}</span>
            <!-- <span class="badge bg-primary me-1" >{{displayMode(mode)}}</span>   -->
        </div>

        <form @submit.prevent="search()" class="m-1">   
            <div class="input-group">
                <div class="col">
                    <input type="date" class="form-control" id="dateDebutDone"  v-model="searchDd">
                    <input type="date" class="form-control" id="dateFinDone" v-model="searchDf">
                </div>
                <div class="btn-group col">
                    <select v-model ="searchMode" class="form-select" >
                        <option value="collecte">Tous contrôles</option>
                        <option value="formulaire"> par questionnaire</option>
                        <option value="projet"> par projet</option>
                    </select>
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
         * Observe le changement de valeur de la variable date début et émet un évènement
         * @param {date} newVal 
         */
        searchDd(newVal) {
            this.updateVal('dd', newVal);
        },
        /**
         * Observe le changement de valeur de la variable date fin et émet un évènement
         * 
         * @param {date} newVal 
         */
        searchDf(newVal) {
            this.updateVal('df', newVal);
        },
        /**
         * Observe le changement de valeur de la variable de tri et émet un évènement
         * 
         * @param   {string} newVal
         */

        searchMode(newVal){
            this.updateVal('option', newVal);
        }
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
    },

    mounted() {
        this.searchDd = this.dd;
        this.searchDf = this.df;
    }
    
}

</script>
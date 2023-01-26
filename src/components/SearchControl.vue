<template>
    <div>
        <div v-if="!result.length" class="m-2 text-center">
			<alert-message class-name="m-2">0 résultat</alert-message>
        </div>
        <div class="m-2 text-center" v-else-if="result" >
            <span class="badge bg-primary me-1" v-if="resultSearch.dd">du {{ changeFormatDateLit(resultSearch.dd) }}</span>
            <span class="badge bg-primary me-1" v-if="resultSearch.df"> au {{ changeFormatDateLit(resultSearch.df) }}</span> 
            <span class="badge bg-primary me-1" >{{displayMode(resultSearch.mode)}}</span>  
        </div>

        <!-- <form @submit.prevent="updateSearchControl()" :value= "modelValue" class="m-1" > -->
            
        <form @submit.prevent="search()" class="m-1">   
            <div class="input-group">
                <div class="col">

                    <input type="date" class="form-control" id="dateDebutDone" name="dd" v-model="resultSearch.dd">
                    <input type="date" class="form-control" id="dateFinDone" name="df" v-model="resultSearch.df">
                </div>
                <div class="btn-group col">
                    <button type="button" class="btn rounded-0 btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown"><i class="bi bi-list"></i>Options</button>
                    <ul class="dropdown-menu">
                        <button type="button" class="dropdown-item" @click.prevent="setModeAndSearch('collecte')">Tous les contrôles<span><i v-if="this.resultSearch.mode == 'tous'" class="ms-1 bi bi-check"></i></span></button>
                        <button type="button" class="dropdown-item" @click.prevent="setModeAndSearch('formulaire')">Grouper par questionnaire<span><i v-if="this.resultSearch.mode == 'formulaire'" class="ms-1 bi bi-check"></i></span></button>
                        <button type="button" class="dropdown-item" @click.prevent="setModeAndSearch('projet')">Grouper par projet<span><i v-if="this.resultSearch.mode == 'projet'" class="ms-1 bi bi-check"></i></span></button>
                    </ul>
                </div>
                <button class="btn btn-outline-primary" type="submit"><i class="bi bi-arrow-return-left"></i></button>
                <!--</i><i class="bi bi-arrow-right"></i> alternative au chariot entréee-->
            </div>
        </form>

        <template v-for="res in result" :key="res.id">
            <app-menu-item v-if="this.resultSearch.mode ==  'collecte' || this.resultSearch.mode =='tous'" :href="'/consultation/'+res.id">
                <collecte-item-done :collecte="res"></collecte-item-done>
            </app-menu-item>
            <app-menu-item v-else-if="this.resultSearch.mode == 'formulaire' && res.nb_done != 0" :href="'/consultation/formulaire/'+res.id" >
                <formulaire-item :num="res.nb_done" :formulaire="res" ></formulaire-item>
            </app-menu-item>
            <app-menu-item v-else-if="this.resultSearch.mode =='projet' && res.nb_done != 0" :href="'/consultation/projet/'+res.id">
                <project-item-done :num="res.nb_done" :projet="res" ></project-item-done>
            </app-menu-item>
        </template>
    </div>
</template>
<script>
import AppMenuItem from './pebble-ui/AppMenuItem.vue';
import FormulaireItem from './menu/FormulaireItem.vue';
import ProjectItemDone from './menu/ProjectItemDone.vue';
import AlertMessage from './pebble-ui/AlertMessage.vue';
import date from 'date-and-time';
import CollecteItemDone from './menu/collecteItemDone.vue';

export default {
components: {  AppMenuItem, FormulaireItem,  ProjectItemDone, CollecteItemDone, AlertMessage},

    // props: {
    //     modelValue: Object
    // },

    data() {
        return {
            pending: {
                search:false
            },
            result: [],
            resultSearch: [
                {
                    dd:null,
                    df:null,
                    mode: 'collecte'
                }
            ],
            // dd: null,
            // df: null,
            // mode: 'tous',

        }
    },

    methods: {

        // updateSearchControl(resultSearch) {
        //     this.$emit('update:modelValue', resultSearch);
        // },

        /**
         * Affiche le libellé des filtres actifs
         * 
         * 
         */


        /**
         * Lance la recherche des données et met à jour le store.
         * 
         * La route d'API appelée dépend de la valeur de this.mode
         * - tous ou collecte : api/data/GET/collecte
         * - formulaire : api/data/GET/formulaire
         * - projet : api/data/GET/projet
         */
        search() {
            this.pending.search = true;

                if(this.resultSearch.mode == 'collecte' || this.resultSearch.mode =='tous'){
                    this.$app.apiGet('data/GET/collecte', {
                        environnement: 'private',
                        done: 'OUI',
                        dd_done: this.resultSearch.dd,
                        df_done: this.resultSearch.df,
                    }) 
                    .then((data) => {
                        this.result = data;
                        console.log (this.result,'resultcollecte');
                    })
                    .catch(this.$app.catchError)
        
                    .finally(this.pending.search = false);
                }

                else if(this.resultSearch.mode == 'formulaire') {
                    this.$app.apiGet('data/GET/formulaire', {
                        environnement: 'private',
                        stats_dd: this.resultSearch.dd,
                        stats_df: this.resultSearch.df,
                    }) 
                    .then((data) => {
                        console.log(data, 'getformulaire');
                        this.result = data;
                        console.log (this.result, 'resultformulaire');
                    })
                    .catch(this.$app.catchError)
        
                    .finally(this.pending.search = false);
                }

                else if(this.resultSearch.mode == 'projet'){
                    console.log(this.resultSearch.dd)
                    this.$app.apiGet('data/GET/projet', {
                        environnement: 'private',
                        stats_dd: this.resultSearch.dd,
                        stats_df: this.resultSearch.df,
                    }) 
                    .then((data) => {
                        this.result = data;
                        console.log (this.result, 'resultprojet');
                    })
                    .catch(this.$app.catchError)
        
                    .finally(this.pending.search = false);
                }
        
        },

        /**
         * Défini le mode d'affichage et lance la recherche des données.
         * 
         * @param {string} mode 'collecte', 'formulaire', 'projet'
         */
        setModeAndSearch(mode) {
            this.resultSearch.mode = mode;
            console.log(this.resultSearch.mode, 'mode')
            // this.search(this.mode);
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
         * Affiche le tri choisi par l'utilisateur
         * 
         */
        displayMode(){
            if(this.resultSearch.mode == 'collecte'){
                return 'Tous les contrôles'
            }
            else if (this.resultSearch.mode === 'formulaire'){
        
                return 'Triés par type'
            }
            else if (this.resultSearch.mode === 'projet'){
                return 'Triés par projet'
            }
            else {
                return 'Tous les contrôles'
            }
        },
    },

    mounted(){
        this.search(this.resultSearch.mode);
    }
}

</script>
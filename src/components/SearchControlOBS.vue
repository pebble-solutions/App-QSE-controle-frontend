<template>
    <div>
        <div v-if="!result.length" class="m-2 text-center">
			<alert-message class-name="m-2">0 résultat</alert-message>
        </div>
        <div class="m-2 text-center" v-else-if="result" >
            <span class="badge bg-primary me-1" v-if="dd">du {{ changeFormatDateLit(dd) }}</span>
            <span class="badge bg-primary me-1" v-if="df"> au {{ changeFormatDateLit(df) }}</span> 
            <span class="badge bg-primary me-1" >{{displayMode(mode)}}</span>  
        </div>

        <!-- <form @submit.prevent="updateSearchControl()" :value= "modelValue" class="m-1" > -->
            
        <form @submit.prevent="search()" class="m-1">   
            <div class="input-group">
                <div class="col">

                    <input type="date" class="form-control" id="dateDebutDone" name="dd" v-model="dd">
                    <input type="date" class="form-control" id="dateFinDone" name="df" v-model="df">
                </div>
                <div class="btn-group col">
                    <button type="button" class="btn rounded-0 btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown"><i class="bi bi-list"></i>Options</button>
                    <ul class="dropdown-menu">
                        <button type="button" class="dropdown-item" @click.prevent="setModeAndSearch('collecte')">Tous les contrôles<span><i v-if="this.mode == 'tous'" class="ms-1 bi bi-check"></i></span></button>
                        <button type="button" class="dropdown-item" @click.prevent="setModeAndSearch('formulaire')">Grouper par questionnaire<span><i v-if="this.mode == 'formulaire'" class="ms-1 bi bi-check"></i></span></button>
                        <button type="button" class="dropdown-item" @click.prevent="setModeAndSearch('projet')">Grouper par projet<span><i v-if="this.mode == 'projet'" class="ms-1 bi bi-check"></i></span></button>
                    </ul>
                </div>
                <button class="btn btn-outline-primary" type="submit"><i class="bi bi-arrow-return-left"></i></button>
                <!--</i><i class="bi bi-arrow-right"></i> alternative au chariot entréee-->
            </div>
        </form>

        <template v-for="res in result" :key="res.id">
            <app-menu-item v-if="this.mode ==  'collecte' || this.mode =='tous'" :href="'/consultation/'+res.id">
                <collecte-item-done :collecte="res"></collecte-item-done>
            </app-menu-item>
            <app-menu-item v-else-if="this.mode == 'formulaire' && res.nb_done != 0" :href="'/consultation/formulaire/'+res.id" >
                <formulaire-item :num="res.nb_done" :formulaire="res" ></formulaire-item>
            </app-menu-item>
            <app-menu-item v-else-if="this.mode =='projet' && res.nb_done != 0" :href="'/consultation/projet/'+res.id">
                <project-item-done :num="res.nb_done" :projet="res" ></project-item-done>
            </app-menu-item>
        </template>

        <div class="d-grid">
            <button class="btn my-2 btn-outline-secondary" type="button" @click.prevent="loadPlus()" :disabled="pending.search" v-if="isMoreAvailable">
                <span class="spinner-border spinner-border-sm" v-if="pending.search"></span>
                <i class="bi bi-plus" v-else></i>
                Charger plus
            </button>
        </div>

        <alert-message icon="bi-info-circle-fill" v-if="noMoreAvailable">Oops, y'a pu !</alert-message>
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
            mode: 'collecte',
            pending: {
                search:false
            },
            result: [],
            dd: null,
            df: null,
            start: 0,
            limit: 50,
            noMoreAvailable: false
        }
    },

    computed: {
        /**
         * Contrôle si il peut exister plus de résultats sur le serveurs que 
         * de données stockées dans résults.
         * 
         * On concidère qu'il peut exister des résultats supplémentaires sur le serveur
         * à partir du moment ou il y a plus de 50 items dans result et que result / 50 est
         * égal à 1.
         * 
         * @return {bool}
         */
        isMoreAvailable() {
            let ln = this.result.length;
            return (ln && ln % this.limit === 0 && !this.noMoreAvailable);
        }
    },

    methods: {

        // updateSearchControl( {
        //     this.$emit('update:modelValue', ;
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
         * 
         * @param {object} options
         * - mode           'replace' (défaut), 'append' (ajout des données à la fin de la liste)
         */
        search(options) {

            if (!['collecte', 'projet', 'formulaire'].includes(this.mode)) {
                alert("Erreur dans le mode d'information sélectionné.");
                return false;
            }

            options = typeof options === 'undefined' ? {} : options;

            if (!options.mode) {
                this.start = 0;
                this.noMoreAvailable = false;
            }

            this.pending.search = true;

            let query = {
                environnement: 'private',
                start: this.start,
                limit: this.limit,
                dd_done: null,
                df_done: null,
                stats_dd: null,
                stats_df: null,
                done: null
            };

            if (this.mode == 'collecte') {
                query.dd_done = this.dd;
                query.df_done = this.df;
                query.done = 'OUI';
            }
            else {
                query.stats_dd = this.dd;
                query.stats_df = this.df;
            }

            let url = `data/GET/${this.mode}`;

            this.$app.apiGet(url, query).then((data) => {
                if (options.mode == 'append') {
                    if (!data.length) {
                        this.noMoreAvailable = true;
                    } else {
                        this.result = this.result.concat(data);
                    }
                }
                else {
                    this.result = data;
                }
            })
            .catch(this.$app.catchError).finally(this.pending.search = false);
        },

        /**
         * Défini le mode d'affichage et lance la recherche des données.
         * 
         * @param {string} mode 'collecte', 'formulaire', 'projet'
         */
        setModeAndSearch(mode) {
            this.mode = mode;
            this.search();
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
            if(this.mode == 'collecte'){
                return 'Tous les contrôles'
            }
            else if (this.mode === 'formulaire'){
        
                return 'Triés par type'
            }
            else if (this.mode === 'projet'){
                return 'Triés par projet'
            }
            else {
                return 'Tous les contrôles'
            }
        },

        /**
         * Charge la suite des données lorsque le nombre de résultats est > à 50 
         * et divisible par 50 en nombre entier.
         */
        loadPlus() {
            if (this.isMoreAvailable) {
                this.start += this.limit;
                this.search({
                    mode: 'append'
                });
            }
        }
    },

    mounted(){
        this.search(this.mode);
    }
}

</script>
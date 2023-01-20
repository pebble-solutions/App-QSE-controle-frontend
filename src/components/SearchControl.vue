<template>
    <div>
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
        <div class="m-2 text-center" v-if="result" >
            <span class="badge bg-primary me-1" >{{displayMode(mode)}}</span>  
            <span class="badge bg-primary me-1" v-if="dd">du {{ changeFormatDateLit(dd) }}</span>
            <span class="badge bg-primary me-1" v-if="df"> au {{ changeFormatDateLit(df) }}</span> 
        </div>
        <div v-else class="m-2 text-center">
            <span class="badge bg-primary me-1">Pas de résultats</span>
        </div>
        <template v-for="res in result" :key="res.id">
            <app-menu-item v-if="this.mode ==  'collecte'" :href="'/consultation/'+res.information__groupe_id+'/'+res.id">
                <collecte-item-done :collecte="res"></collecte-item-done>
            </app-menu-item>
            <app-menu-item v-else-if="this.mode == 'formulaire' && res.nb_done != 0" :href="'/consultation/'+res.id" >
                <formulaire-item :num="res.nb_done" :formulaire="res" ></formulaire-item>
                <!-- {{ res.groupe }} <span class="badge bg-secondary">{{ res.nb_done }}</span> -->
            </app-menu-item>
            <app-menu-item v-else-if="this.mode =='projet' && res.nb_done != 0" :href="'/#'">
                <project-item-done :num="res.nb_done" :projet="res" ></project-item-done>
            </app-menu-item>
        </template>
    </div>
</template>
<script>
import AppMenuItem from './pebble-ui/AppMenuItem.vue';
import FormulaireItem from './menu/FormulaireItem.vue';
import ProjectItemDone from './menu/ProjectItemDone.vue';
import date from 'date-and-time';
import CollecteItemDone from './menu/collecteItemDone.vue';

export default {
components: {  AppMenuItem, FormulaireItem,  ProjectItemDone, CollecteItemDone},

    data() {
        return {
            mode: 'tous',
            pending: {
                search:false
            },
            result: [],
            resultSearch: [],
            dd: null,
            df: null,
        }
    },

    methods: {

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
                console.log(this.dd)

                if(this.mode == 'collecte' || this.mode =='tous'){
                    this.$app.apiGet('data/GET/collecte', {
                        environnement: 'private',
                        done: 'OUI',
                        dd_done: this.dd,
                        df_done: this.df,
                    }) 
                    .then((data) => {
                        this.result = data;
                        console.log (this.result,'resultcollecte');
                    })
                    .catch(this.$app.catchError)
        
                    .finally(this.pending.search = false);
                }

                else if(this.mode == 'formulaire') {
                    this.$app.apiGet('data/GET/formulaire', {
                        environnement: 'private',
                        stats_dd: this.dd,
                        stats_df: this.df,
                    }) 
                    .then((data) => {
                        console.log(data, 'getformulaire');
                        this.result = data;
                        console.log (this.result, 'resultformulaire');
                    })
                    .catch(this.$app.catchError)
        
                    .finally(this.pending.search = false);
                }

                else if(this.mode == 'projet'){
                    console.log(this.dd)
                    this.$app.apiGet('data/GET/projet', {
                        environnement: 'private',
                        stats_dd: this.dd,
                        stats_df: this.df,
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
            this.mode = mode;
            console.log(mode, 'mode')
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
    },

    mounted(){
        this.search(this.mode)
    }
}

</script>
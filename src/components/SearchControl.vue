<template>
    <div>
        <form @submit.prevent="search()" class="m-1">
            <div class="input-group">
                <div class="col">

                    <input type="date" class="form-control" id="dateDebutDone" name="dd" v-model="dd">
                    <input type="date" class="form-control" id="dateFinDone" name="df" v-model="df">
                </div>
                <div class="btn-group col">
                    <button type="button" class="btn rounded-0 btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown"><i class="bi bi-list"></i></button>
                    <ul class="dropdown-menu">
                        <button type="button" class="dropdown-item" @click.prevent="setModeAndSearch('collecte')">Tous les contrôles</button>
                        <button type="button" class="dropdown-item" @click.prevent="setModeAndSearch('formulaire')">Grouper par questionnaire</button>
                        <button type="button" class="dropdown-item" @click.prevent="setModeAndSearch('projet')">Grouper par projet</button>
                    </ul>
                </div>
                <button class="btn btn-outline-primary" type="submit"><i class="bi bi-arrow-right"></i></button>
                <!-- <i class="bi bi-arrow-return-left"></i> -->
            </div>
        </form>
        <div v-if="result">
            
        </div>
        <div v-else>Pas de résultats</div>
        <template v-for="res in result" :key="res.id">
            <!-- <app-menu-item :href="'/programmation/'+res.id" v-if="res.nb_todo" >
                {{ res.groupe }} <span class="badge bg-warning">{{ res.nb_todo }}</span>
            </app-menu-item> -->
            <app-menu-item :href="'/consultation/'+res.id" v-if="res.nb_done">
                {{ res.groupe }} <span class="badge bg-secondary">{{ res.nb_done }}</span>
            </app-menu-item>
            <app-menu-item v-else-if="res.cible_personnel">
                {{ res.id }}
            </app-menu-item>
        
        </template>
    </div>
</template>
<script>
import AppMenuItem from './pebble-ui/AppMenuItem.vue';
export default {
components: {  AppMenuItem },

    data() {
        return {
            mode: 'all',
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
         * Lance la recherche des données et met à jour le store.
         * 
         * La route d'API appelée dépend de la valeur de this.mode
         * - all : api/data/GET/collecte
         * - formulaire : api/data/GET/formulaire
         * - 
         */
        search() {
            this.pending.search = true;

                if(this.mode == 'formulaire') {
                    this.$app.apiGet('data/GET/formulaire', {
                        stats_dd: this.dd,
                        stats_df: this.df,
                    }) 
                    .then((data) => {
                        console.log(data, 'getformulaire');
                        this.result = data;
                        console.log(this.result, 'resultformulaire');
                    })
                    .catch(this.$app.catchError)
        
                    .finally(this.pending.search = false);
                }
                else {
                        console.log(this.dd)
                    this.$app.apiGet('data/GET/collecte', {
                        done: 'OUI',
                        dd_done: this.dd,
                        df_done: this.df,
                    }) 
                    .then((data) => {
                        this.result = data;
                        console.log(this.result, 'resultcollecte');
                        
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
        }
    }
}

</script>
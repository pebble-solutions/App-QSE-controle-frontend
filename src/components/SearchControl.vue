<template>
    <div>
        <form @submit.prevent="search()" class="m-1">
            <div class="input-group">
                <input type="date" class="form-control" id="dateDebutDone" name="dd_done" placeholder="Date début">
                <input type="date" class="form-control" id="dateFinDone" name="df_done">
                <div class="btn-group">
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
    </div>
</template>
<script>

export default {

    data() {
        return {
            mode: 'all'
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

        },

        /**
         * Défini le mode d'affichage et lance la recherche des données.
         * 
         * @param {string} mode 'collecte', 'formulaire', 'projet'
         */
        setModeAndSearch(mode) {
            this.mode = mode;
            this.search();
        }
    }
}

</script>
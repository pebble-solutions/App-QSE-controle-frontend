<template>
    <form method="get" @submit.prevent="filter()" class="m-1">
        <div class="input-group">
            <select name="last_control_limit" id="last_control_limit" class="form-select"
                v-model="requestPayload.last_control_limit">
                <option v-for="option in selectTimeOptions" :key="option.value" :value="option.value">{{ option.label }}
                </option>
            </select>
            <button class="btn btn-primary" type="submit" :disabled="pending.habilitationsPersonnels">
                <span class="spinner-border spinner-border-sm" v-if="pending.habilitationsPersonnels"></span>
                <i class="bi bi-funnel" v-else></i>
            </button>
        </div>
        <div class="my-2">
            <input type="radio" class="btn-check" name="filtreRetard" id="filtreRetardTous" checked autocomplete="off"
                v-on:click="setMode('Tous')">
            <label class="btn btn-outline-secondary" for="filtreRetardTous">Tous</label>

            <input type="radio" class="btn-check" name="filtreRetard" id="filtreRetardControle" autocomplete="off"
                v-on:click="setMode('Contrôlés')">
            <label class="btn btn-outline-secondary" for="filtreRetardControle">Contrôlés</label>

            <input type="radio" class="btn-check" name="filtreRetard" id="filtreRetardNonControle" autocomplete="off"
                v-on:click="setMode('Non contrôlés')">
            <label class="btn btn-outline-secondary" for="filtreRetardNonControle">Non contrôlés</label>
        </div>
    </form>
</template>

<script>
import { mapState } from 'vuex';

export default {

    data() {
        return {
            selectTimeOptions: [
                { value: 0, label: "Tous" },
                { value: 7, label: "1 semaine" },
                { value: 30, label: "1 mois" },
                { value: 91, label: "3 mois" },
                { value: 183, label: "6 mois" }
            ],

            requestPayload: {
                last_control_limit: 91
            },
            currentGroup: "Tous",
        }
    },

    computed: {
        ...mapState(['pending']),
    },

    methods: {
        /**
         * Lance la recherche
         */
        async filter() {
            const collection = this.$assets.getCollection("habilitationsPersonnels");
            collection.reset();
            collection.requestPayload = collection.requestPayload ?? {};
            collection.requestPayload.last_control_limit = this.requestPayload.last_control_limit;
            collection.requestPayload.last_control = 1;
            this.selectQueryParameter(collection);

            try {
                await collection.load();
            }
            catch (e) {
                this.$app.catchError(e);
            }
        },
        /**
         * Change la valeur du filtre actif à la sélection dans le menu et applique le filtre courant
         * @param {String} groupFilter 
         */
        setMode(groupFilter) {
            this.currentGroup = groupFilter;
        },
        /**
         * adapte le contenu de la requête en fonction du mode sélectionné
         * @param {array} collection 
         */
        selectQueryParameter(collection) {
            switch (this.currentGroup) {
                case 'Tous':
                    delete collection.requestPayload.last_control_result
                    break;
                case 'Contrôlés':
                    collection.requestPayload.last_control_result = '*'
                    break;
                case 'Non contrôlés':
                    collection.requestPayload.last_control_result = ''
                    break;
                default:
                    break;
            }
        },
    }

}

</script>
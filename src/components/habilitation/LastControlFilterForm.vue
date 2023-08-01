<template>
    <form method="get" @submit.prevent="timeFilter()" class="m-1">
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
        <div class="dropdown d-grid mb-1">
            <button type="button" class="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
                    v-if="pending.habilitationsPersonnels"></span>
                <i class="bi bi-list" v-else></i>
                {{ currentGroup }}
            </button>
            <ul class="dropdown-menu">
                <button type="button" class="dropdown-item d-flex align-items-center justify-content-between"
                    @click.prevent="setMode(index)" v-for="(label, index) in selectGroupsOptions" :key="index">
                    {{ label }}
                    <i class="bi bi-check text-success" v-if="index == mode"></i>
                </button>
            </ul>
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
            selectGroupsOptions: {
                tous: "Tous",
                controles: "Contrôlés",
                nonControles: "Non contrôlés",
            },
            requestPayload: {
                last_control_limit: 91
            },
            currentGroup: "Tous",
        }
    },

    computed: {
        ...mapState(['pending']),
        currentGroupFilter() {
            return this.selectGroupsOptions
        },
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
        },/**
         * Change la valeur du filtre actif à la sélection dans le menu et applique le filtre courant
         * @param {String} groupFilter 
         */
        setMode(groupFilter) {
            switch (groupFilter) {
                case 'tous':
                    this.currentGroup = 'Tous';
                    break;
                case 'controles':
                    this.currentGroup = 'Contrôlés';
                    break;
                case 'nonControles':
                    this.currentGroup = 'Non contrôlés';
                    break;
                default:
                    break;
            }
        },
        selectQueryParameter(collection) {
            switch (this.currentGroup) {
                case 'Tous':
                    //Rien à donner en paramètre
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
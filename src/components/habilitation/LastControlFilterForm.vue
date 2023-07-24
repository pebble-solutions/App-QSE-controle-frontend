<template>
    
    <form method="get" @submit.prevent="filter()" class="m-1">

        <div class="input-group">
            <select name="last_control_limit" id="last_control_limit" class="form-select" v-model="requestPayload.last_control_limit">
                <option v-for="option in selectOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>
            <button class="btn btn-primary" type="submit" :disabled="pending.habilitationsPersonnels">
                <span class="spinner-border spinner-border-sm" v-if="pending.habilitationsPersonnels"></span>
                <i class="bi bi-funnel" v-else></i>
            </button>
        </div>

    </form>

</template>

<script>
import { mapState } from 'vuex';

export default {

    data() {
        return {
            selectOptions: [
                { value: 0, label: "Tous"},
                { value: 7, label: "1 semaine" },
                { value: 30, label: "1 mois" },
                { value: 91, label: "3 mois" },
                { value: 183, label: "6 mois" }
            ],
            requestPayload: {
                last_control_limit: 91
            }
        }
    },

    computed: {
        ...mapState(['pending'])
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

            try {
                await collection.load();
            }
            catch (e) {
                this.$app.catchError(e);
            }
        }
    }

}

</script>
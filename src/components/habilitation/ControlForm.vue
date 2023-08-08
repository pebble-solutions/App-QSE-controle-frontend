<template>
    <div class="m-1">
        <div class="my-2 btn-group w-100">
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

        <div class="my-2 btn-group w-100">
            <input type="radio" class="btn-check" name="filtreRetard" id="filtreRetardS" checked autocomplete="off"
                v-on:click="setMode('S')">
            <label class="btn btn-outline-success" for="filtreRetardS">S</label>

            <input type="radio" class="btn-check" name="filtreRetard" id="filtreRetardA" autocomplete="off"
                v-on:click="setMode('A')">
            <label class="btn btn-outline-primary" for="filtreRetardA">A</label>

            <input type="radio" class="btn-check" name="filtreRetard" id="filtreRetardM" autocomplete="off"
                v-on:click="setMode('M')">
            <label class="btn btn-outline-warning" for="filtreRetardM">M</label>

            <input type="radio" class="btn-check" name="filtreRetard" id="filtreRetardI" autocomplete="off"
                v-on:click="setMode('I')">
            <label class="btn btn-outline-danger" for="filtreRetardI">I</label>
        </div>

        <div class="text-center">
            <button class="btn btn-primary bi-check" type="button" @click.prevent="emitForm()">Appliquer</button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            queryParameters: {},
            currentGroup: "Tous",
        }
    },
    emits: ['formSubmitted'],
    methods: {
        /**
         * adapte le contenu de la requête en fonction du mode sélectionné
         */
        selectQueryParameter() {
            switch (this.currentGroup) {
                case 'Tous':
                    delete this.queryParameters.last_control_result;
                    break;
                case 'Contrôlés':
                    this.queryParameters.last_control_result = '*'
                    break;
                case 'Non contrôlés':
                    this.queryParameters.last_control_result = ''
                    break;
                case 'S':
                    this.queryParameters.last_control_result = 'S'
                    break;
                case 'A':
                    this.queryParameters.last_control_result = 'A'
                    break;
                case 'M':
                    this.queryParameters.last_control_result = 'M'
                    break;
                case 'I':
                    this.queryParameters.last_control_result = 'I'
                    break;

                default:
                    break;
            }
        },
        /**
         * send form to parent
         */
        emitForm() {
            this.selectQueryParameter();
            this.$emit('formSubmitted', this.queryParameters);
        },
        /**
        * Change la valeur du filtre actif à la sélection dans le menu et applique le filtre courant
        * @param {String} groupFilter 
        */
        setMode(groupFilter) {
            this.currentGroup = groupFilter;
        },
    }
}
</script>
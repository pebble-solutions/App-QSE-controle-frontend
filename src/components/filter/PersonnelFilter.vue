<template>
    <div class="px-2">
        <div class="btn-group w-100 mb-2" v-if="croissant">
            <button type="button" class="btn btn-outline-custom dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi" :class="classIcon"></i>
                {{ labelOrderBy }}
            </button>

            <ul class="dropdown-menu w-100">
                <li>
                    <div class="dropdown-item" @click="searchOrdre = 'asc'">
                        <i class="bi bi-arrow-up"></i>
                        Croissant
                    </div>
                </li>

                <li>
                    <div class="dropdown-item" @click="searchOrdre = 'desc'">
                        <i class="bi bi-arrow-down"></i>
                        Décroissant
                    </div>
                </li>
            </ul>
        </div>

        <div v-if="displayContrat" class="mb-2">
            <h6 v-if="contratLabel" class="col-12 mb-2">Contrat</h6>
    
            <div class="btn-group w-100" role="group" aria-label="toggle contrat button">
                <button v-for="(oButton, i) in toggleButtonsContrat" :key="'toggleContratButton-'+i" class="btn radioBtnSize" :class="displayToggleButtonsContrat(oButton.value)" @click.prevent="updateToggleButtonContrat(oButton)">
                    {{ oButton.label }}
                </button>
            </div>
            <div class="input-group my-1" v-if="withContrat">
                <input type="date" class="form-control" id="dateDebutDone"  v-model="searchContratDd">
    
                <input type="date" class="form-control" id="dateFinDone" v-model="searchContratDf">
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@use "sass:color";
@import "@/_variables.scss";

.btn-custom {
    color: white!important;
    background-color: $theme-color!important;
}

.btn-custom-hover:hover {
    background-color: rgba(0, 0, 0, 0.1)!important;
}

.checkboxBtnSize {
    width: 33.33%
}

</style>


<script>
export default {
    props: {
        contratLabel: {
            type: Boolean,
            default: true
        },
        displayContrat: {
            type: Boolean,
            default: true
        },
        contratDd: String,
        contratDf: String,
        withContrat: {
            type: Boolean,
            default: true
        },
        withoutContrat: Boolean,
        ordre: String,
        croissant : {
            type: Boolean,
            default: true
        },
    },

    data() {
        return {
            searchContratDd: null,
            searchContratDf: null,
            searchOrdre: "asc",

            toggleButtonsContrat: [
                { label: "Sous contrat", value: true, events: ['update:withContrat'] },
                { label: "Tous", value: false, events: ['update:withoutContrat'] }
            ]
        }
    },

    computed: {
        classIcon() {
            if ('asc' == this.searchOrdre) {
                return 'bi-arrow-up';
            }
            return 'bi-arrow-down';
        },

        labelOrderBy() {
            return this.searchOrdre == "asc" ? "Croissant" : "Décroissant"
        }
    },

    emits: ['update:contratDd', 'update:contratDf', 'update:withContrat', 'update:withoutContrat', 'update:ordre'],


    watch: {
        searchOrdre(newVal) {
            this.$emit('update:ordre', newVal);
        },

        searchContratDd(newVal) {
            this.$emit('update:contratDd', newVal);
        },

        searchContratDf(newVal) {
            this.$emit('update:contratDf', newVal);
        }
    },

    methods: {
        /**
         * Met à jour les informations sur le toggleButtonsContrat et l'envoi a l'élement parents vie un emit
         *
         * @param   {object}    objectButton
         */
        updateToggleButtonContrat(objectButton)
        {
            this.toggleButtonsContrat.forEach((oButton) => {
                if (objectButton === oButton) {
                    oButton.value = true;
                    this.sendEventToggleButtonsContrat(oButton);
                } else {
                    oButton.value = false;
                    this.sendEventToggleButtonsContrat(oButton);
                }
            });
        },

        /**
         * Affichage CSS des buttons de toggleButtonsContrat en fonction de la sélection
         *
         * @param   {boolean}   buttonValue
         *
         * @returns {string}
         */
        displayToggleButtonsContrat(buttonValue)
        {
            if (buttonValue) {
                return 'btn-custom';
            } else {
                return 'btn-outline-custom';
            }
        },

        /**
         * Envoi les events au component parent
         *
         * @param {object} oButton
         *
         * @emits update:withContrat
         * @emits update:withoutContrat
         */
        sendEventToggleButtonsContrat(oButton) {
            let emitValue = true;

            if ("Tous" === oButton.label) {
                if (oButton.value) {
                    emitValue = false;
                }
            } else {
                emitValue = oButton.value;
            }

            if ("Tous" !== oButton.label || "Tous" === oButton.label && !emitValue) {
                oButton.events.forEach((emit) => {
                    this.$emit(emit, emitValue);
                });
            }
        }
    },

    mounted() {
        this.searchContratDd = this.contratDd;
        this.searchContratDf = this.contratDf;
        this.searchOrdre = this.ordre;

        this.toggleButtonsContrat.forEach((oButton) => {
            switch (oButton.label) {
                case "Sous contrat":
                    oButton.value = this.withContrat;
                    break;

                case "Tous":
                    if (!this.withContrat && !this.withoutContrat) {
                        oButton.value = true;
                    }
                    break
            }
        });
    },
};

</script>
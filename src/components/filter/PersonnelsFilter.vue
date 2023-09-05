<template>
    <div class="px-2">
        <div class="btn-group w-100 mb-2">
            <button type="button" class="btn btn-outline-custom dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi" :class="classIcon"></i>
                {{ searchOrdre }}
            </button>

            <ul class="dropdown-menu w-100">
                <li>
                    <div class="dropdown-item" @click="searchOrdre = 'croissant'">
                        <i class="bi bi-arrow-up"></i>
                        Croissant
                    </div>
                </li>

                <li>
                    <div class="dropdown-item" @click="searchOrdre = 'décroissant'">
                        <i class="bi bi-arrow-down"></i>
                        Décroissant
                    </div>
                </li>
            </ul>
        </div>

        <div v-if="displayContrat" class="mb-2">
            <h6 v-if="contratLabel" class="col-12 mb-2">Contrat</h6>
    
            <div>
                <div class="input-group mb-1">
                    <input type="date" class="form-control" id="dateDebutDone"  v-model="searchContratDd">
        
                    <input type="date" class="form-control" id="dateFinDone" v-model="searchContratDf">
                </div>
        
                <div class="input-group">
                    <input type="checkbox" class="btn-check" id="btn-check-with-contrat" v-model="searchWithContrat" autocomplete="off">
                    <label class="btn btn-outline-custom rounded-start checkboxBtnSize" for="btn-check-with-contrat" @click.prevent="updateVal('searchWithContrat')">
                        Avec {{ searchWithContrat }}
                    </label>
        
                    <input type="checkbox" class="btn-check" id="btn-check-without-contrat" v-model="searchWithoutContrat" autocomplete="off">
                    <label class="btn btn-outline-custom checkboxBtnSize" for="btn-check-without-contrat" @click.prevent="updateVal('searchWithoutContrat')">
                        Sans {{ searchWithoutContrat }}
                    </label>
        
                    <input type="checkbox" class="btn-check" id="btn-check-all-contrat" v-model="searchAllContrat" autocomplete="off">
                    <label class="btn btn-outline-custom rounded-end checkboxBtnSize" for="btn-check-all-contrat" @click.prevent="updateVal('searchAllContrat')">
                        Tous {{ searchAllContrat }}
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>

<style>

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
        ordre: String
    },

    data() {
        return {
            searchContratDd: null,
            searchContratDf: null,
            searchWithContrat: true,
            searchWithoutContrat: false,
            searchAllContrat: false,
            searchOrdre: "croissant"
        }
    },

    computed: {
        classIcon() {
            if ('croissant' == this.searchOrdre) {
                return 'bi-arrow-up';
            }

            return 'bi-arrow-down';
        }
    },

    emits: ['update:contratDd', 'update:contratDf', 'update:withContrat', 'update:withoutContrat', 'update:ordre'],


    watch: {
        searchWithContrat(newVal) {
            this.$emit('update:withContrat', newVal);
        },

        searchWithoutContrat(newVal) {
            this.$emit('update:withoutContrat', newVal);
        },

        searchAllContrat(newVal) {
            if (newVal) {
                this.$emit('update:withContrat', false);
                this.$emit('update:withoutContrat', false);
            }
        },

        searchOrdre(newVal) {
            this.$emit('update:ordre', newVal);
        }
    },

    methods: {
        updateVal(filterLabel) {
            this[filterLabel] = !this[filterLabel];

            if (filterLabel === 'searchAllContrat') {
                if (this.searchAllContrat) {
                    this.searchWithContrat = false;
                    this.searchWithoutContrat = false;
                } else {
                    this.searchWithContrat = true;
                }
            } else {
                if (this.searchWithContrat && this.searchWithoutContrat) {
                    this.searchAllContrat = true;
                    this.searchWithContrat = false;
                    this.searchWithoutContrat = false;
                } else {
                    this.searchAllContrat = false;
                }
            }

        }
    },

    mounted() {
        this.searchContratDd = this.contratDd;
        this.searchContratDf = this.contratDf;
        this.searchOrdre = this.ordre;
        this.searchWithContrat = this.withContrat;
        this.searchWithoutContrat = this.withoutContrat;

        if (!this.withContrat && !this.withoutContrat) {
            this.searchAllContrat = true;
        }
    },
};

</script>
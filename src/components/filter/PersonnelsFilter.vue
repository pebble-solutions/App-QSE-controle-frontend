<template>
    <div class="container">
        <div class="mb-2">
            <h6 class="col-12 mb-2">Contrat</h6>
    
            <div class="border-start border-secondary ms-1 ps-1">
                <div class="input-group mb-1">
                    <input type="date" class="form-control" id="dateDebutDone"  v-model="contratDd">
        
                    <input type="date" class="form-control" id="dateFinDone" v-model="contratDf">
                </div>
        
                <div class="input-group">
                    <input type="checkbox" class="btn-check" id="btn-check-with-contrat" v-model="withContrat" autocomplete="off">
                    <label class="btn btn-outline-secondary rounded-start checkboxBtnSize" for="btn-check-with-contrat">
                        Avec {{ withContrat }}
                    </label>
        
                    <input type="checkbox" class="btn-check" id="btn-check-without-contrat" v-model="withoutContrat" autocomplete="off">
                    <label class="btn btn-outline-secondary checkboxBtnSize" for="btn-check-without-contrat">
                        Sans {{ withoutContrat }}
                    </label>
        
                    <input type="checkbox" class="btn-check" id="btn-check-all-contrat" v-model="allContrat" autocomplete="off">
                    <label class="btn btn-outline-secondary rounded-end checkboxBtnSize" for="btn-check-all-contrat">
                        Tous {{ allContrat }}
                    </label>
                </div>
            </div>
        </div>

        <!-- <div class="mb-2">
            <h6 class="col-12 mb-2">Contact</h6>
    
            <div class="border-start border-secondary ms-1 ps-1">
                <div class="input-group mb-1">
                    <input type="number" class="form-control" placeholder="telephone">

                    <input type="tex" class="btn-check" id="btn-check-with-contrat" v-model="withContrat" autocomplete="off">

        
                    <input type="checkbox" class="btn-check" id="btn-check-without-contrat" v-model="withoutContrat" autocomplete="off">

                </div>
            </div>
        </div> -->
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
        }
    },

    data() {
        return {
            contratDd: null,
            contratDf: null,
            withContrat: true,
            withoutContrat: false,
            allContrat: false
        }
    },

    watch: {
        withContrat() {
            this.withContrat = true; 

            if (this.allContrat) {
                this.allContrat = false;
            }
        },

        withoutContrat() {
            this.withoutContrat = true;

            if (this.allContrat) {
                this.allContrat = false;
            }
        },

        allContrat() {
            this.allContrat = true;

            if (this.allContrat) {
                this.withContrat = false;
                this.withoutContrat = false;
            }
        }
    },
};

</script>
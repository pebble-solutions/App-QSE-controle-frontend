<template>
    <div>
        <div class="card my-2">
            <div class="card-header container">
                <div class="text-primary text-bg-light d-flex align-items-center row">
                    <div class="col-2"></div>
                    <i class="bi bi-calendar-check me-1 col-1"></i>
                    <span class="d-none d-sm-inline col-3">Clôturé le</span>
                    <input type="date" class="form-control-plaintext text-primary text-bg-light col" :value="collecteModif.date_done ? collecteModif.date_done.slice(0, 10) : ''" @input="updateDateDoneCollecte">
                    <div class="col-2"></div>
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="mb-2 col">
                        <div class="d-flex align-items-center">
                            <user-image :name="collecteModif.cible_nom" />
                            <div class="w-100 ps-2">
                                <strong class="d-block">Opérateur :</strong>
                                <div class="d-flex flex-row align-items-center">
                                    <i class="bi bi-pen-fill fw-lighter me-2"></i>
                                    <input type="text" class="form-control-plaintext fw-lighter" v-model="collecteModif.cible_nom">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-2 col border-start border-dark">
                        
                        <div class="d-flex align-items-center">
                            <user-image :name="collecteModif.enqueteur_nom" />
                            <div class="w-100 ps-2">
                                <strong class="d-block">Contrôleur :</strong>
                                <div class="d-flex flex-row align-items-center">
                                    <i class="bi bi-pen-fill fw-lighter me-2"></i>
                                    <input type="text" class="form-control-plaintext fw-lighter" v-model="collecteModif.enqueteur_nom">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { dateFormat} from '../../js/collecte';
import UserImage from '../pebble-ui/UserImage.vue';

export default {

    data() {
        return {
            collecteModif: {},
        }
    },
    props: {
        collecte: Object,     
    },

    emits: ['modification','stringdate'],

    watch:{
        /**
         * Lorsque la collecte est mise à jour, la valeur dans le store est actualisée et des evenements sont envoyés a l'élément parent
         * @param {object} newVal la nouvelle valeur de l'évaluation générale
         */
         collecteModif: {
            handler(newVal){
                if(this.changeFormatDateLit(this.collecte.date_done) != this.changeFormatDateLit(newVal.date_done)){
                    let valModif = " Changement de date de clôture de " + this.changeFormatDateLit(this.collecte.date_done) + " vers " + this.changeFormatDateLit(newVal.date_done);
                    this.$emit('stringdate', valModif);
                }
                this.$emit('modification', newVal)
            },
            deep:true
        },

        /**
         * Lorsque la collecte est mise à jour, la valeur dans le store est actualisée et des evenements sont envoyés a l'élément parent
         * @param {object} newVal la nouvelle valeur de l'évaluation générale
         */
         collecte: {
            handler(newVal){
                console.log("WATCH")
                console.log(newVal)
            },
            deep:true
        }
    },

    methods:{
         /**
         * Modifie le format de la date entrée en paramètre et la retourne
         * sous le format 01 févr. 2021
         * @param {string} date
         */
         changeFormatDateLit(el) {
            return dateFormat(el);
        },

         /**
         * Recupere l'evenement lors de la modification de la date_done de la collecte et modifie la valeur de la dateDoneCollecte
         */
         updateDateDoneCollecte(event) {
            this.collecteModif.date_done = event.target.value;
        },
    },

    mounted(){
        this.collecteModif = JSON.parse(JSON.stringify(this.collecte));
    },

    components: { UserImage }
}
</script> 
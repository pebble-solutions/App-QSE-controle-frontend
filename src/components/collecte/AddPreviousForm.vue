<template>
    <div class="card my-2">
            <div class="card-header">
                <div class="text-primary text-bg-light d-flex align-items-center justify-content-center">
                    <i class="bi bi-calendar-check me-1"></i>
                    <span class="mx-3">Date de contrôle</span>
                    <span>{{ getDisplayFormatedDate(collecte.date_start) }}</span>
                </div>
            </div>
            <div class="card-body d-flex justify-content-evenly">
                <div class="mb-2 d-flex justify-content-center">
                    <div class="d-flex align-items-center">
                        <user-image :name="collecte.cible_nom" />
                        <span class="ms-3" >{{ collecte.cible_nom }}</span>
                    </div>
                </div>

                <div class="border-start border-dark"></div>
                
                <div class="mb-2 d-flex justify-content-center">
                    <div class="d-flex align-items-center">
                        <user-image :name="collecte.enqueteur_nom" />
                        <span class="ms-3">{{ collecte.enqueteur_nom }}</span>
                    </div>
                </div>
            </div>
        </div>

    <div class="mb-3 container">
        <div class="row">
            <label class="form-label col-3 mt-1" for="collecteBouclage">Controle de Bouclage</label>
            <select
                class="form-select col w-50"
                id="collecteCible"
                name="cible_personnel"
                v-model="previous_id"
                ref="collecteCibleSelect"

                >
                <option
                    v-for="col in collectes"
                    :value="col.id"
                    :key="'collecte-' + col.id"
                >
                    #{{ col.id }} : {{ getDisplayFormatedDate(col.date_done) }}
                </option>
            </select>
        </div>
    </div>
</template>

<script>
import {dateFormat} from '../../js/date'
import UserImage from '../pebble-ui/UserImage.vue';

export default {

    data() {
        return {
            previous_id : null
        }
    },
    props: {
        collecte: Object,
        collectes: Array,
        parentPreviousId: Number
    },

    emits: ['modification'],

    watch:{
        /**
         * Lorsque le previous_id est mis à jour, la valeur dans le store est actualisée et l'evenements est envoyé a l'élément parent
         * @param {object} newVal la nouvelle valeur de l'id
         */
         previous_id(newVal){
            this.$emit('modification', newVal);
        }
    },

    methods:{
        /**
         * Retourne une date afin quelle soit agreable a la lecture : 8 fevr. 2024
         * 
         * @param {Date | String} date 
         */
        getDisplayFormatedDate(date) {
            return dateFormat(date)
        }

    },

    mounted() {
        this.previous_id = this.parentPreviousId;
        console.log(this.parentPreviousId)
    },

    components: { UserImage }
}
</script> 
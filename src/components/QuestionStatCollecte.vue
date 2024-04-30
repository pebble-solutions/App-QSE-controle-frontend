<template>
   <div class="container bg-light rounded-3 my-1 border" v-if="stat">
        <h5 class="ms-1">Informations sur cette question : </h5>
        <div class="row">
            <div class="col-1"></div>  
            <div class="col-2 d-flex align-items-center" >
                <div v-if="stat.dc">
                    <span class="me-2">{{ dateStatFormat }}</span>
                    <FormModuleSAMIHeader :value="stat.data_var" />
                </div>
                <div v-else>
                    <p class="text-danger">"Non Contrôlé"</p>
                </div>
            </div>
            <!-- <p>Barre de progression (FIS), avec la note moyenne individuelle et collective de chaque item.</p> -->
            <div class="col-8 my-3">
                <JaugeSami :personnalAverage="stat.cibleAverage" :name="cible_nom" :generalAverage="stat.globalAverage" />
            </div>
            <div class="col-1"></div>   
        </div>
    </div>
</template>

<script>
import FormModuleSAMIHeader from './form/FormModuleSAMIHeader.vue';
import {dateFormat} from '../js/date';
import JaugeSami from './JaugeSami.vue';

export default {
    components: { FormModuleSAMIHeader, JaugeSami },

    props: {
        stat: Object,
        cible_nom: String
    },

    computed: {
        dateStatFormat() {
            return dateFormat(this.stat.dc)
        }
    }
};
</script>
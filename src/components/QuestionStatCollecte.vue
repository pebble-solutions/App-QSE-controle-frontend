<template>
    <div class="container bg-light rounded-3 my-1 border" v-show="stat">
         <h5 class="ms-1 mt-2">Informations sur cette question : </h5>
         <div class="row my-2">
             <div class="col-1"></div>  
             <div class="col-2 d-flex align-items-center" >
                 <div v-if="stat.dc">
                     <span class="me-2" :class="dateClass">{{ dateFormatted }}</span>
                     <FormModuleSAMIHeader :value="stat.data_var" />
                 </div>
                 <div v-else>
                     <p class="text-danger">"Non Contrôlé"</p>
                 </div>
             </div>
             <div class="col-8 my-3">
                 <JaugeSami :personnalAverage="stat.cibleAverage" :name="cible_nom" :generalAverage="stat.globalAverage" />
             </div>
             <div class="col-1"></div>
         </div>
     </div>
 </template>
 
 <script>
 import FormModuleSAMIHeader from './form/FormModuleSAMIHeader.vue';
 import {dateFormat, diffDate} from '../js/date';
 import JaugeSami from './JaugeSami.vue';
 
 export default {
     components: { FormModuleSAMIHeader, JaugeSami },
 
     props: {
         stat: Object,
         cible_nom: String
     },
 
     computed: {
         dateFormatted() {
             return this.stat.dc ? dateFormat(this.stat.dc) : '';
         },
 
         dateClass() {
             if (!this.stat.dc) return 'text-danger';
             const weeksDiff = diffDate(new Date(this.stat.dc), new Date(), "week");
             console.log(weeksDiff)
             if (weeksDiff >= 52) return "text-danger";
             else if (weeksDiff >= 26) return "text-warning";
             else return "text-success";
         }
     }
 };
 </script>
 
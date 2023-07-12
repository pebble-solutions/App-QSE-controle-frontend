<template>
    <div class="card">
      <div class="card-body">
        <!-- Titre -->
        <div class="fw-light text-secondary text-center mb-1 fw-bold">HABILITATION MONITEUR</div>
        
        <div class="row">
          <!-- Colonne 1 : Validité -->
          <div class="col-lg-4 col-12">
            <div class="d-flex flex-column-reverse flex-lg-row justify-content-between align-content-center my-1">
              <div class="fw-bold order-2 order-lg-1">Validité : 3 ans</div>
              <div class="order-1 order-lg-2" v-for="hab in habilitationPerso" :key="hab.id">{{ changeFormatDateLit(hab.dd) }} au {{ changeFormatDateLit(hab.df) }}</div>
            </div>
            <!-- Composant ProgressBar -->
            <ProgressBar v-for="hab in habilitationPerso" :key="hab.id" :dd="hab.dd" :df="hab.df"></ProgressBar>
          </div>
          
          <!-- Colonne 2 : Résultat de groupe -->
          <div class="col-lg-4 col-12 mt-2">
            <div class="d-flex align-items-center justify-content-start my-2">
              <button v-for="control in listControlDone" :key="control.id"
                      :class="['btn', 'btn-sm', classNameFromSAMI(control.result_var), 'me-2', 'fs-6', 'px-2', 'text-nowrap', 'btn-square']" 
                      :data-bs-toggle="tooltip" :data-bs-placement="top" :title="'#'+control.id+'#'">
                {{ control.result_var }}
              </button>
            </div>
          </div>
          
          <!-- Colonne 3 : Veille -->
          <div class="col-lg-4 col-12">
            <div class="d-flex flex-column-reverse flex-lg-row justify-content-between align-content-center my-1">
              <div class="fw-bold order-2 order-lg-1">Veille : 180 jours</div>
              <div class="order-1 order-lg-2" v-for="hab in habilitationPerso" :key="hab.id">{{ changeFormatDateLit(hab.dd) }} au {{ changeFormatDateLit(hab.df) }}</div>
            </div>
            <!-- Composant ProgressBar -->
            <ProgressBar v-for="hab in habilitationPerso" :key="hab.id" :dd="hab.dd" :df="hab.df"></ProgressBar>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Tooltip } from 'bootstrap';
  import ProgressBar from '../ProgressBar.vue';
  import { dateFormat, classNameFromSAMI } from '../../js/collecte';
  
  export default {
    components: { ProgressBar },
    props: {
      habId: Number,
    },
    data() {
      return {
        pending: {
          control: false
        },
        listControlDone: [],
        habilitationPerso: {},
      };
    },
    methods: {
      loadCollecte(id) {
        this.pending.control = true;
        this.$app.apiGet('data/GET/collecte', {
          tli : id,
          done: 'OUI'
        })
        .then((data) => {
          this.listControlDone = data;
        })
        .catch(this.$app.catchError).finally(() => this.pending.control= false);
      },
      loadHabilitation(id) {
        this.pending.control = true;
        this.$app.apiGet('v2/controle/habilitation', {
          id : id,
        })
        .then((data) => {
          this.habilitationPerso = data;
        })
        .catch(this.$app.catchError).finally(() => this.pending.control= false);
      },
      changeFormatDateLit(el) {
        return dateFormat(el);
      },
      classNameFromSAMI(reponse) {
        return classNameFromSAMI(reponse);
      },
    },
    mounted() {
      this.loadCollecte(this.habId);
      this.loadHabilitation(this.habId)
      // Initialisation des tooltips Bootstrap après le rendu du composant
      this.$nextTick(function () {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.forEach(function (tooltipTriggerEl) {
          return new Tooltip(tooltipTriggerEl)
        })
      })
    }
  }
  </script>
  
  <style scoped>
  .btn-square {
    width: 30px;
    height: 30px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  </style>
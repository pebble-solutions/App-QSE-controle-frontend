<template>
    <div class="card">
      <div class="card-body">
        <!-- Titre -->
        <div class="fw-light text-secondary text-center mb-1 fw-bold">HABILITATION MONITEUR</div>
        
        <div class="row">
          <!-- Colonne 1 : Validité -->
          <div class="col-lg-4 col-12">
            <div class="my-1">
              <div class="fw-bold col-12">Validité : 3 ans</div>
              <div class="col-12">{{ formatDate(dd) }} au {{ formatDate(df) }}</div>
            </div>
            <!-- Composant ProgressBar -->
            <ProgressBar :dd="dd" :df="df" />
          </div>
          
          <!-- Colonne 2 : Résultat de groupe -->
          <div class="col-lg-4 col-12 mt-2">
            <!-- Composant GroupResult -->
            <GroupResult></GroupResult>
          </div>
          
          <!-- Colonne 3 : Veille -->
          <div class="col-lg-4 col-12">
            <div class="my-1">
                <div class="fw-bold col-12">Veille : 180 jours</div>
                <div class="col-12col">{{ formatDate(ddveille) }} au {{ formatDate(dfveille) }}</div>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <!-- Composant ProgressBar avec classe 'flex-grow-1 me-2' -->
              <ProgressBar class="flex-grow-1 me-2" :dd="ddveille" :df="dfveille" />
              <!-- Composant SablierDeJours -->
              <SablierDeJours :date="dfveille"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import GroupResult from './GroupResult.vue';
  import ProgressBar from './ProgressBar.vue';
  import SablierDeJours from './SablierDeJours.vue';
  
  export default {
    data() {
      return {
        // Dates utilisées dans le composant
        date: '2021-05-09',
        dd: '2022-05-09',
        df: '2025-05-09',
        ddveille: '2023-01-14',
        dfveille: '2023-07-14',
      };
    },
    components: {
      GroupResult,
      ProgressBar,
      SablierDeJours,
    },
    props: {},
    methods: {
      // Fonction pour formater une date au format 'jj/mm/aaaa'
      formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      },
    },
  };
  </script>
  
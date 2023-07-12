<template>
    <!-- Composant DernierControleBadge -->
    <DernierControleBadge :resultat="resultat" :lastControlDate="lastControlDate"></DernierControleBadge>
    
    <div class="d-flex align-items-center justify-content-start my-2">
      <!-- Boucle sur les résultats -->
      <button v-for="(value, key) in results" :key="key"
              :class="['btn', 'btn-sm', getButtonClass(value.result), 'me-2', 'fs-6', 'px-2', 'text-nowrap', 'btn-square']" 
              :data-bs-toggle="'tooltip'" :data-bs-placement="'top'" :title="value.tooltipContent">
        {{ value.result }}
      </button>
    </div>
  </template>
  
  <script>
  import DernierControleBadge from './DernierControleBadge.vue';
  import { Tooltip } from 'bootstrap';
  
  export default {
    data() {
      return {
        // Données des résultats
        results: {
          1: {
            result: "S",
            tooltipContent: "#1234",
            color: "success",
          },
          2: {
            result: "A",
            tooltipContent: "#2345",
            color: "primary",
          },
          3: {
            result: "M",
            tooltipContent: "#3456",
            color: "warning",
          },
          4: {
            result: "I",
            tooltipContent: "#4567",
            color: "danger",
          },
        },
        resultat: 'I',
        lastControlDate: '2023-02-01',
      };
    },
    methods: {
      // Fonction pour obtenir la classe CSS du bouton en fonction du résultat
      getButtonClass(result) {
        switch (result) {
          case "S":
            return "btn-success";
          case "A":
            return "btn-primary";
          case "M":
            return "btn-warning text-dark";
          case "I":
            return "btn-danger";
          default:
            return "btn-secondary";
        }
      },
    },
    mounted() {
      // Initialisation des tooltips Bootstrap après le rendu du composant
      this.$nextTick(function () {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.forEach(function (tooltipTriggerEl) {
          return new Tooltip(tooltipTriggerEl)
        })
      })
    },
    components: {
      DernierControleBadge
    }
  };
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
  
<template>
    <div class="d-flex align-items-center">
      <div class="col-auto">
        <button class="btn btn-sm me-2" :class="getBadgeClass(resultat)"
                @mouseover="showTooltip = true" @mouseleave="showTooltip = false">
          {{ resultat || '?' }}
          <div class="tooltip">{{ tooltipContentComputed }}</div>
        </button>
      </div>
      <div class="col">
        <p class="mb-0">
          <span class="fw-bold" v-if="resultat">Dernier contrôle : {{ formatDate(lastControlDate) }}</span>
          <span v-else>Pas encore contrôlé</span>
        </p>
      </div>
      <div class="col-auto">
        <BouclageBadgeResult :resultat="resultat"></BouclageBadgeResult>
      </div>
    </div>
  </template>

  <script>
  import BouclageBadgeResult from './BouclageBadgeResult.vue';
  export default {

    components: {
    BouclageBadgeResult,
  },

    props: {
      resultat: {
        type: String,
        default: null,
      },
      lastControlDate: {
        type: String,
        default: null,
      },
    },
  
    data() {
      return {
        showTooltip: false,
      };
    },
  
    methods: {
      getBadgeClass(resultat) {
        switch (resultat) {
          case 'S':
            return 'btn-success';
          case 'A':
            return 'btn-primary';
          case 'M':
            return 'btn-warning text-dark';
          case 'I':
            return 'btn-danger';
          default:
            return 'btn-secondary';
        }
      },
  
      formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      },
    },
  
    computed: {
      tooltipContentComputed() {
        // Utilisez la logique appropriée pour obtenir le contenu du tooltip basé sur l'ID du résultat
        // Par exemple, vous pouvez utiliser une table de correspondance ou un appel à l'API pour récupérer les données du tooltip
        // Ici, j'utilise un exemple statique avec une table de correspondance
        const tooltipData = {
          S: '#1234#',
          A: '#2345#',
          M: '#3456#',
          I: '#4567#',
        };
  
        return tooltipData[this.resultat] || '';
      },
    },
  };
  </script>
  
  <style scoped>
  .btn {
    width: 30px;
    height: 30px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .tooltip {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    padding: 5px;
    background-color: #000;
    color: #fff;
    font-size: 12px;
    border-radius: 3px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }
  
  .btn:hover .tooltip {
    opacity: 1;
    visibility: visible;
  }
  </style>
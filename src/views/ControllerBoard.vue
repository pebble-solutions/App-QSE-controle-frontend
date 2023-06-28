<template>
  <div>
    <div class="container py-2">
      <template v-if="!stats">
        <h1 class="fs-3 my-3 text-center">Tableau de bord</h1>

        <alert-message variant="warning" icon="bi-exclamation-circle me-2" v-if="stat">Aucun résultat pour cette recherche.</alert-message>

        <div class="card my-3">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col display-6 fs-4 text-center">
                Retrouvez ici tes les Controles KN à effectuer. cliquez sur un des tickets pour lancer le controle
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="d-flex align-items-center my-3">
          <div class="d-flex align-items-center">
            <user-image :name="personnelNom" className="me-2" />
            <h1 class="fs-3 m-0 me-3">{{personnelNom}}</h1>
          </div>
          <div class="fw-light text-secondary text-end">du {{changeFormatDateLit(requeteStat.dd)}} au {{changeFormatDateLit(requeteStat.df)}}</div>
        </div>

        <charts :stats="stats" v-if="stats" />
      </template>
    </div>
  </div>







  <!-- bloc de controle par jour -->
  <div class="container p-2">
    <div class="col-12 col-md-6 col-lg-4">
    </div>
    <div class="card my-3" v-for="(date, index) in dates" :key="index">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-12">
            <div class="fw-light text-secondary text-center mb-3 fw-bold">{{ date }}</div>
          </div>
        </div>


          <!-- bloc de controle par controle -->
          <div class="row bg-light rounded p-4 m-2 mb-3">
            <!-- Zone KN ET INFOS -->
            <div class="col-12 col-md-12 col-lg-6">
              <!-- Contenu de la ligne 1 -->
              <div class="p-2 d-flex justify-content-center">
                <div class="row align-items-center">
                  <div class="col-2">
                    <!-- Icône carrée -->
                    <span class="badge bg-secondary">?</span>
                  </div>
                  <div class="col-10 text-center fw-bold d-flex align-items-center">
                    <!-- Texte "KN ANNONCEUR" centré -->
                    <div class="kn-annonceur">KN ANNONCEUR</div>
                  </div>
                </div>
              </div>
              <!-- COMPOSANT HABILITATION -->
              <SuiviHabilitation></SuiviHabilitation>
              <!-- Bouton "Controller" -->
              <div class="text-center mt-2">
                <button class="btn btn-primary w-100 mb-3">Controller</button>
              </div>
            </div>

            <!-- Zone ADRESSE ET CARTE -->
            <div class="col-12 col-md-12 col-lg-6">
              <!-- Contenu de la zone 2 -->
              <div class="bg-white h-100 rounded shadow">
                <div class="card-body h-100 d-flex align-items-center justify-content-center">
                  <div class="row">
                    <div class="col-12 text-center mb-3">
                      <div class="row fw-bold">
                        <div class="col-12">21.02.23</div>
                        <div class="col-12">RAV LORIENT</div>
                      </div>
                    </div>
                    <div class="col-12 text-center">
                      <div class="row">
                        <div class="col-12">3 rue des Pruniers</div>
                        <div class="col-12">56100 LORIENT</div>
                      </div>
                    </div>
                  </div>
                  <div class="col-6 col-md-6 mt-2 mt-md-0">
                    <div class="d-flex justify-content-center">
                      <InteractiveMap></InteractiveMap>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


        <!--  fin de bloc de controle par controle -->
        
        
        



      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import Charts from '../components/Charts.vue';
  import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
  import UserImage from '../components/pebble-ui/UserImage.vue';
  import { dateFormat } from '../js/collecte';
  import SuiviHabilitation from '../components/SuiviHabilitation.vue';
  import InteractiveMap from '../components/InteractiveMap.vue';

  export default {
    data() {
      return {
        dates: [],
        imageBounds: {
          left: -5.684968390884571,
          right: 8.971890223001154,
          top: 51.670669181924744,
          bottom: 41.71645783266676,
        },
        location: {
          lat: 50.62,
          lng: 3.04,
        },
      };
    },
    mounted() {
      this.generateDates();
    },
    methods: {
      generateDates() {
        const today = new Date();
        const daysInMilliseconds = 24 * 60 * 60 * 1000;
        for (let i = 0; i < 8; i++) {
          const date = new Date(today.getTime() + i * daysInMilliseconds);
          const formattedDate = this.formatDate(date);
          this.dates.push(formattedDate);
        }
      },
      formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('fr-FR', options);
      },
      ...mapActions(['refreshStat']),
      changeFormatDateLit(el) {
        return dateFormat(el);
      },
    },
    beforeUnmount() {
      this.refreshStat(null);
    },
    computed: {
      ...mapState(['stat', 'requeteStat', 'listActifs']),
      stats() {
        let stats = null;

        if (this.stat) {
          for (const key in this.stat.stats) {
            stats = this.stat.stats[key];
            break;
          }
        }

        return stats;
      },
      personnelNom() {
        if (this.stats) {
          return this.stats.nom;
        }
        return "Sans nom";
      },
      latitude() {
        const latDifference = this.imageBounds.top - this.imageBounds.bottom;
        const percentage = 100 * (this.imageBounds.top - this.location.lat) / latDifference;
        return percentage;
      },
      longitude() {
        const lngDifference = this.imageBounds.right - this.imageBounds.left;
        return 100 * (this.location.lng - this.imageBounds.left) / lngDifference;
      },
    },
    components: {
      Charts,
      AlertMessage,
      UserImage,
      SuiviHabilitation,
      InteractiveMap,
    },
  };
</script>

<style scoped>
  .dot {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: red;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
 
</style>

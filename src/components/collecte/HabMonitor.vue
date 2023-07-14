<template>
  <div class="card" v-if="!pending.control">
    <div class="card-body">
      <!-- Titre -->
      <div class="fw-light text-secondary text-center mb-1 fw-bold">
        {{ collecte.id }}

        {{ filterhabilitationType(hab.habilitation_type_id) }}
      </div>
      <div class="row">
        <!-- Colonne 1 : Validité -->
        <div class="col-lg-3 col-12">
          <div class="my-1">
            <div class="fw-bold col-12">Validité : 3 ans</div>
            <div class="col-12" v-for="hab in habilitationPerso" :key="hab.id">{{ changeFormatDateLit(hab.dd) }}
              au {{ changeFormatDateLit(hab.df) }}
            </div>

          </div>
          <!-- Composant ProgressBar -->
          <!-- {{ habilitationPerso }} -->
          <ProgressBar v-for="hab in habilitationPerso" :key="hab.id" :dd="hab.dd" :df="hab.df"></ProgressBar>
        </div>
        <!-- Colonne 2 : Résultat de groupe -->
        <div class="col">
          <div class="d-flex align-items-center justify-content-start my-2">
            <button v-for="kn in infosHab" :key="kn.id"
              :class="['btn', 'btn-sm', classNameFromSAMI(kn.sami), 'me-2', 'fs-6', 'px-2', 'text-nowrap', 'btn-square']"
              :data-bs-toggle="'tooltip'" :data-bs-placement="'top'" :title="'#' + kn.id">
              {{ kn.sami }}
            </button>
          </div>
          
        </div>
        
        <div class="col-lg-3 col-12">
          <div class="my-1">
            <div>Dernier contrôle : {{ changeFormatDateLit(lastControl) }}</div>
            <!-- <div>{{ lastControl }} {{ noLastControl }}</div> -->
            <div class="fw-bold col-12">Veille : 180 jours</div>
           
          </div>
          <!-- Composant ProgressBar -->
          <ProgressBar v-if="lastControl" :dd="new Date(lastControl)" :df="delay(lastControl)"></ProgressBar>
          <AlertMessage v-else> {{ noLastControl }}</AlertMessage>
        </div>
        
        <!-- Colonne 3 : Veille -->
      </div>
    </div>
    <!-- info KN{{ info }} -->
  </div>
</template>
<script>
import { Tooltip } from 'bootstrap';
import ProgressBar from '../ProgressBar.vue';
import { dateFormat, classNameFromSAMI } from '../../js/collecte';
import { mapState } from 'vuex';
import AlertMessage from '../pebble-ui/AlertMessage.vue';
export default {
  components: { ProgressBar , AlertMessage},
  props: {
    habId: Number,
    collecte: Object,
    info: Object,
  },
  computed: {
    ...mapState(['habilitationType', 'listActifs', 'veilleConfig']),



    returnFormulaireId() {
      let formulaire = this.veilleConfig.find((f) => f.objet_id == this.$route.params.id);
      return formulaire.formulaire_id

    }


  },
  data() {
    return {
      pending: {
        control: false
      },
      listControlDone: [],
      habilitationPerso: [],
      hab: '',
      resultat: 'I',
      lastControlDate: 'XX',
      listControlToDo: [],
      infosHab: '',
      lastControl:'',
      noLastControl: '',
    };
  },
  methods: {


    filterhabilitationType(id) {
      let habilitationType = this.habilitationType.find((e) => e.id == id);
      // let nom = habilitationType.nom
      return habilitationType
    },
    findVeilleConfig(id) {
      let veilleConfig = this.veilleConfig.find((v) => v.objet_id == id);
      this.veille = veilleConfig
    },

    /**
     * return la date de l'expiration du délai de veille (+180j) à partir de la date du dernier contrôle
     * @param {date} date la date du dernier contôle réalise
     */
    delay(date){
      let dd = new Date(date);

      dd.setDate(dd.getDate()+180);
      
      return dd
      

    },
    loadCollecte(id) {
      this.pending.control = true;
      this.$app.apiGet('data/GET/collecte', {
        tli: id,
        done: 'OUI'
      })
        .then((data) => {
          this.listControlDone = data;
        })
        .catch(this.$app.catchError).finally(() => this.pending.control = false);
    },

    loadinfosHabMonitor(id) {
      this.pending.control = true
      this.$app.apiGet('v2/collecte', {
        habilitation_id: id,
        kn2kn_info: 'OUI',
        retard_info: 'OUI',
        type: 'KN'
      })
        .then((data) => {
          this.infosHab = data
        })
        .catch(this.$app.catchError).finally(() => this.pending.control = false);
    },

    loadHabilitation(id) {
      this.pending.control = true;
      this.$app.apiGet('v2/controle/habilitation', {
        id: id,
      })
        .then((data) => {
          this.habilitationPerso = data;
          this.hab = data[0]
          // let habId = this.hab.id
          let veilleId = this.hab.habilitation_type_id
          this.filter

          this.$app.apiGet('v2/controle/veille/' + veilleId + '/todo', { CSP_min: 0, CSP_max: 600 })
            .then((data) => {
              this.listControlToDo = data;
              if(this.listControlToDo){
                let veille = this.listControlToDo.find((e) => e.personnel_id == this.hab.personnel_id)
                console.log(veille , 'veille')
                if (veille) {
                  this.lastControl = veille.date_last
                }
                else this.noLastControl = 'La veille est à jour'
              }
            })
            .catch(this.$app.catchError).finally(() => this.pending.control = false);
        })
        .catch(this.$app.catchError).finally(() => this.pending.control = false);
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
    this.loadinfosHabMonitor(this.habId)

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
<style  scoped>
.btn-square {
  width: 30px;
  height: 30px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

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
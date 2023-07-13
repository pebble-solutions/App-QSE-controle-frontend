<template>
  <div class="card">
    <div class="card-body">
      <!-- Titre -->
      <div class="fw-light text-secondary text-center mb-1 fw-bold">
        {{ collecte.id }} 
      
        filterhabilitationtype de hab.habilitation.type.id{{ filterhabilitationType(hab.habilitation_type_id) }}
      </div>
      <div class="row">
        <!-- Colonne 1 : Validité -->
      <div class="col-lg-4 col-12">
        <div class="my-1">
          <div class="fw-bold col-12">Validité : 3 ans</div>
          <div class="col-12" v-for="hab in habilitationPerso" :key="hab.id">{{ changeFormatDateLit(hab.dd) }}
            au {{ changeFormatDateLit(hab.df) }}
            <div>
              
            </div>
            <div>
              
            </div>
          </div>
          
        </div>
        <!-- Composant ProgressBar -->
        <ProgressBar v-for="hab in habilitationPerso" :key="hab.id" :dd="hab.dd" :df="hab.df"></ProgressBar>
      </div>
      <!-- Colonne 2 : Résultat de groupe -->
      <div class="col-lg-4 col-12 mt-2">
        <div v-for="kn in infosHab" :key="kn.id">
          {{ kn.id}} {{ kn.sami }}
          
        </div>
        <div class="d-flex align-items-center justify-content-between">
          
          <div>Dernier contrôle : {{ changeFormatDateLit(lastControlDate) }}</div>
          </div>
          <div class="d-flex flex-row-reverse align-items-center justify-content-end my-2">
            
            <button v-for="control in listControlDone" :key="control.id"
            :class="['btn', 'btn-sm', classNameFromSAMI(control.result_var), 'me-2', 'fs-6', 'px-2', 'text-nowrap', 'btn-square']"
            :data-bs-toggle="'tooltip'" :data-bs-placement="'top'" :title="'#' + control.id">
            {{ control.result_var }}
          </button>
        </div>
      </div>
      <!-- Colonne 3 : Veille -->
      <div class="col-lg-4 col-12">
        <div class="my-1">
          
          <div class="fw-bold col-12">Veille : 180 jours</div>
          <div class="col-12" v-for="hab in habilitationPerso" :key="hab.id">{{ changeFormatDateLit(hab.dd) }}
            au {{ changeFormatDateLit(hab.df) }}</div>
            listcontrolTodo:{{ listControlToDo }}
          </div>
          <!-- Composant ProgressBar -->
          <!-- <ProgressBar></ProgressBar> -->
        </div>
      </div>
    </div>
    info KN{{ info }}
  </div>

</template>
<script>
import { Tooltip } from 'bootstrap';
import ProgressBar from '../ProgressBar.vue';
import { dateFormat, classNameFromSAMI } from '../../js/collecte';
import { mapState } from 'vuex';
export default {
  components: { ProgressBar },
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
      hab:'',
      resultat: 'I',
      lastControlDate: '2023-02-01',
      listControlToDo: [],
      infosHab: '',
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
      this.veille =  veilleConfig
    },

    loadCollecte(id) {
      this.pending.control = true;
      this.$app.apiGet('data/GET/collecte', {
        tli: id,
        done: 'OUI'
      })
        .then((data) => {
          this.listControlDone = data;
          console.log(this.listControlDone, 'control')
        })
        .catch(this.$app.catchError).finally(() => this.pending.control = false);
    },

    loadinfosHabMonitor(id) {
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
          let habId = this.hab.id
          let veilleId = this.hab.habilitation_type_id
          this.filter
          
          console.log(habId, veilleId ,'toto');
          this.$app.apiGet('v2/controle/veille/'+veilleId+'/todo', {CSP_min: 0, CSP_max: 600})
            .then((data) =>{
                this.listControlToDo = data;
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
}</style>
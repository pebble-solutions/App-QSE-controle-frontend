<template>
    <div class="card my-2">
        <div class="card-header container">
            <div class="text-primary text-bg-light d-flex align-items-center row">
                <div class="col-2"></div>
                <i class="bi bi-calendar-check me-1 col-1"></i>
                <span class="d-none d-sm-inline col-3">Date de contrôle</span>
                <input type="date" class="form-control text-primary text-bg-light col" :value="collecteModif.date_done ? collecteModif.date_done.slice(0, 10) : ''" @input="updateDateDoneCollecte">
                <div class="col-2"></div>
            </div>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="mb-2 col">
                    <div class="d-flex align-items-center">
                        <user-image :name="collecteModif.cible_nom" />
                        <div class="w-100 ps-2">
                            <strong class="d-block">Opérateur :</strong>
                            <div class="d-flex flex-row align-items-center">
                                <i class="bi bi-pen-fill fw-lighter me-2"></i>
                                <select class="form-select" v-model="collecteModif.cible__structure__personnel_id">
                                    <option v-for="personnel in personnels" :key="personnel.id" :value="personnel.id">{{ personnel.cache_nom }}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mb-2 col border-start border-dark">
                    <div class="d-flex align-items-center">
                        <user-image :name="collecteModif.enqueteur_nom" />
                        <div class="w-100 ps-2">
                            <strong class="d-block">Contrôleur :</strong>
                            <div class="d-flex flex-row align-items-center">
                                <i class="bi bi-pen-fill fw-lighter me-2"></i>
                                <select class="form-select" v-model="collecteModif.enqueteur__structure__personnel_id">
                                    <option v-for="personnel in personnels" :key="personnel.id" :value="personnel.id">{{ personnel.cache_nom }}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <hr v-if="habilitationPersonnel.length">
    <div class="mb-2 col" v-if="habilitationPersonnel.length">
        <h3>Rattachement</h3>
        <div class="d-flex align-items-center">
        <div class="w-100 ps-2">
            <strong class="d-block">Habilitation :</strong>
            <div class="d-flex flex-row align-items-center">
            <select class="form-select" :v-model="collecteModif?.tli || 0">
                <option v-for="hab in habilitationPersonnel" :key="hab.id" :value="hab.id">
                #{{ hab.id }} : {{ hab.labelType }}
                </option>
            </select>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import { dateFormat } from '../../js/collecte';
import UserImage from '../pebble-ui/UserImage.vue';

export default {
  components: { UserImage },
  
  props: {
    collecte: Object,
    personnels: Array,
    habilitationType: Array
  },

  emits: ['modification', 'stringdate'],

  data() {
    return {
      collecteModif: {},
      habilitationPersonnel: []
    }
  },

  computed: {
    formattedDateDone() {
      return this.changeFormatDateLit(this.collecteModif.date_done);
    }
  },

  watch: {
    'collecteModif.enqueteur__structure__personnel_id': 'updateEnqueteur',
    'collecteModif.cible__structure__personnel_id': 'updateCible',
    'collecteModif.tli': 'updateTli',
    'collecteModif.date_done': 'updateDateDone'
  },

  methods: {
    changeFormatDateLit(date) {
      return dateFormat(date);
    },

    updateDateDoneCollecte(event) {
      this.collecteModif.date_done = event.target.value;
    },

    async getHabilitationPersonnel() {
      if (!this.collecteModif.cible__structure__personnel_id) return;

      try {
        const tmpHabilitationPersonnel = await this.$app.api.get('v2/characteristic/personnel/' + this.collecteModif.cible__structure__personnel_id);
        
        this.habilitationPersonnel = tmpHabilitationPersonnel.map(hab => {
          const habType = this.habilitationType?.find(ht => ht.id === hab.characteristic_id);
          return {
            ...hab,
            labelType: habType?.label || 'Type inconnu'
          };
        });
      } catch (e) {
        this.$app.catchError(e);
      }
    },

    updateEnqueteur(newVal) {
      const enqueteur = this.personnels.find(item => item.id === newVal);
      this.collecteModif.enqueteur_nom = enqueteur ? enqueteur.cache_nom : '';
      this.emitModification();
    },

    updateCible(newVal) {
      const cible = this.personnels.find(item => item.id === newVal);
      this.collecteModif.cible_nom = cible ? cible.cache_nom : '';
      this.getHabilitationPersonnel();
      this.emitModification();
    },

    updateTli(newVal) {
      if (newVal !== this.collecte.tli) {
        this.collecteModif.tlc = "CharacteristicPersonnel";
      }
      this.emitModification();
    },

    updateDateDone(newVal) {
      const oldDate = this.changeFormatDateLit(this.collecte.date_done);
      const newDate = this.changeFormatDateLit(newVal);
      if (oldDate !== newDate) {
        this.$emit('stringdate', ` Modification de la date de contrôle de ${oldDate} vers ${newDate}`);
      }
      this.emitModification();
    },

    emitModification() {
      this.$emit('modification', this.collecteModif);
    }
  },

  async mounted() {
    this.collecteModif = JSON.parse(JSON.stringify(this.collecte));
    await this.getHabilitationPersonnel();
  }
}
</script>
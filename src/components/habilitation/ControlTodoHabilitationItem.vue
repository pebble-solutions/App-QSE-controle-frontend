<template>
    <div class="d-flex align-items-center justify-content-between">
        <div class="me-2" v-if="!pending.personnels">
            <UserImage :name="nomPersonnel" v-if="nomPersonnel"></UserImage>
        </div>
        <div class="d-flex flex-column flexwrap align-content-start justify-content-start w-100">
            <div class="d-flex align-items-center">
                <span class="fw-lighter me-2">#{{ habilitationPersonnel.id }}</span>
                <strong v-if="!pending.habilitationsCharacteristic">{{ nomHabilitationType }}</strong>
            </div>
            <strong v-if="!pending.personnels">{{ nomPersonnel }}</strong>

            <div v-if="habilitationPersonnel.last_control_result">
                <span class="d-flex align-items-center">
                    <span class="badge rounded-pill" :class="SAMIClassName">{{ habilitationPersonnel.last_control_result }}</span>
                    <span class="ms-2">Il y a {{ yearsMonthsDays }}</span>
                </span>
            </div>
            <span class="badge border border-danger text-bg-light text-danger rounded-pill" v-else>
                <i class="bi bi-exclamation-triangle-fill"></i>
                <span class="ms-1">Non contrôlé</span>
            </span>

            <span :class="badgeClass" class="badge border text-bg-light rounded-pill">
                <i class="bi bi-hourglass"></i>
                <span class="ms-1" v-if="daysUntilControl >= 0">À contrôler dans {{ daysUntilControl }} jours</span>
                <span v-else>Contrôle expiré depuis {{ -1 * daysUntilControl }} jours</span>
            </span>
            <!--<StackedBar :bars="bars" :totalValue="totalValue"></StackedBar>-->


        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import UserImage from '../pebble-ui/UserImage.vue'
//import StackedBar from '../pebble-ui/charts/StackedBar.vue'
import { classNameFromSAMI } from '../../js/collecte';
export default {
    data() {
        return {
            personnels: null,
            habilitationsCharacteristic: null,
            nomPersonnel: '',
            nomHabilitationType: '',
            bars: [],
            totalValue: 0,
            daysUntilControl: 0,
            badgeClass: '',
        }
    },
    props: {
        habilitationPersonnel: Object
    },
    computed: {
        ...mapState(['pending']),

        SAMIClassName() {
            return classNameFromSAMI(this.habilitationPersonnel.last_control_result);
        },

        /**
         * Retourne le nombre de jours passés depuis le dernier contrôle au format
         * X ans X mois X jours
         */
        yearsMonthsDays() {
            const totalMonths = Math.ceil(this.habilitationPersonnel.last_control_days / (365 / 12));

            const values = {
                an: Math.trunc(totalMonths / 12),
                mois: totalMonths % 12,
                jour: Math.ceil(this.habilitationPersonnel.last_control_days % (365 / 12))
            };

            let phrase = [];

            for (const key in values) {
                if (values[key]) {
                    phrase.push(values[key]+ " " + this.plural(key, values[key]));
                }
            }

            return phrase.join(" ");
        },

    },
    watch: {
        pending: {
            deep: true,
            handler(newValue) {
                if (!newValue.personnels) {
                    this.getName();
                }
                if (!newValue.habilitationsCharacteristic) {
                    this.getHabilitionName();
                }
            },
        },
    },
    methods: {
        /**
         * Passe une chaine de caractère au pluriel en fonction d'une quantité
         * 
         * @param {string} str La chaîne à transformer
         * @param {number} qt La quantité
         */
        plural(str, qt) {
            const invariables = ['mois'];
            return qt > 1 && !invariables.includes(str) ? `${str}s` : str;
        },

        getName() {
            const personnel = this.personnels.getCollection().find(e => e.id == this.habilitationPersonnel.personnel_id);
            if (personnel != null) {
                this.nomPersonnel = personnel.cache_nom;
            } else {
                this.nomPersonnel = '?';
            }
        },
        getHabilitionName() {
            const habilitation = this.habilitationsCharacteristic.getCollection().find(e => e.id == this.habilitationPersonnel.characteristic_id);
            if (habilitation != null) {
                this.nomHabilitationType = habilitation.label;
            } else {
                this.nomHabilitationType = '?';
            }
        },

        computeStackedBar() {
            this.bars = [
                {
                    color: 'success',
                    value: this.habilitationPersonnel.last_control_days
                }];

            const date1 = new Date(this.habilitationPersonnel.dd);
            const date2 = new Date(this.habilitationPersonnel.df);
            // To calculate the time difference of two dates
            var Difference_In_Time = date2.getTime() - date1.getTime();

            // To calculate the no. of days between two dates
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            this.totalValue = Difference_In_Days;
        },
        buildBadgeClass() {
            const duration = Math.ceil((365 / 12) * 6); //6 mois
            const daysUntilControl = duration - this.habilitationPersonnel.last_control_days;
            if (daysUntilControl > 30) {
                this.badgeClass = 'border-success text-success';
            } else if (daysUntilControl > 15 && daysUntilControl <= 30) {
                this.badgeClass = 'border-primary text-primary';
            } else if (daysUntilControl >= 0 && daysUntilControl <= 15) {
                this.badgeClass = 'border-warning text-warning';
            } else if (daysUntilControl < 0) {
                this.badgeClass = 'border-danger text-danger';
            }
            this.daysUntilControl = daysUntilControl;
        },

        /**
         * Récupère les informations liées aux collections
         */
        initFromCollections() {
            this.computeStackedBar();

            if (!this.pending.personnels) {
                this.getName();
            }
            if (!this.pending.habilitationsCharacteristic) {
                this.getHabilitionName();
            }

            this.buildBadgeClass();
        }
    },
    components: {
        UserImage
    },

    mounted() {
        let personnels = this.$assets.getCollection('personnels');
        let habilitationsCharacteristic = this.$assets.getCollection('habilitationsCharacteristic');

        this.personnels = personnels;
        this.habilitationsCharacteristic = habilitationsCharacteristic;

        this.initFromCollections();
    },

    updated() {
        this.initFromCollections();
    }
}
</script>

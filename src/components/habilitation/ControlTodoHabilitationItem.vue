<template>
    <div class="d-flex align-items-center justify-content-between">
        <div class="me-2" v-if="!pending.personnels">
            <UserImage :name="nomPersonnel" v-if="nomPersonnel"></UserImage>
        </div>
        <div class="d-flex flex-column flexwrap align-content-start justify-content-start w-100">
            <div class="d-flex align-items-center text-secondary">
                <span class="fw-lighter me-2">#{{ habilitationPersonnel.id }}</span>
                <strong v-if="!pending.habilitationsCharacteristic">{{ nomHabilitationType }}</strong>
            </div>
            <strong v-if="!pending.personnels">{{ nomPersonnel }}</strong>

            <div v-if="habilitationPersonnel.last_control_result">
                <span class="d-flex align-items-center">
                    <span class="badge rounded-pill" :class="SAMIClassName">{{ habilitationPersonnel.last_control_result
                    }}</span>
                    <span class="ms-2">il y a {{ years }} ans {{ months }} mois et {{ days }} jours</span>
                </span>
            </div>
            <span class="badge border border-danger text-bg-light text-danger rounded-pill ms-2" v-else>
                <i class="bi bi-exclamation-triangle-fill"></i>
                <span class="ms-1">Non contrôlé</span>
            </span>

            <span :class="badgeClass">
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
            years: 0,
            months: 0,
            days: 0,
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
        computeMonthAndDays() {
            const totalMonths = Math.ceil(this.habilitationPersonnel.last_control_days / (365 / 12));
            this.years = Math.trunc(totalMonths / 12);
            this.months = totalMonths % 12;
            this.days = Math.ceil(this.habilitationPersonnel.last_control_days % (365 / 12));
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
            console.log(daysUntilControl);
            if (daysUntilControl > 30) {
                this.badgeClass = 'badge border border-success text-bg-light text-success rounded-pill ms-2';
            } else if (daysUntilControl > 15 && daysUntilControl <= 30) {
                this.badgeClass = 'badge border border-primary text-bg-light text-primary rounded-pill ms-2';
            } else if (daysUntilControl >= 0 && daysUntilControl <= 15) {
                this.badgeClass = 'badge border border-warning text-bg-light text-warning rounded-pill ms-2';
            } else if (daysUntilControl < 0) {
                this.badgeClass = 'badge border border-danger text-bg-light text-danger rounded-pill ms-2';
            }
            this.daysUntilControl = daysUntilControl;
        },
    },
    components: {
        UserImage
    },
    async mounted() {
        let personnels = this.$assets.getCollection('personnels');
        let habilitationsCharacteristic = this.$assets.getCollection('habilitationsCharacteristic');

        this.personnels = personnels;
        this.habilitationsCharacteristic = habilitationsCharacteristic;

        this.computeMonthAndDays();
        this.computeStackedBar();

        if (!this.pending.personnels) {
            this.getName();
        }
        if (!this.pending.habilitationsCharacteristic) {
            this.getHabilitionName();
        }

        this.buildBadgeClass();
    },
}
</script>

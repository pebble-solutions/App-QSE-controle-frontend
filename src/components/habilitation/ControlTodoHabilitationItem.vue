<template>
    <!--{{ habilitationPersonnel }}-->
    <div class="d-flex align-items-center justify-content-between" v-if="!pending.load">
        <div class="me-2">
            <UserImage :name="nomPersonnel"></UserImage>
        </div>
        <div class="d-flex flex-column flexwrap align-content-start justify-content-start w-100">
            <div class="d-flex align-items-center">
                <small class="fw-lighter me-2">#{{ habilitationPersonnel.id }}</small>
            </div>
            <strong>{{ nomPersonnel }}</strong>
            <small class="me-2">{{ nomHabilitationType }}</small>
            <small class="me-2">Contrôlé il y a {{ months }} mois et {{ days }} jours</small>
            <small class="me-2">Dernier contrôle : {{ habilitationPersonnel.last_control_result ?? 'Inconnu' }}</small>
            <StackedBar :bars="bars" :totalValue="totalValue"></StackedBar>
        </div>
    </div>
</template>

<script>
import UserImage from '../pebble-ui/UserImage.vue'
import StackedBar from '../pebble-ui/charts/StackedBar.vue'
export default {
    data() {
        return {
            personnels: [],
            habilitationsCharacteristic: [],
            nomPersonnel: '',
            nomHabilitationType: '',
            months: 0,
            days: 0,
            bars: [],
            totalValue: 0,
            pending: {
                load: true,
            }
        }
    },
    props: {
        habilitationPersonnel: Object
    },
    methods: {
        getName() {
            const personnel = this.personnels.find(e => e.id == this.habilitationPersonnel.personnel_id);
            if (personnel != null) {
                this.nomPersonnel = personnel.cache_nom;
            } else {
                this.nomPersonnel = '?';
            }
        },
        getHabilitionName() {
            const habilitation = this.habilitationsCharacteristic.find(e => e.id == this.habilitationPersonnel.characteristic_id);
            if (habilitation != null) {
                this.nomHabilitationType = habilitation.label;
            } else {
                this.nomHabilitationType = '?';
            }
        },
        computeMonthAndDays() {
            this.months = Math.ceil(this.habilitationPersonnel.last_control_days / (365 / 12));
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
    },
    components: {
        UserImage, StackedBar
    },
    async mounted() {
        this.pending.load = true;
        let personnels = this.$assets.getCollection('personnels');
        let habilitationsCharacteristic = this.$assets.getCollection('habilitationsCharacteristic');
        await personnels.load({
            limit: 'aucune'
        });
        await habilitationsCharacteristic.load({
            limit: 'aucune'
        });
        this.personnels = personnels.getCollection();
        this.habilitationsCharacteristic = habilitationsCharacteristic.getCollection();
        this.getName();
        this.getHabilitionName();
        this.computeMonthAndDays();
        this.computeStackedBar();
        this.pending.load = false;
    },
}
</script>

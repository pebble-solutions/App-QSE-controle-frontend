<template>
    <div class="col-6">
        <div class="card my-2">
            <div class="card-body">
                <h3 class="card-title fs-4">KN dans les temps </h3>
                <p>{{ inTimeKn }}</p>
            </div>
        </div>
    </div>
    <div class="col-6">
        <div class="card my-2">
            <div class="card-body">
                <h3 class="card-title fs-4">KN en retard</h3>
                <p>{{ lateKn }}</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            inTimeKn: 0,
            lateKn: 0,
        }
    },
    mounted() {
        const data = this.$assets.getCollection('collectesCollection').getCollection();
        const lateKn = data.filter(collecte => collecte.date_prevue.split(' ')[0] < collecte.date_done.split(' ')[0]);
        this.lateKn = lateKn.length;
        this.inTimeKn = data.length - lateKn.length;
    }
}
</script>
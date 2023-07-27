<template>
    <table class="table">
        <thead>
            <tr>
                <th>KN dans les temps</th>
                <th>KN en retard</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ inTimeKn }}</td>
                <td>{{ lateKn }}</td>
            </tr>
        </tbody>
    </table>
</template>
<script>
export default {
    data(){
        return {
            inTimeKn: 0,
            lateKn: 0,
        }
    },
    mounted(){
        const data = this.$assets.getCollection('collectesCollection').getCollection();
        const lateKn = data.filter(collecte => collecte.date_prevue < collecte.date_done);
        this.lateKn = lateKn.length;
        this.inTimeKn = data.length - lateKn.length;
    }
}
</script>
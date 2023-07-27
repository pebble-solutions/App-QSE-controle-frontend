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
        const lateKn = data.filter(collecte => collecte.date_prevue.split(' ')[0] < collecte.date_done.split(' ')[0]);
        this.lateKn = lateKn.length;
        this.inTimeKn = data.length - lateKn.length;
    }
}
</script>
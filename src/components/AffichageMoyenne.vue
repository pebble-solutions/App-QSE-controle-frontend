<template>
    <div class="col-12 fs-7">
        Moyenne : {{ personnalAverage }} /10
    </div>

    <div class="col-12 fs-7 globalAverageColor">
        Générale : {{ generalAverage }} /10
    </div>
</template>

<style>
.globalAverageColor {
    color:rgba(128, 128, 128, 0.6);
}
</style>

<script>
export default {
    props: {
        personnalAverage: {
            type: Number,
            required: true,
        },
        generalAverage: {
            type: Number,
            required: true,
        },
    },
};
</script>
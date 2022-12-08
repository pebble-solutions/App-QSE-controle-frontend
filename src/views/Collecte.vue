<template>
    <div class="about">
        <h1 class="text-center mt-4">KN programmés</h1>
        {{}}
        <AlertMessage v-if="!knSelected">
            Choisir le KN a réaliser dans la liste de gauche.
        </AlertMessage>

        <RouterView></RouterView>
    </div>
</template>

<script>
import AlertMessage from '@/components/pebble-ui/AlertMessage.vue';

export default {
    computed: {
        knSelected() {
            console.log("knSelected", this.$route.params);
            if (!this.$route.params) {
                return false;
            }

            return true;
        }
    },

    components: {AlertMessage}
}
</script>
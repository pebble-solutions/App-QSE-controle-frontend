<template>
    <div class="container py-3">
        <h1 class="fs-3 mb-3">Passer un KN</h1>

        <AlertMessage>
            <div class="d-flex">
                <i class="bi bi-info-circle me-2"></i>
                <div>Choisissez le KN à réaliser dans la liste de gauche.</div>
            </div>
        </AlertMessage>
    </div>
</template>

<script>
import AlertMessage from '@/components/pebble-ui/AlertMessage.vue';

export default {
    components: {AlertMessage}
}
</script>
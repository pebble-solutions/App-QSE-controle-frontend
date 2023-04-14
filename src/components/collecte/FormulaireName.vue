<template>
    <asset-name :feminine="false" name="Formulaire" icon="bi-card-list" className="fw-light fs-7" :value="name" />
</template> 

<script>
import AssetName from '../AssetName.vue'

export default {
    props: {
        name: String
    },
    components: { AssetName }
}

</script>
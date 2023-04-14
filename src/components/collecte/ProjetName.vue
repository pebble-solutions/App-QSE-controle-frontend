<template>
    <asset-name :feminine="false" name="Projet" icon="bi-boxes" className="fw-light fs-7" :value="name" />
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
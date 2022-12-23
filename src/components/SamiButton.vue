<template>
    <div>
        <div class="btn-group" role="group" aria-label="Button SAMI">

                <button 
                    v-for="(button, index) in buttons" :key="'button-'+index"
                    type="button"
                    class="btn"
                    :class="{
                        'btn-outline-danger': 'i' == button && 'i' != modelValue || !modelValue && 'i' == button,
                        'btn-danger': 'i' == button && 'i' == modelValue,
    
                        'btn-outline-warning': 'm' == button && 'm' != modelValue || !modelValue && 'm' == button,
                        'btn-warning': 'm' == button && 'm' == modelValue,
    
                        'btn-outline-primary': 'a' == button && 'a' != modelValue || !modelValue && 'a' == button,
                        'btn-primary': 'a' == button && 'a' == modelValue,
    
                        'btn-outline-success': 's' == button && 's' != modelValue || !modelValue && 's' == button,
                        'btn-success': 's' == button && 's' == modelValue
                    }"
    
                    @click="updateSami(button)"
                >
                    {{button.toUpperCase()}}
                </button>
            </div>
    </div>
</template>

<script>

export default {
    props: {
        modelValue: String
    },

    emits: ['update:modelValue'],

    data() {
        return {
            buttons: ["s", "a", "m", "i"],
            newValue: null
        }
    },

    methods: {
        updateSami(sami) {
            this.$emit('update:modelValue', sami);
        }
    }
}
</script>
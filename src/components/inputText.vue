<template>
    <v-responsive >
        <v-text-field
        :label="label"
        variant="outlined"
        hide-details
        single-line
        density="comfortable"
        clearable
        dense
        v-bind="$attrs"
        @input="$emit('update:label', $event)"
        :error-messages="errorMessages"
        >
        </v-text-field>
    </v-responsive>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: '輸入文字',
  },
  errorMessages: String
});

const emit = defineEmits(['update:label'])
</script>
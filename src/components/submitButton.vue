<template>
    <v-btn
        :text="text"
        variant="text"
        class="rounded-xl b-1"
        density="comfortable"
        id=button
        >
    </v-btn>
</template>
<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: '新增'
  }
});
</script>

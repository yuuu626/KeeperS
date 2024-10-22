<template>
    <v-btn
        type="submit"
        :text="text"
        variant="text"
        class="rounded-xl b-1 font-weight-bold ms-3"
        density="comfortable"
        :ripple="false"
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
<style scoped>
.v-btn{
  max-width: 100px;
  display: flex ;
  align-items: center ;
  justify-content: center ;
}
</style>
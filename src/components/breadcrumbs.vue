<template>
    <div>
            <v-breadcrumbs 
            :items="title"
            class="ml-15 mt-5"
            >
                <template v-slot:divider>
                    <v-icon icon="mdi-chevron-right"></v-icon>
                </template>
            </v-breadcrumbs>
        </div> 
</template>
<script setup>
import { defineProps } from 'vue';
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: Array,
    default: () => ['']
  }
});
</script>
<style scoped>
.v-breadcrumbs{
    position: relative;
    top: 9%;
    left: 1%;
}
</style>
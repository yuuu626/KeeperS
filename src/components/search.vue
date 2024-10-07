<template>
    <!-- <v-responsive max-width="450px" class="my-5">
        <v-text-field
        v-model="internalValue"
            variant="outlined"
            label="搜尋"
            prepend-inner-icon="mdi-magnify"
            hide-details
            single-line
            density="comfortable"
            clearable
            @input="updateValue"
            @keydown.enter="$emit('search')"
        >
        </v-text-field>
    </v-responsive> -->
    <v-responsive max-width="450px">
        <v-text-field
            v-model="internalValue"
            variant="outlined"
            :label="label"
            prepend-inner-icon="mdi-magnify"
            hide-details
            single-line
            density="comfortable"
            clearable
            @input="updateValue"
            @keydown.enter="emitSearch"
        >
        </v-text-field>
    </v-responsive>
</template>
<script setup>
import { ref, watch , defineEmits, defineProps} from 'vue';

// Props
const props = defineProps({
  modelValue: { // v-model 使用的 prop 名稱
    type:String
  }, 
  label:{
    type:String,
    default:"搜尋"
  }
});

// Emitters
const emit = defineEmits(['update:modelValue', 'search']);

// Internal state
const internalValue = ref(props.modelValue);

// Watch for prop changes to update internal state
watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue;
});

// Method to update the value
const updateValue = () => {
  emit('update:modelValue', internalValue.value);
};
const emitSearch = () => {
  emit('search', internalValue.value);
};
</script>














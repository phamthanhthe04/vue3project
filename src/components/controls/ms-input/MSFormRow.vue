<template>
  <div class="ms-form-row" :class="layoutClass" :style="style">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Layout type: 'full', 'split', 'inline', 'vertical'
  layout: {
    type: String,
    default: 'full',
    validator: (v) => ['full', 'split', 'inline', 'vertical'].includes(v),
  },

  // Gap giữa các elements
  gap: {
    type: String,
    default: '16px',
  },

  // Style cho row
  style: {
    type: [Object, String],
    default: undefined,
  },
})

const layoutClass = computed(() => `ms-form-row--${props.layout}`)
</script>

<style scoped>
.ms-form-row {
  display: flex;
  margin-bottom: 16px;
}

.ms-form-row--full {
  flex-direction: column;
}

/* .ms-form-row--split {
  flex-direction: row;
  gap: v-bind(gap);
}

.ms-form-row--split > * {
  flex: 1;
} */

.ms-form-row--inline {
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.ms-form-row--inline label {
  min-width: 150px;
  flex-shrink: 0;
}

.ms-form-row--vertical {
  flex-direction: column;
  gap: 8px;
}
</style>

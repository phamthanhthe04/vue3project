<template>
  <div class="form-row" :class="layoutClass" :style="rowStyle">
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

  // Optional sizing controls for split layout
  itemBasis: { type: String, default: '' }, // e.g., '212px' or 'calc(425px / 2)'
  itemMax: { type: String, default: '' }, // same as above
  itemGrow: { type: [Number, String], default: 1 },
  itemShrink: { type: [Number, String], default: 1 },
})

const layoutClass = computed(() => `form-row--${props.layout}`)

const rowStyle = computed(() => ({
  '--row-gap': props.gap,
  '--item-basis': props.itemBasis || undefined,
  '--item-max': props.itemMax || undefined,
  '--item-grow': props.itemGrow,
  '--item-shrink': props.itemShrink,
}))
</script>

<style scoped>
.form-row {
  display: flex;
  margin-bottom: 16px;
}

.form-row--full {
  flex-direction: column;
}

.form-row--split {
  flex-direction: row;
  gap: var(--row-gap);
}

.form-row--split > * {
  flex: 1 1 0;
  min-width: 0;
  width: 100%;
  max-width: var(--item-max, none);
}

.form-row--inline {
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.form-row--inline label {
  min-width: 150px;
  flex-shrink: 0;
}

.form-row--vertical {
  flex-direction: column;
  gap: 8px;
}
</style>

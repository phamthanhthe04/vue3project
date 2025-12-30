<template>
  <div :class="rowClass"><slot /></div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  layout: { type: String, default: 'full' },
  gap: { type: String, default: '12px' },
})
const rowClass = computed(() => ({
  'ms-form-row': true,
  [`ms-form-row--${props.layout}`]: true,
}))
</script>

<style scoped>
.ms-form-row {
  display: flex;
  gap: var(--ms-form-row-gap, 12px);
  margin-bottom: 12px;
}
.ms-form-row--full {
  flex-direction: column;
}
.ms-form-row--split {
  flex-direction: row;
}
.ms-form-row--inline {
  align-items: center;
}
</style>

<template>
  <div class="ms-select" :class="rootClasses" :style="rootStyle">
    <!-- Label removed for MSLabel pattern. Use MSLabel outside. -->
    <!-- <label v-if="label" class="ms-select__label">
      {{ label }}
      <span v-if="required" class="ms-select__required">*</span>
    </label> -->

    <div class="ms-select__wrapper">
      <select
        v-model="selectValue"
        :id="id"
        :name="name"
        :disabled="disabled"
        class="ms-select__field"
        @change="handleChange"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="getOptionValue(option)"
          :value="getOptionValue(option)"
        >
          {{ getOptionLabel(option) }}
        </option>
      </select>

      <span class="ms-select__arrow icon-dropdown"></span>
    </div>

    <span v-if="error" class="ms-select__error">{{ error }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: { type: String, default: '' },
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, default: () => [] },
  label: { type: String, default: '' }, // Deprecated, use MSLabel outside
  placeholder: { type: String, default: 'Chọn...' },
  name: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false }, // Deprecated, use MSLabel outside
  error: { type: String, default: '' },

  // Support both array of strings và array of objects
  valueKey: { type: String, default: 'value' },
  labelKey: { type: String, default: 'label' },

  // Width of select
  width: { type: [String, Number], default: '100%' },
})

const emit = defineEmits(['update:modelValue', 'change'])

const selectValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const getOptionValue = (option) => {
  return typeof option === 'string' ? option : option[props.valueKey]
}

const getOptionLabel = (option) => {
  return typeof option === 'string' ? option : option[props.labelKey]
}

const handleChange = (e) => {
  emit('change', e.target.value)
}

// Tính toán style cho width
const normalizeWidth = (w) => {
  if (typeof w === 'number') return w + 'px'
  if (typeof w === 'string' && /^\d+$/.test(w)) return w + 'px'
  return w
}
const rootStyle = computed(() => ({ width: normalizeWidth(props.width) }))

const rootClasses = computed(() => ({
  'ms-select--error': !!props.error,
  'ms-select--disabled': props.disabled,
}))
</script>
<style scoped>
.ms-select {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ms-select__label {
  font-weight: 400;
  font-size: 14px;
  margin-bottom: 4px;
}
.ms-select__required {
  color: var(--ms-color-danger, #e74c3c);
  margin-left: 2px;
}
.ms-select__wrapper {
  position: relative;
}
.ms-select__field {
  width: 100%;
  padding: 8px 32px 8px 12px;
  font-size: 14px;
  border: 1px solid var(--ms-color-border, #d9d9d9);
  border-radius: 4px;
  appearance: none;
  background-color: var(--ms-color-background, #ffffff);
  cursor: pointer;
}
.ms-select__field:disabled {
  background-color: var(--ms-color-disabled-bg, #f5f5f5);
  cursor: not-allowed;
}
.ms-select__arrow {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 16px;
  color: var(--ms-color-text-secondary, #999999);
}
.ms-select__error {
  color: var(--ms-color-danger, #e74c3c);
  font-size: 12px;
  margin-top: 4px;
}
.ms-select--error .ms-select__field {
  border-color: var(--ms-color-danger, #e74c3c);
}
.ms-select--disabled .ms-select__field {
  background-color: var(--ms-color-disabled-bg, #f5f5f5);
  cursor: not-allowed;
}
</style>

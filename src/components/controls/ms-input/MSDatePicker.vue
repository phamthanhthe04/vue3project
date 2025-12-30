<template>
  <div
    class="ms-date-picker"
    :class="{ 'ms-date-picker--error': error, 'ms-date-picker--disabled': disabled }"
  >
    <label v-if="label" class="ms-date-picker__label">
      <span v-if="iconLabel" :class="['ms-date-picker__label-icon', iconLabel]" />
      {{ label }}
      <span v-if="required" class="ms-date-picker__required">*</span>
    </label>
    <div class="ms-date-picker__wrapper">
      <input
        ref="inputRef"
        :value="modelValue"
        type="date"
        class="ms-date-picker__input"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="handleInput"
      />
    </div>
    <span v-if="error" class="ms-date-picker__error">{{ error }}</span>
    <span v-if="helperText && !error" class="ms-date-picker__helper">{{ helperText }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  iconLabel: { type: String, default: '' },
  required: { type: Boolean, default: false },
  error: { type: String, default: '' },
  helperText: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])
const inputRef = ref(null)
const handleInput = (e) => {
  emit('update:modelValue', e.target.value)
}
</script>

<style scoped>
.ms-date-picker {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ms-date-picker__label {
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 4px;
}
.ms-date-picker__required {
  color: #ff4d4f;
  margin-left: 4px;
}
.ms-date-picker__wrapper {
  position: relative;
}
.ms-date-picker__input {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}
.ms-date-picker__input:focus {
  outline: none;
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
.ms-date-picker--error .ms-date-picker__input {
  border-color: #ff4d4f;
}
.ms-date-picker__error {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 2px;
}
.ms-date-picker__helper {
  color: #888;
  font-size: 12px;
  margin-top: 2px;
}
.ms-date-picker--disabled .ms-date-picker__input {
  background: #f5f5f5;
  color: #aaa;
  cursor: not-allowed;
}
</style>
